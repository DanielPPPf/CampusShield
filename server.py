"""
CampusShield — API mínima para demo
Endpoints: GET/POST /api/incidents · GET /api/zones · GET /api/health
           GET /api/ai/insights · GET /api/ai/predict · GET /api/ai/clusters
"""
import os, json
from datetime import datetime

# Cargar .env si existe (dev local)
_env_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(_env_path):
    with open(_env_path) as _f:
        for _line in _f:
            _line = _line.strip()
            if _line and not _line.startswith("#") and "=" in _line:
                _k, _, _v = _line.partition("=")
                os.environ.setdefault(_k.strip(), _v.strip())
from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import joblib, numpy as np, pandas as pd
from ml.claude_enricher import enrich_incident, generate_security_briefing

app = Flask(__name__)
CORS(app, origins=["http://localhost:9000", "http://localhost:8000", "http://127.0.0.1:9000"])

DB_CONFIG = {
    "host":     "localhost",
    "port":     5433,
    "dbname":   "campusshield",
    "user":     "campusshield",
    "password": "CampusShield2025!",
}

def get_conn():
    return psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)

# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    try:
        with get_conn() as conn, conn.cursor() as cur:
            cur.execute("SELECT 1")
        return jsonify({"status": "ok", "db": "connected"})
    except Exception as e:
        return jsonify({"status": "error", "db": str(e)}), 503

# ── Zones ─────────────────────────────────────────────────────────────────────

@app.get("/api/zones")
def get_zones():
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT id, name, density, risk_score AS "riskScore",
                   alert_count AS alerts,
                   ST_Y(location::geometry) AS lat,
                   ST_X(location::geometry) AS lng
            FROM zones ORDER BY risk_score DESC
        """)
        return jsonify(cur.fetchall())

# ── Incidents ─────────────────────────────────────────────────────────────────

@app.get("/api/incidents")
def get_incidents():
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT i.id, i.type, i.details, i.intensity, i.status,
                   i.validation_status AS "validationStatus",
                   i.risk_score AS "riskScore", i.is_anonymous AS "isAnonymous",
                   i.admin_note AS "adminNote",
                   z.name AS location,
                   to_char(i.created_at, 'YYYY-MM-DD HH24:MI') AS time,
                   u.email AS "reportedBy",
                   COALESCE(confirms.emails, '[]'::json) AS confirmations,
                   COALESCE(denials.emails,  '[]'::json) AS denials
            FROM incidents i
            LEFT JOIN zones z ON i.zone_id = z.id
            LEFT JOIN users u ON i.reported_by = u.id
            LEFT JOIN LATERAL (
                SELECT json_agg(u2.email) AS emails
                FROM validation_votes v JOIN users u2 ON v.voter_id = u2.id
                WHERE v.incident_id = i.id AND v.vote = 'confirm'
            ) confirms ON true
            LEFT JOIN LATERAL (
                SELECT json_agg(u3.email) AS emails
                FROM validation_votes v JOIN users u3 ON v.voter_id = u3.id
                WHERE v.incident_id = i.id AND v.vote = 'deny'
            ) denials ON true
            ORDER BY i.created_at DESC
        """)
        rows = cur.fetchall()
        # Convertir confirmations/denials a lista Python
        for r in rows:
            r["confirmations"] = r["confirmations"] if r["confirmations"] else []
            r["denials"]       = r["denials"]       if r["denials"]       else []
        return jsonify(rows)

@app.post("/api/incidents")
def create_incident():
    data      = request.get_json()
    email     = data.get("reportedBy")
    zone_name = data.get("location")

    with get_conn() as conn, conn.cursor() as cur:
        # Resolver user_id
        user_id = None
        if email and not data.get("isAnonymous"):
            cur.execute("SELECT id FROM users WHERE email = %s", (email,))
            row = cur.fetchone()
            user_id = row["id"] if row else None

        # Resolver zone_id y coordenada
        cur.execute("SELECT id, location FROM zones WHERE name = %s", (zone_name,))
        zone_row = cur.fetchone()
        zone_id  = zone_row["id"]       if zone_row else None

        cur.execute("""
            INSERT INTO incidents
                (type, details, intensity, status, validation_status,
                 risk_score, zone_id, reported_by, is_anonymous, location_point)
            VALUES (%s,%s,%s,'New','pending',%s,%s,%s,%s,%s)
            RETURNING id
        """, (
            data.get("type"),
            data.get("details", ""),
            data.get("intensity", "Medium"),
            data.get("riskScore"),
            zone_id,
            user_id,
            bool(data.get("isAnonymous", False)),
            zone_row["location"] if zone_row else None,
        ))
        new_id = cur.fetchone()["id"]

        # Enriquecimiento semántico con Claude (async best-effort)
        base_risk = data.get("riskScore") or 50.0
        enrichment = enrich_incident({
            "type":      data.get("type"),
            "location":  zone_name,
            "intensity": data.get("intensity", "Medium"),
            "details":   data.get("details", ""),
            "time":      datetime.now().strftime("%H:%M"),
        }, float(base_risk))

        adjusted_risk = max(0, min(100, float(base_risk) + enrichment["severity_adjustment"]))

        # Persistir enriquecimiento en la BD
        cur.execute("""
            UPDATE incidents
            SET risk_score  = %s,
                admin_note  = %s
            WHERE id = %s
        """, (
            adjusted_risk,
            json.dumps({
                "claude": enrichment,
            }, ensure_ascii=False),
            new_id,
        ))

        # Actualizar risk_score y alert_count de la zona
        if zone_id:
            delta = 15 if data.get("intensity") == "High" else 5
            cur.execute("""
                UPDATE zones
                SET alert_count = alert_count + 1,
                    risk_score  = LEAST(100, risk_score + %s)
                WHERE id = %s
            """, (delta, zone_id))

        conn.commit()
        return jsonify({
            "id": new_id,
            "status": "created",
            "enrichment": enrichment,
            "adjusted_risk": adjusted_risk,
        }), 201

# ── Cargar modelos ML ─────────────────────────────────────────────────────────
_model    = joblib.load("ml/models/xgboost_risk.pkl")
_le_zone  = joblib.load("ml/models/le_zone.pkl")
_le_type  = joblib.load("ml/models/le_type.pkl")
_clusters = joblib.load("ml/models/clusters.pkl")
_zone_hour_risk = pd.read_csv("ml/zone_hour_risk.csv")

ZONE_NAMES = {
    "ad-portas":     "Ad Portas",
    "porton-cafe":   "Portón Café",
    "puente-madera": "Puente Madera",
}

def predict_risk(zone_id, inc_type, hour, dow=None, is_weekend=0):
    if dow is None:
        dow = datetime.now().weekday()
    is_night = int(hour >= 20 or hour < 6)
    is_peak  = int((7 <= hour <= 9) or (16 <= hour <= 19))
    zone_enc = _le_zone.transform([zone_id])[0]
    type_enc = _le_type.transform([inc_type])[0]
    X = np.array([[zone_enc, type_enc, hour, dow, is_night, is_peak, is_weekend]])
    return float(round(_model.predict(X)[0], 1))

# ── AI Endpoints ──────────────────────────────────────────────────────────────

@app.get("/api/ai/clusters")
def get_clusters():
    return jsonify(_clusters)

@app.get("/api/ai/predict")
def predict():
    zone_id  = request.args.get("zone", "ad-portas")
    inc_type = request.args.get("type", "Theft/Robbery")
    hour     = int(request.args.get("hour", datetime.now().hour))
    if zone_id not in _le_zone.classes_ or inc_type not in _le_type.classes_:
        return jsonify({"error": "invalid zone or type"}), 400
    risk = predict_risk(zone_id, inc_type, hour)
    return jsonify({"zone": zone_id, "type": inc_type, "hour": hour, "predicted_risk": risk})

@app.get("/api/ai/insights")
def ai_insights():
    now  = datetime.now()
    hour = now.hour
    dow  = now.weekday()
    is_weekend = int(dow >= 5)

    zones_ids = ["ad-portas", "puente-madera", "porton-cafe"]
    types     = _le_type.classes_.tolist()

    # Riesgo actual por zona (promedio de todos los tipos en la hora actual)
    zone_risks = []
    for zid in zones_ids:
        risks = [predict_risk(zid, t, hour, dow, is_weekend) for t in types]
        avg   = round(float(np.mean(risks)), 1)
        zone_risks.append({
            "zone_id":   zid,
            "zone_name": ZONE_NAMES[zid],
            "risk_now":  avg,
        })

    zone_risks.sort(key=lambda x: -x["risk_now"])
    worst  = zone_risks[0]
    safest = zone_risks[-1]

    # Riesgo por hora del día para cada zona (para gráfico de tendencia)
    hourly = {}
    for zid in zones_ids:
        hourly[zid] = (
            _zone_hour_risk[_zone_hour_risk["zone"] == zid]
            .sort_values("hour")[["hour", "predicted_risk"]]
            .to_dict("records")
        )

    # Franja horaria
    if hour < 6:
        slot, level = "00–06h", "high"
    elif hour < 12:
        slot, level = "06–12h", "low"
    elif hour < 18:
        slot, level = "12–18h", "moderate"
    elif hour < 20:
        slot, level = "18–20h", "moderate"
    else:
        slot, level = "20–24h", "high"

    risk_reduction = round(((worst["risk_now"] - safest["risk_now"]) / max(worst["risk_now"], 1)) * 100)

    # Obtener incidentes recientes para el briefing de Claude
    try:
        with get_conn() as conn, conn.cursor() as cur:
            cur.execute("""
                SELECT i.type, i.details, i.intensity,
                       z.name AS location,
                       to_char(i.created_at, 'HH24:MI') AS time
                FROM incidents i
                LEFT JOIN zones z ON i.zone_id = z.id
                ORDER BY i.created_at DESC LIMIT 30
            """)
            recent_incidents = cur.fetchall()
    except Exception:
        recent_incidents = []

    briefing = generate_security_briefing(list(recent_incidents), zone_risks)

    return jsonify({
        "generated_at":    now.isoformat(),
        "current_hour":    hour,
        "time_slot":       slot,
        "time_risk_level": level,
        "zone_risks":      zone_risks,
        "worst_zone":      worst,
        "safest_zone":     safest,
        "risk_reduction":  max(risk_reduction, 0),
        "hourly_risk":     hourly,
        "clusters":        _clusters,
        "model_mae":       10.26,
        "briefing":        briefing,
    })

if __name__ == "__main__":
    app.run(port=3000, debug=True)
