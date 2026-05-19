"""
CampusShield — Generador de datos sintéticos de incidentes
Simula ~800 incidentes realistas para el campus de La Sabana y los inserta en PostgreSQL.
Patrones basados en el estudio de campo del Capstone.
"""
import random, numpy as np, pandas as pd
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import execute_values

random.seed(42)
np.random.seed(42)

# ── Zonas con coordenadas y perfil de riesgo ──────────────────────────────────
ZONES = [
    {
        "id": "ad-portas",
        "name": "Ad Portas",
        "lat": 4.863640, "lng": -74.031723,
        "lat_std": 0.0003, "lng_std": 0.0004,
        "base_risk": 0.55,       # probabilidad base de incidente
        "density": "High",
    },
    {
        "id": "puente-madera",
        "name": "Puente Madera",
        "lat": 4.858675, "lng": -74.031506,
        "lat_std": 0.0002, "lng_std": 0.0002,
        "base_risk": 0.80,
        "density": "Medium",
    },
    {
        "id": "porton-cafe",
        "name": "Portón Café",
        "lat": 4.863549, "lng": -74.037457,
        "lat_std": 0.0002, "lng_std": 0.0003,
        "base_risk": 0.15,
        "density": "Low",
    },
]

# ── Tipos y sus distribuciones por zona ───────────────────────────────────────
INCIDENT_TYPES = {
    "ad-portas":     ["Suspicious Person", "Suspicious Person", "Theft/Robbery", "Dark Zone", "Maintenance"],
    "puente-madera": ["Theft/Robbery", "Theft/Robbery", "Suspicious Person", "Dark Zone", "Dark Zone"],
    "porton-cafe":   ["Maintenance", "Dark Zone", "Suspicious Person", "Theft/Robbery"],
}

INTENSITIES = {
    "Theft/Robbery":     "High",
    "Suspicious Person": "Medium",
    "Dark Zone":         "Medium",
    "Maintenance":       "Information",
}

# ── Patrones horarios (probabilidad relativa por hora) ────────────────────────
# Picos: entrada mañana (7-9h), salida tarde (16-19h), noche (20-23h)
HOUR_WEIGHTS = [
    0.1, 0.1, 0.1, 0.1, 0.1, 0.2,   # 00-05
    0.4, 0.9, 1.0, 0.7, 0.5, 0.5,   # 06-11
    0.6, 0.6, 0.5, 0.5, 1.0, 1.2,   # 12-17
    1.3, 1.1, 0.9, 0.8, 0.6, 0.3,   # 18-23
]

# Día de semana (lunes=0): más incidentes entre semana
DAY_WEIGHTS = [1.2, 1.1, 1.1, 1.0, 1.3, 0.5, 0.2]

def generate_incidents(n=800):
    incidents = []
    base_date = datetime.now() - timedelta(days=180)  # últimos 6 meses

    for _ in range(n):
        zone = random.choices(ZONES, weights=[z["base_risk"] for z in ZONES])[0]
        inc_type = random.choice(INCIDENT_TYPES[zone["id"]])

        # Timestamp con patrones horarios y de día
        days_offset = random.randint(0, 180)
        dt = base_date + timedelta(days=days_offset)
        hour = random.choices(range(24), weights=HOUR_WEIGHTS)[0]
        minute = random.randint(0, 59)
        dow = dt.weekday()
        # Re-sample si el día no cuadra con los pesos (approx)
        if random.random() > DAY_WEIGHTS[dow] / 1.3:
            continue
        dt = dt.replace(hour=hour, minute=minute, second=0, microsecond=0)

        # Coordenadas con ruido gaussiano alrededor del centroide de la zona
        lat = np.random.normal(zone["lat"], zone["lat_std"])
        lng = np.random.normal(zone["lng"], zone["lng_std"])

        # Risk score con ruido
        base_score = {"High": 80, "Medium": 50, "Information": 15}[INTENSITIES[inc_type]]
        risk_score = int(np.clip(np.random.normal(base_score, 12), 5, 100))

        incidents.append({
            "type":              inc_type,
            "intensity":         INTENSITIES[inc_type],
            "zone_id":           zone["id"],
            "zone_name":         zone["name"],
            "lat":               lat,
            "lng":               lng,
            "risk_score":        risk_score,
            "hour":              hour,
            "dow":               dt.weekday(),
            "created_at":        dt,
            "validation_status": random.choices(
                ["verified", "pending", "discarded"],
                weights=[0.70, 0.20, 0.10]
            )[0],
            "is_anonymous":      random.random() < 0.30,
        })

    return pd.DataFrame(incidents)

def seed_database(df):
    conn = psycopg2.connect(
        host="localhost", port=5433,
        dbname="campusshield", user="campusshield", password="CampusShield2025!"
    )
    cur = conn.cursor()

    # Obtener un user_id de sistema para los reportes sintéticos
    cur.execute("SELECT id FROM users WHERE email = 'admin@unisabana.edu.co'")
    admin_id = cur.fetchone()[0]

    rows = []
    for _, r in df.iterrows():
        rows.append((
            r["type"], "", r["intensity"], "Resolved",
            r["validation_status"], int(r["risk_score"]),
            r["zone_id"], admin_id if not r["is_anonymous"] else None,
            r["is_anonymous"],
            f"SRID=4326;POINT({r['lng']} {r['lat']})",
            r["created_at"],
        ))

    execute_values(cur, """
        INSERT INTO incidents
            (type, details, intensity, status, validation_status,
             risk_score, zone_id, reported_by, is_anonymous,
             location_point, created_at)
        VALUES %s
        ON CONFLICT DO NOTHING
    """, rows)

    conn.commit()
    cur.close()
    conn.close()
    print(f"Insertados {len(rows)} incidentes sintéticos en PostgreSQL.")

if __name__ == "__main__":
    print("Generando datos sintéticos...")
    df = generate_incidents(800)
    print(f"Generados {len(df)} incidentes.")
    print(df["zone_name"].value_counts())
    print(df["type"].value_counts())
    df.to_csv("ml/incidents_synthetic.csv", index=False)
    print("CSV guardado en ml/incidents_synthetic.csv")
    seed_database(df)
