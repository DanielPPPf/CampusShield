"""
CampusShield — API mínima para demo
Conecta el frontend (localStorage) con PostgreSQL.
Endpoints: GET/POST /api/incidents · GET /api/zones · GET /api/health
"""
import os, json
from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor

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
        return jsonify({"id": new_id, "status": "created"}), 201

if __name__ == "__main__":
    app.run(port=3000, debug=True)
