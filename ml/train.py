"""
CampusShield — Entrenamiento de modelos ML
  1. DBSCAN  → clustering de hotspots geoespaciales
  2. XGBoost → predicción de riesgo por zona + franja horaria
"""
import pandas as pd
import numpy as np
import joblib
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import xgboost as xgb

# ── 1. Cargar datos ───────────────────────────────────────────────────────────
df = pd.read_csv("ml/incidents_synthetic.csv", parse_dates=["created_at"])
print(f"Datos cargados: {len(df)} incidentes")

# ── 2. DBSCAN — clustering geoespacial ───────────────────────────────────────
print("\n--- DBSCAN ---")

coords = df[["lat", "lng"]].values
# eps en radianes (50m aprox en latitud 4°N): 50m / 6371000m
eps_rad = 50 / 6_371_000

db = DBSCAN(
    eps=eps_rad,
    min_samples=5,
    algorithm="ball_tree",
    metric="haversine"
).fit(np.radians(coords))

df["cluster"] = db.labels_
n_clusters = len(set(db.labels_)) - (1 if -1 in db.labels_ else 0)
n_noise    = (db.labels_ == -1).sum()
print(f"Clusters encontrados: {n_clusters} | Ruido (outliers): {n_noise}")

# Centroides de cada cluster con risk score promedio
cluster_summary = []
for cid in sorted(set(db.labels_)):
    if cid == -1:
        continue
    mask = df["cluster"] == cid
    cluster_summary.append({
        "cluster_id":  int(cid),
        "lat":         float(df.loc[mask, "lat"].mean()),
        "lng":         float(df.loc[mask, "lng"].mean()),
        "count":       int(mask.sum()),
        "avg_risk":    float(df.loc[mask, "risk_score"].mean()),
        "top_type":    df.loc[mask, "type"].mode()[0],
        "zone":        df.loc[mask, "zone_name"].mode()[0],
    })

cluster_df = pd.DataFrame(cluster_summary)
cluster_df.to_csv("ml/clusters.csv", index=False)
print(cluster_df)

joblib.dump(db, "ml/models/dbscan.pkl")
joblib.dump(cluster_df.to_dict("records"), "ml/models/clusters.pkl")
print("DBSCAN guardado.")

# ── 3. XGBoost — predicción de risk score ─────────────────────────────────────
print("\n--- XGBoost ---")

# Feature engineering
le_zone = LabelEncoder()
le_type = LabelEncoder()

df["zone_enc"] = le_zone.fit_transform(df["zone_id"])
df["type_enc"] = le_type.fit_transform(df["type"])
df["hour"]     = pd.to_datetime(df["created_at"]).dt.hour
df["dow"]      = pd.to_datetime(df["created_at"]).dt.dayofweek
df["is_night"] = ((df["hour"] >= 20) | (df["hour"] < 6)).astype(int)
df["is_peak"]  = (((df["hour"] >= 7) & (df["hour"] <= 9)) |
                  ((df["hour"] >= 16) & (df["hour"] <= 19))).astype(int)
df["is_weekend"] = (df["dow"] >= 5).astype(int)

FEATURES = ["zone_enc", "type_enc", "hour", "dow", "is_night", "is_peak", "is_weekend"]
TARGET   = "risk_score"

X = df[FEATURES]
y = df[TARGET]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = xgb.XGBRegressor(
    n_estimators=200,
    max_depth=4,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    verbosity=0,
)
model.fit(X_train, y_train)

preds = model.predict(X_test)
mae   = mean_absolute_error(y_test, preds)
print(f"MAE en test: {mae:.2f} puntos de riesgo")

# Feature importance
importance = dict(zip(FEATURES, model.feature_importances_))
print("Feature importance:", {k: round(v, 3) for k, v in sorted(importance.items(), key=lambda x: -x[1])})

joblib.dump(model,   "ml/models/xgboost_risk.pkl")
joblib.dump(le_zone, "ml/models/le_zone.pkl")
joblib.dump(le_type, "ml/models/le_type.pkl")
print("XGBoost guardado.")

# ── 4. Pre-calcular tabla de predicciones por zona × hora ────────────────────
print("\n--- Pre-calculando predicciones ---")

zones    = ["ad-portas", "porton-cafe", "puente-madera"]
types    = le_type.classes_.tolist()
rows     = []

for zone in zones:
    for hour in range(24):
        for inc_type in types:
            dow      = 1          # martes (día representativo)
            is_night = int(hour >= 20 or hour < 6)
            is_peak  = int((7 <= hour <= 9) or (16 <= hour <= 19))
            row = {
                "zone_enc":  le_zone.transform([zone])[0],
                "type_enc":  le_type.transform([inc_type])[0],
                "hour":      hour,
                "dow":       dow,
                "is_night":  is_night,
                "is_peak":   is_peak,
                "is_weekend": 0,
            }
            rows.append({**row, "zone": zone, "type": inc_type, "hour_val": hour})

pred_df = pd.DataFrame(rows)
pred_df["predicted_risk"] = model.predict(pred_df[FEATURES]).round(1)
pred_df.to_csv("ml/predictions_table.csv", index=False)

# Riesgo promedio por zona y hora (para el heatmap temporal)
zone_hour_risk = (
    pred_df.groupby(["zone", "hour_val"])["predicted_risk"]
    .mean().round(1)
    .reset_index()
    .rename(columns={"hour_val": "hour"})
)
zone_hour_risk.to_csv("ml/zone_hour_risk.csv", index=False)
print("Tabla de predicciones guardada.")
print("\nEntrenamiento completo.")
