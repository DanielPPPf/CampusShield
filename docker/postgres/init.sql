-- ═══════════════════════════════════════════════════════════════════════════
-- CampusShield — Esquema inicial de base de datos
-- PostgreSQL 15 + PostGIS
-- ═══════════════════════════════════════════════════════════════════════════

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── Tipos ENUM ───────────────────────────────────────────────────────────────
CREATE TYPE user_role        AS ENUM ('student', 'admin', 'security');
CREATE TYPE incident_status  AS ENUM ('New', 'In Attention', 'Resolved');
CREATE TYPE incident_valid   AS ENUM ('pending', 'verified', 'discarded');
CREATE TYPE incident_intens  AS ENUM ('High', 'Medium', 'Information');
CREATE TYPE zone_density     AS ENUM ('High', 'Medium', 'Low');
CREATE TYPE vote_type        AS ENUM ('confirm', 'deny');
CREATE TYPE lang_pref        AS ENUM ('es', 'en');

-- ── Tabla: users ─────────────────────────────────────────────────────────────
CREATE TABLE users (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(120) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    password_hash   TEXT         NOT NULL,           -- bcrypt
    role            user_role    NOT NULL DEFAULT 'student',
    language_pref   lang_pref    NOT NULL DEFAULT 'es',
    alert_radius_m  INTEGER      NOT NULL DEFAULT 500 CHECK (alert_radius_m IN (0, 200, 500)),
    notifications   BOOLEAN      NOT NULL DEFAULT TRUE,
    failed_attempts SMALLINT     NOT NULL DEFAULT 0,
    locked_until    TIMESTAMPTZ,
    last_login      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email  ON users(email);
CREATE INDEX idx_users_role   ON users(role);

COMMENT ON TABLE  users                 IS 'Miembros de la comunidad universitaria';
COMMENT ON COLUMN users.password_hash   IS 'bcrypt con cost factor 12';
COMMENT ON COLUMN users.failed_attempts IS 'Contador de intentos fallidos consecutivos (max 5 → lockout)';
COMMENT ON COLUMN users.locked_until    IS 'Cuenta bloqueada hasta esta fecha. NULL = activa';

-- ── Tabla: zones ─────────────────────────────────────────────────────────────
CREATE TABLE zones (
    id          VARCHAR(40)  PRIMARY KEY,
    name        VARCHAR(80)  NOT NULL,
    density     zone_density NOT NULL DEFAULT 'Medium',
    risk_score  SMALLINT     NOT NULL DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
    alert_count INTEGER      NOT NULL DEFAULT 0,
    location    GEOGRAPHY(POINT, 4326),             -- coordenadas reales
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Zonas críticas identificadas en el estudio de campo
INSERT INTO zones (id, name, density, risk_score, alert_count, location) VALUES
    ('ad-portas',     'Ad Portas',    'High',   58, 4, ST_MakePoint(-74.031723, 4.863640)::geography),
    ('porton-cafe',   'Portón Café',  'Low',    15, 0, ST_MakePoint(-74.037457, 4.863549)::geography),
    ('puente-madera', 'Puente Madera','Medium', 82, 1, ST_MakePoint(-74.031506, 4.858675)::geography);

COMMENT ON TABLE  zones             IS 'Zonas del campus con score de riesgo georreferenciado';
COMMENT ON COLUMN zones.risk_score  IS '0-100: 0-39 bajo, 40-69 medio, 70-100 alto';
COMMENT ON COLUMN zones.location    IS 'PostGIS GEOGRAPHY(POINT) en WGS84 (SRID 4326)';

-- ── Tabla: incidents ─────────────────────────────────────────────────────────
CREATE TABLE incidents (
    id                  BIGSERIAL    PRIMARY KEY,
    type                VARCHAR(60)  NOT NULL,
    details             TEXT,
    intensity           incident_intens NOT NULL DEFAULT 'Medium',
    status              incident_status NOT NULL DEFAULT 'New',
    validation_status   incident_valid  NOT NULL DEFAULT 'pending',
    risk_score          SMALLINT     CHECK (risk_score BETWEEN 0 AND 100),
    zone_id             VARCHAR(40)  REFERENCES zones(id) ON DELETE SET NULL,
    reported_by         UUID         REFERENCES users(id) ON DELETE SET NULL,
    is_anonymous        BOOLEAN      NOT NULL DEFAULT FALSE,
    admin_note          TEXT         DEFAULT '',
    location_point      GEOGRAPHY(POINT, 4326),
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_incidents_zone       ON incidents(zone_id);
CREATE INDEX idx_incidents_status     ON incidents(status);
CREATE INDEX idx_incidents_validation ON incidents(validation_status);
CREATE INDEX idx_incidents_created    ON incidents(created_at DESC);
CREATE INDEX idx_incidents_location   ON incidents USING GIST(location_point);

COMMENT ON TABLE  incidents              IS 'Incidentes de seguridad reportados por la comunidad';
COMMENT ON COLUMN incidents.is_anonymous IS 'Si TRUE, reported_by se almacena como NULL para preservar anonimato';
COMMENT ON COLUMN incidents.location_point IS 'Posición GPS exacta del reporte (PostGIS GEOGRAPHY)';

-- ── Tabla: validation_votes ───────────────────────────────────────────────────
CREATE TABLE validation_votes (
    id          BIGSERIAL  PRIMARY KEY,
    incident_id BIGINT     NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    voter_id    UUID       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vote        vote_type  NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(incident_id, voter_id)       -- un usuario = un voto por incidente
);

CREATE INDEX idx_votes_incident ON validation_votes(incident_id);
CREATE INDEX idx_votes_voter    ON validation_votes(voter_id);

COMMENT ON TABLE  validation_votes IS 'Votos comunitarios de verificación (estilo Waze). Un voto por usuario por incidente.';

-- ── Tabla: sessions (refresh tokens) ─────────────────────────────────────────
CREATE TABLE sessions (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT        NOT NULL UNIQUE,   -- bcrypt del refresh token
    user_agent  TEXT,
    ip_address  INET,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user       ON sessions(user_id);
CREATE INDEX idx_sessions_expires    ON sessions(expires_at);

COMMENT ON TABLE  sessions            IS 'Refresh tokens de sesión (JWT de corta vida + refresh de 7 días)';
COMMENT ON COLUMN sessions.token_hash IS 'Hash bcrypt del refresh token — nunca almacenar el token en claro';

-- ── Tabla: audit_log ─────────────────────────────────────────────────────────
CREATE TABLE audit_log (
    id          BIGSERIAL   PRIMARY KEY,
    user_id     UUID        REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(60) NOT NULL,
    target      VARCHAR(60),
    target_id   TEXT,
    ip_address  INET,
    meta        JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user    ON audit_log(user_id);
CREATE INDEX idx_audit_action  ON audit_log(action);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);

COMMENT ON TABLE audit_log IS 'Registro auditable de acciones críticas (login, eliminación, cambio de rol, etc.)';

-- ── Trigger: updated_at automático ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_zones_updated_at
    BEFORE UPDATE ON zones
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_incidents_updated_at
    BEFORE UPDATE ON incidents
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Vista: incident_summary (útil para el panel admin) ───────────────────────
CREATE VIEW incident_summary AS
SELECT
    i.id,
    i.type,
    i.intensity,
    i.status,
    i.validation_status,
    i.risk_score,
    i.is_anonymous,
    i.admin_note,
    i.created_at,
    z.name          AS zone_name,
    z.risk_score    AS zone_risk,
    COUNT(v.id)     AS total_votes,
    COUNT(v.id) FILTER (WHERE v.vote = 'confirm') AS confirmations,
    COUNT(v.id) FILTER (WHERE v.vote = 'deny')    AS denials
FROM incidents i
LEFT JOIN zones z           ON i.zone_id = z.id
LEFT JOIN validation_votes v ON i.id = v.incident_id
GROUP BY i.id, z.name, z.risk_score;

COMMENT ON VIEW incident_summary IS 'Vista desnormalizada para el panel de administración';
