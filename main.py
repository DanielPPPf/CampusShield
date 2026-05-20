"""
CampusShield — API con FastAPI + uvicorn
Endpoints: GET/POST /api/incidents · GET /api/zones · GET /api/health
           GET /api/ai/insights · GET /api/ai/predict · GET /api/ai/clusters
"""
import os

# ── Cargar .env ANTES de cualquier import local (claude_enricher lee la key) ──
_env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
if os.path.exists(_env_path):
    with open(_env_path) as _f:
        for _line in _f:
            _line = _line.strip()
            if _line and not _line.startswith("#") and "=" in _line:
                _k, _, _v = _line.partition("=")
                os.environ.setdefault(_k.strip(), _v.strip())

import asyncio, json
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Literal, Optional

import joblib
import numpy as np
import pandas as pd
import psycopg2
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from psycopg2.extras import RealDictCursor
from pydantic import BaseModel

from ml.claude_enricher import enrich_incident, generate_security_briefing

# ── Config DB ─────────────────────────────────────────────────────────────────
DB_CONFIG = {
    "host":     os.environ.get("POSTGRES_HOST", "localhost"),
    "port":     int(os.environ.get("POSTGRES_PORT", 5433)),
    "dbname":   os.environ.get("POSTGRES_DB", "campusshield"),
    "user":     os.environ.get("POSTGRES_USER", "campusshield"),
    "password": os.environ.get("POSTGRES_PASSWORD", "CampusShield2025!"),
}

ZONE_NAMES = {
    "ad-portas":     "Ad Portas",
    "porton-cafe":   "Portón Café",
    "puente-madera": "Puente Madera",
}

# ── Estado compartido de modelos ML ──────────────────────────────────────────
ml: dict = {}


# ── Lifespan: cargar modelos al arrancar ──────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    def _load():
        return {
            "model":          joblib.load("ml/models/xgboost_risk.pkl"),
            "le_zone":        joblib.load("ml/models/le_zone.pkl"),
            "le_type":        joblib.load("ml/models/le_type.pkl"),
            "clusters":       joblib.load("ml/models/clusters.pkl"),
            "zone_hour_risk": pd.read_csv("ml/zone_hour_risk.csv"),
        }
    ml.update(await asyncio.to_thread(_load))
    yield
    ml.clear()


# ── App ───────────────────────────────────────────────────────────────────────
_raw_origins = os.environ.get(
    "CORS_ORIGINS",
    "http://localhost:9000,http://localhost:8000,http://127.0.0.1:9000",
)
CORS_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app = FastAPI(title="CampusShield API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Pydantic models ───────────────────────────────────────────────────────────
class IncidentCreate(BaseModel):
    type: str
    details: str = ""
    intensity: Literal["Low", "Medium", "High"] = "Medium"
    riskScore: Optional[float] = None
    location: str
    reportedBy: Optional[str] = None
    isAnonymous: bool = False


# ── DB helpers (sync — FastAPI ejecuta def en threadpool) ─────────────────────
def get_conn():
    return psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)


def _db_get_zone(zone_name: str):
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("SELECT id, location FROM zones WHERE name = %s", (zone_name,))
        return cur.fetchone()


def _db_get_user_id(email: str):
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        row = cur.fetchone()
        return row["id"] if row else None


def _db_insert_incident(body: IncidentCreate, zone_id, zone_location, user_id) -> int:
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            INSERT INTO incidents
                (type, details, intensity, status, validation_status,
                 risk_score, zone_id, reported_by, is_anonymous, location_point)
            VALUES (%s,%s,%s,'New','pending',%s,%s,%s,%s,%s)
            RETURNING id
        """, (
            body.type,
            body.details,
            body.intensity,
            body.riskScore,
            zone_id,
            user_id,
            body.isAnonymous,
            zone_location,
        ))
        new_id = cur.fetchone()["id"]
        conn.commit()
        return new_id


def _db_apply_enrichment(new_id: int, adjusted_risk: float, enrichment: dict,
                          zone_id, intensity: str):
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            UPDATE incidents
            SET risk_score = %s, admin_note = %s
            WHERE id = %s
        """, (adjusted_risk, json.dumps({"claude": enrichment}, ensure_ascii=False), new_id))
        if zone_id:
            delta = 15 if intensity == "High" else 5
            cur.execute("""
                UPDATE zones
                SET alert_count = alert_count + 1,
                    risk_score  = LEAST(100, risk_score + %s)
                WHERE id = %s
            """, (delta, zone_id))
        conn.commit()


def _db_fetch_recent_incidents(limit: int = 30) -> list:
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT i.type, i.details, i.intensity,
                   z.name AS location,
                   to_char(i.created_at, 'HH24:MI') AS time
            FROM incidents i
            LEFT JOIN zones z ON i.zone_id = z.id
            ORDER BY i.created_at DESC LIMIT %s
        """, (limit,))
        return cur.fetchall()


# ── ML helper ─────────────────────────────────────────────────────────────────
def predict_risk(zone_id: str, inc_type: str, hour: int,
                 dow: int | None = None, is_weekend: int = 0) -> float:
    if dow is None:
        dow = datetime.now().weekday()
    is_night = int(hour >= 20 or hour < 6)
    is_peak  = int((7 <= hour <= 9) or (16 <= hour <= 19))
    zone_enc = ml["le_zone"].transform([zone_id])[0]
    type_enc = ml["le_type"].transform([inc_type])[0]
    X = np.array([[zone_enc, type_enc, hour, dow, is_night, is_peak, is_weekend]])
    return float(round(ml["model"].predict(X)[0], 1))


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    try:
        with get_conn() as conn, conn.cursor() as cur:
            cur.execute("SELECT 1")
        return {"status": "ok", "db": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))


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
        return cur.fetchall()


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
        for r in rows:
            r["confirmations"] = r["confirmations"] or []
            r["denials"]       = r["denials"]       or []
        return rows


@app.post("/api/incidents", status_code=201)
async def create_incident(body: IncidentCreate):
    # Resolver zona y usuario en paralelo (ambos son sync → threadpool)
    zone_row, user_id = await asyncio.gather(
        asyncio.to_thread(_db_get_zone, body.location),
        asyncio.to_thread(_db_get_user_id, body.reportedBy)
        if body.reportedBy and not body.isAnonymous
        else asyncio.sleep(0, result=None),
    )
    zone_id       = zone_row["id"]       if zone_row else None
    zone_location = zone_row["location"] if zone_row else None

    # Insertar incidente base
    new_id = await asyncio.to_thread(
        _db_insert_incident, body, zone_id, zone_location, user_id
    )

    # Enriquecimiento con Claude (async nativo)
    base_risk  = body.riskScore or 50.0
    enrichment = await enrich_incident({
        "type":      body.type,
        "location":  body.location,
        "intensity": body.intensity,
        "details":   body.details,
        "time":      datetime.now().strftime("%H:%M"),
    }, float(base_risk))

    adjusted_risk = max(0.0, min(100.0, base_risk + enrichment["severity_adjustment"]))

    # Actualizar riesgo ajustado y zona
    await asyncio.to_thread(
        _db_apply_enrichment, new_id, adjusted_risk, enrichment, zone_id, body.intensity
    )

    return {"id": new_id, "status": "created", "enrichment": enrichment,
            "adjusted_risk": adjusted_risk}


# ── AI — Clusters ─────────────────────────────────────────────────────────────
@app.get("/api/ai/clusters")
def get_clusters():
    return ml["clusters"]


# ── AI — Predict ──────────────────────────────────────────────────────────────
@app.get("/api/ai/predict")
def predict(
    zone: str = Query(default="ad-portas"),
    type: str = Query(default="Theft/Robbery"),
    hour: Optional[int] = Query(default=None),
):
    if zone not in ml["le_zone"].classes_ or type not in ml["le_type"].classes_:
        raise HTTPException(status_code=400, detail="invalid zone or type")
    h    = hour if hour is not None else datetime.now().hour
    risk = predict_risk(zone, type, h)
    return {"zone": zone, "type": type, "hour": h, "predicted_risk": risk}


# ── AI — Insights ─────────────────────────────────────────────────────────────
@app.get("/api/ai/insights")
async def ai_insights():
    now  = datetime.now()
    hour = now.hour
    dow  = now.weekday()
    is_weekend = int(dow >= 5)

    zones_ids = ["ad-portas", "puente-madera", "porton-cafe"]
    types     = ml["le_type"].classes_.tolist()

    # Riesgo actual por zona — puro cómputo, sin I/O
    zone_risks = []
    for zid in zones_ids:
        risks = [predict_risk(zid, t, hour, dow, is_weekend) for t in types]
        zone_risks.append({
            "zone_id":   zid,
            "zone_name": ZONE_NAMES[zid],
            "risk_now":  round(float(np.mean(risks)), 1),
        })
    zone_risks.sort(key=lambda x: -x["risk_now"])
    worst  = zone_risks[0]
    safest = zone_risks[-1]

    # Riesgo por hora para gráficos
    hourly = {
        zid: (
            ml["zone_hour_risk"][ml["zone_hour_risk"]["zone"] == zid]
            .sort_values("hour")[["hour", "predicted_risk"]]
            .to_dict("records")
        )
        for zid in zones_ids
    }

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

    risk_reduction = round(
        ((worst["risk_now"] - safest["risk_now"]) / max(worst["risk_now"], 1)) * 100
    )

    # Briefing de Claude + incidentes recientes — en paralelo
    recent_incidents, _ = await asyncio.gather(
        asyncio.to_thread(_db_fetch_recent_incidents),
        asyncio.sleep(0),  # placeholder para simetría
    )
    briefing = await generate_security_briefing(list(recent_incidents), zone_risks)

    return {
        "generated_at":    now.isoformat(),
        "current_hour":    hour,
        "time_slot":       slot,
        "time_risk_level": level,
        "zone_risks":      zone_risks,
        "worst_zone":      worst,
        "safest_zone":     safest,
        "risk_reduction":  max(risk_reduction, 0),
        "hourly_risk":     hourly,
        "clusters":        ml["clusters"],
        "model_mae":       10.26,
        "briefing":        briefing,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=3000, reload=True,
                reload_dirs=[os.path.dirname(os.path.abspath(__file__))])
