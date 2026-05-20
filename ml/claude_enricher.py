"""
CampusShield — Enriquecimiento semántico con Claude API
  enrich_incident()         → ajusta risk score, extrae tags, clasifica urgencia
  generate_security_briefing() → análisis ejecutivo de patrones recientes
"""
import os, json, logging
from datetime import datetime

log = logging.getLogger(__name__)

try:
    from anthropic import AsyncAnthropic as _AsyncAnthropic
    _has_sdk = True
except ImportError:
    _AsyncAnthropic = None
    _has_sdk = False
    log.warning("anthropic SDK not installed — Claude enrichment disabled")

_client: "_AsyncAnthropic | None" = None


def _get_client():
    """Instancia el cliente de forma lazy para que siempre lea la key actual."""
    global _client
    if not _has_sdk:
        return None
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        return None
    if _client is None:
        _client = _AsyncAnthropic(api_key=api_key)
    return _client


def _enabled() -> bool:
    return _has_sdk and bool(os.environ.get("ANTHROPIC_API_KEY", ""))


async def enrich_incident(incident_data: dict, xgboost_score: float) -> dict:
    """
    Analiza la descripción libre del incidente con Claude y devuelve:
      severity_adjustment  int   [-20, +20]  ajuste al score XGBoost
      tags                 list  etiquetas semánticas extraídas
      urgency              str   "low" | "medium" | "high" | "critical"
      recommendation       str   acción recomendada para el guardia/admin
      is_pattern           bool  ¿sugiere patrón recurrente?
    Fallback: valores neutros si la API no está disponible.
    """
    if not _enabled():
        return _fallback_enrichment(xgboost_score)

    description = incident_data.get("details", "").strip()
    if not description:
        return _fallback_enrichment(xgboost_score)

    prompt = f"""Eres un analista de seguridad universitaria. Analiza el siguiente reporte de incidente en el campus de la Universidad de La Sabana (Colombia) y devuelve un JSON estructurado.

INCIDENTE:
- Tipo: {incident_data.get('type', 'Desconocido')}
- Zona: {incident_data.get('location', 'Desconocida')}
- Intensidad reportada: {incident_data.get('intensity', 'Medium')}
- Score de riesgo base (XGBoost): {xgboost_score:.1f}/100
- Descripción libre: "{description}"
- Hora del reporte: {incident_data.get('time', datetime.now().strftime('%H:%M'))}

Devuelve ÚNICAMENTE un JSON válido con esta estructura exacta:
{{
  "severity_adjustment": <entero entre -20 y +20>,
  "tags": [<lista de 2-5 etiquetas cortas en español>],
  "urgency": "<low|medium|high|critical>",
  "recommendation": "<acción concreta en 1-2 oraciones>",
  "is_pattern": <true|false>,
  "reasoning": "<explicación breve de tu análisis>"
}}

Criterios:
- severity_adjustment positivo si la descripción revela factores agravantes no capturados por el modelo (armas, múltiples atacantes, víctimas vulnerables)
- severity_adjustment negativo si la descripción sugiere menor gravedad (falsa alarma, menor)
- urgency "critical" solo si hay riesgo inmediato de vida
- is_pattern true si la descripción menciona reincidencia o modus operandi reconocible"""

    try:
        response = await _get_client().messages.create(
            model="claude-opus-4-6",
            max_tokens=600,
            thinking={"type": "adaptive"},
            messages=[{"role": "user", "content": prompt}],
        )
        # Extraer texto de la respuesta (puede haber bloque thinking + text)
        text = ""
        for block in response.content:
            if block.type == "text":
                text = block.text
                break

        # Parsear JSON (Claude puede añadir ```json ... ```)
        text = text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        result = json.loads(text.strip())

        # Validar y sanear
        result["severity_adjustment"] = max(-20, min(20, int(result.get("severity_adjustment", 0))))
        result["tags"] = result.get("tags", [])[:5]
        result["urgency"] = result.get("urgency", "medium") if result.get("urgency") in ("low", "medium", "high", "critical") else "medium"
        result["recommendation"] = str(result.get("recommendation", ""))[:300]
        result["is_pattern"] = bool(result.get("is_pattern", False))
        result["claude_used"] = True
        return result

    except Exception as e:
        log.error("Claude enrich_incident error: %s", e)
        return _fallback_enrichment(xgboost_score)


async def generate_security_briefing(incidents: list, zone_risks: list) -> dict:
    """
    Analiza los últimos N incidentes y el riesgo actual por zona.
    Devuelve un briefing ejecutivo con:
      executive_summary    str
      patterns_detected    list[str]
      recommended_actions  list[str]
      risk_trend           str  "rising" | "stable" | "falling"
      alert_level          str  "green" | "yellow" | "orange" | "red"
      generated_by_claude  bool
    """
    if not _enabled() or not incidents:
        return _fallback_briefing(zone_risks)

    # Limitar a los últimos 20 incidentes con descripción
    recent = [i for i in incidents if i.get("details")][:20]
    if not recent:
        return _fallback_briefing(zone_risks)

    incidents_text = "\n".join(
        f"- [{i.get('time','?')}] {i.get('type','?')} en {i.get('location','?')} "
        f"(intensidad {i.get('intensity','?')}): {i.get('details','')[:120]}"
        for i in recent
    )

    zones_text = "\n".join(
        f"- {z['zone_name']}: riesgo actual {z['risk_now']:.1f}/100"
        for z in zone_risks
    )

    prompt = f"""Eres el analista de seguridad jefe del campus de la Universidad de La Sabana (Chía, Colombia). Basándote en los incidentes recientes y el riesgo actual por zona, genera un briefing ejecutivo de seguridad.

RIESGO ACTUAL POR ZONA:
{zones_text}

INCIDENTES RECIENTES ({len(recent)}):
{incidents_text}

Devuelve ÚNICAMENTE un JSON válido:
{{
  "executive_summary": "<párrafo ejecutivo de 2-3 oraciones en español>",
  "patterns_detected": [<lista de 2-4 patrones identificados, cada uno en 1 oración>],
  "recommended_actions": [<lista de 2-4 acciones concretas y priorizadas>],
  "risk_trend": "<rising|stable|falling>",
  "alert_level": "<green|yellow|orange|red>",
  "hotspot_insight": "<observación clave sobre la zona de mayor riesgo>"
}}

Criterios para alert_level:
- green: situación normal, sin incidentes preocupantes
- yellow: algunos incidentes, atención moderada recomendada
- orange: patrón preocupante, refuerzo de seguridad recomendado
- red: situación crítica, acción inmediata requerida"""

    try:
        response = await _get_client().messages.create(
            model="claude-opus-4-6",
            max_tokens=800,
            thinking={"type": "adaptive"},
            messages=[{"role": "user", "content": prompt}],
        )
        text = ""
        for block in response.content:
            if block.type == "text":
                text = block.text
                break

        text = text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        result = json.loads(text.strip())

        result["generated_by_claude"] = True
        result["incidents_analyzed"] = len(recent)
        result["generated_at"] = datetime.now().isoformat()
        return result

    except Exception as e:
        log.error("Claude briefing error: %s", e)
        return _fallback_briefing(zone_risks)


# ── Fallbacks ─────────────────────────────────────────────────────────────────

def _fallback_enrichment(xgboost_score: float) -> dict:
    urgency = "low" if xgboost_score < 40 else "medium" if xgboost_score < 65 else "high"
    return {
        "severity_adjustment": 0,
        "tags": [],
        "urgency": urgency,
        "recommendation": "Seguir protocolo estándar de seguridad.",
        "is_pattern": False,
        "claude_used": False,
    }


def _fallback_briefing(zone_risks: list) -> dict:
    worst = max(zone_risks, key=lambda z: z.get("risk_now", 0)) if zone_risks else {}
    level = "green"
    if worst.get("risk_now", 0) >= 70:
        level = "orange"
    elif worst.get("risk_now", 0) >= 50:
        level = "yellow"
    return {
        "executive_summary": "Análisis basado en modelo XGBoost. Integración con IA generativa no disponible.",
        "patterns_detected": ["Datos insuficientes para análisis de patrones semánticos."],
        "recommended_actions": ["Revisar incidentes recientes manualmente.", "Aumentar patrullaje en zona de mayor riesgo."],
        "risk_trend": "stable",
        "alert_level": level,
        "hotspot_insight": f"Zona de mayor riesgo: {worst.get('zone_name', 'N/A')}",
        "generated_by_claude": False,
        "incidents_analyzed": 0,
        "generated_at": datetime.now().isoformat(),
    }
