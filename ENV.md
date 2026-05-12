# Entornos de CampusShield

## Cómo funciona la detección de entorno

No hay archivos `.env` ni flags manuales. El entorno se detecta automáticamente en runtime leyendo `location.hostname` — la propiedad del navegador que indica el dominio desde donde se sirve la app.

```js
// src/config.js
const DEV_HOSTS = ['localhost', '127.0.0.1', ''];
const isDev = DEV_HOSTS.includes(location.hostname);

export const config = isDev ? development : production;
```

| Dónde abres la app | `location.hostname` | Entorno activo |
|---|---|---|
| Archivo local (`file://`) | `""` | **development** |
| Servidor local (`localhost:5500`) | `"localhost"` | **development** |
| Dirección local (`127.0.0.1`) | `"127.0.0.1"` | **development** |
| Vercel, Netlify, GitHub Pages, etc. | `"campusshield.vercel.app"` | **production** |
| Dominio institucional | `"campusshield.unisabana.edu.co"` | **production** |

---

## Diferencias entre entornos

| Parámetro | Development | Production | Descripción |
|---|---|---|---|
| `validationThreshold` | `1` | `2` | Votos necesarios para verificar o descartar un reporte |
| `toastDuration` | `3 000 ms` | `5 000 ms` | Tiempo visible de las notificaciones toast |
| `pollInterval` | `3 000 ms` | `3 000 ms` | Frecuencia del chequeo de notificaciones |
| `mapZoom` | `14` | `15` | Zoom inicial del mapa de campus |
| `apiBase` | `http://localhost:3000/api` | `https://api.campusshield.unisabana.edu.co/api` | URL del backend (fase 2) |
| `debugBanner` | `true` | `false` | Banner azul de entorno visible en pantalla |
| `mockData` | `true` | `false` | Precarga incidentes de prueba al iniciar |
| `analytics` | `false` | `true` | Activación de métricas de uso |

---

## Señal visual de entorno

En **development** aparece una barra azul fija en la parte inferior de la pantalla con los valores activos:

```
⚙ DEVELOPMENT — validationThreshold: 1 · apiBase: http://localhost:3000/api
```

Si esa barra **no aparece**, la app está corriendo en **production**.

---

## El parámetro más importante: `validationThreshold`

Controla cuántos votos de la comunidad se necesitan para cambiar el estado de un reporte:

- **Development → `1` voto:** permite probar el flujo completo de validación comunitaria con un solo usuario, sin necesitar abrir dos sesiones distintas.
- **Production → `2` votos:** comportamiento real — dos miembros distintos de la comunidad deben confirmar o negar el reporte para que cambie de `pending` a `verified` o `discarded`.

---

## Agregar un nuevo entorno (staging, etc.)

Editar `src/config.js` y agregar el hostname al array `DEV_HOSTS`, o crear un tercer objeto de configuración y extender la lógica de detección:

```js
const DEV_HOSTS = ['localhost', '127.0.0.1', ''];
const STAGING_HOSTS = ['staging.campusshield.vercel.app'];

const env = DEV_HOSTS.includes(location.hostname) ? 'development'
          : STAGING_HOSTS.includes(location.hostname) ? 'staging'
          : 'production';

export const config = { development, staging, production }[env];
```
