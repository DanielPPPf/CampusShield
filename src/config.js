// ── Environment Detection ─────────────────────────────────────────────────────
// Sin build tool: se detecta el entorno en runtime según el hostname.
// localhost / 127.0.0.1 / file:// → development
// cualquier otro dominio           → production

const DEV_HOSTS = ['localhost', '127.0.0.1', ''];
const isDev = DEV_HOSTS.includes(location.hostname);

// ── Config por entorno ────────────────────────────────────────────────────────
const development = {
    env: 'development',
    isDev: true,
    isProd: false,

    // Backend (futuro) — apunta al servidor local
    apiBase: 'http://localhost:3000/api',

    // Mapa
    mapZoom: 14,
    mapTileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

    // UX — más rápido para iterar durante el desarrollo
    toastDuration: 3000,       // ms
    pollInterval: 3000,        // ms — checkNotifications

    // Validación comunitaria — umbral 1 para facilitar pruebas
    validationThreshold: 1,

    // Feature flags
    features: {
        debugBanner: true,     // muestra banner de entorno en pantalla
        mockData: true,        // precarga incidentes de prueba
        analytics: false,
    },
};

const production = {
    env: 'production',
    isDev: false,
    isProd: true,

    // Backend (futuro) — dominio institucional
    apiBase: 'https://api.campusshield.unisabana.edu.co/api',

    // Mapa
    mapZoom: 15,
    mapTileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

    // UX — tiempos estándar para usuarios reales
    toastDuration: 5000,
    pollInterval: 3000,

    // Validación comunitaria — umbral real de 2 votos
    validationThreshold: 2,

    // Feature flags
    features: {
        debugBanner: false,
        mockData: false,
        analytics: true,
    },
};

export const config = isDev ? development : production;

// Log de entorno (solo visible en dev)
if (config.isDev) {
    console.info(
        `%c CampusShield [${config.env.toUpperCase()}] `,
        'background:#3759b6;color:#fff;font-weight:bold;border-radius:4px;padding:2px 6px',
        `| validationThreshold: ${config.validationThreshold}`,
        `| toast: ${config.toastDuration}ms`,
        `| apiBase: ${config.apiBase}`,
    );
}
