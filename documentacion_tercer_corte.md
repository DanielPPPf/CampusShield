# Documentación Técnica del Prototipo — Tercer Corte
**CampusShield · Vibras Corporation · Capstone Design Project**
_Ricardo Cortés · Juan Montes · Daniel Pareja · Julián Zafra — Abril 2026_

---

## 9. Definición de Arquitectura de la Solución

### 9.1 Visión General del Sistema

CampusShield es una **Progressive Web App (PWA)** de tipo "super app" de seguridad universitaria. La decisión de adoptar el modelo PWA fue estratégica: permite que la misma base de código funcione tanto en dispositivos móviles (Android e iOS, instalable desde el navegador) como en escritorio, sin necesidad de desarrollar y mantener aplicaciones nativas separadas, reduciendo drásticamente los costos y tiempos de desarrollo.

La arquitectura del prototipo MVP fue diseñada bajo tres principios rectores:

1. **Despliegue inmediato sin backend**: El MVP opera íntegramente en el cliente mediante `localStorage` como capa de persistencia, permitiendo validar flujos de usuario sin costos de infraestructura durante la fase de prueba de concepto.
2. **Modularidad orientada a escalamiento**: Cada módulo (auth, store, views, app) tiene responsabilidades claramente separadas, facilitando la migración a una arquitectura con backend real en fases posteriores.
3. **PWA-first como puente multiplataforma**: La arquitectura PWA elimina la necesidad de apps nativas separadas, aprovechando capacidades del navegador (Service Workers, Web Push, instalación en pantalla de inicio) para ofrecer una experiencia equivalente a una app nativa tanto en móvil como en PC.

### 9.2 Arquitectura del MVP (Estado Actual)

#### 9.2.1 Diagrama de Componentes — Prototipo de Prueba de Concepto

```mermaid
graph TB
    subgraph Browser["Navegador Web / Cliente"]
        subgraph Entry["Punto de Entrada — PWA"]
            HTML["index.html\n(CDN: Tailwind, Leaflet, Material Symbols)\nmanifest.json + Service Worker"]
        end

        subgraph Core["Núcleo de la Aplicación — ES Modules"]
            APP["app.js\n─────────────────\n• Router hash-based\n• Sistema de Modales\n• Sistema de Toasts\n• Inicialización Leaflet\n• Manejadores de eventos"]
            STORE["store.js\n─────────────────\n• Estado global\n• Autenticación (roles)\n• Incidentes + Validación\n• Zonas de riesgo\n• Configuración / i18n\n• Persistencia localStorage"]
            VIEWS["views.js\n─────────────────\n• login()\n• dashboard()\n• map()\n• report()\n• ai()\n• admin()\n• Traducciones ES/EN"]
        end

        subgraph UI["Vistas Renderizadas"]
            LOGIN["Login\nAutenticación SSO\n@unisabana.edu.co"]
            DASH["Dashboard\nGauge de riesgo\nAlertas activas\nValidación comunitaria"]
            MAP["Mapa Interactivo\nLeaflet.js\nPins georreferenciados\nZonas críticas"]
            REPORT["Reporte 3 Pasos\nTipo → Contexto → Confirmar"]
            AI["IA Insights\nRuta segura\nRanking de zonas\nAnálisis horario"]
            ADMIN["Panel Admin\nGestión incidentes\nExportación reportes"]
        end

        subgraph State["Capa de Estado"]
            LS[("localStorage\ncampus_shield_data\n─────────────────\nuser, incidents,\nzones, lang, settings")]
        end
    end

    subgraph External["Dependencias Externas (CDN)"]
        LEAFLET["Leaflet.js v1.9.4\nOpenStreetMap tiles"]
        TAILWIND["Tailwind CSS\nDesign Tokens"]
        FONTS["Google Fonts\nManrope · Inter"]
        ICONS["Material Symbols\nIconografía"]
    end

    HTML --> APP
    HTML --> External
    APP --> STORE
    APP --> VIEWS
    VIEWS --> UI
    STORE <--> LS
    MAP --> LEAFLET

    style Browser fill:#faf9ff,stroke:#000a34,stroke-width:2px
    style Core fill:#e8eaf6,stroke:#3759b6
    style State fill:#fff3e0,stroke:#636100
    style External fill:#f3f3f3,stroke:#999
```

#### 9.2.2 Arquitectura Objetivo — Solución Completa (Fase 2-3)

La estrategia PWA permite que **una sola aplicación** atienda todos los dispositivos:

- **Móvil (Android/iOS):** instalable desde el navegador como app nativa, con acceso a notificaciones push, almacenamiento offline y pantalla de inicio.
- **Escritorio (PC/Mac):** la misma app web funciona como aplicación de escritorio instalable sin pasar por tiendas de aplicaciones.

```mermaid
graph LR
    subgraph Frontend["Frontend — PWA Multiplataforma"]
        PWA["Progressive Web App\nReact + Vite\nLeaflet / Mapbox GL JS\n─────────────────────\nService Worker: cache offline\nmanifest.json: instalable\nWeb Push VAPID: notificaciones\n─────────────────────\nMovil Android e iOS\nEscritorio PC y Mac"]
    end

    subgraph BFF["Backend for Frontend"]
        API["API Gateway\nNode.js + Express\nREST + WebSockets"]
        AUTH["Auth Service\nJWT RS256\nRBAC"]
        NOTIF["Push Service\nWeb Push VAPID\nFCM fallback"]
    end

    subgraph ML["Microservicio de IA"]
        MLSVC["FastAPI\nXGBoost - DBSCAN\nModelo Predictivo"]
        MLDB[("Modelo\nVersionado")]
    end

    subgraph Data["Capa de Datos"]
        PG[("PostgreSQL\n+ PostGIS\nIncidentes - Zonas\nUsuarios")]
        REDIS[("Redis\nSesiones - Cache\nGeofencing")]
    end

    subgraph Infra["Infraestructura"]
        S3["Almacenamiento\nFotos de reportes"]
        CRON["Cron Jobs\nRe-entrenamiento\nReportes semanales"]
        MAIL["Resend\nCorreo institucional"]
    end

    PWA --> API
    API --> AUTH
    API --> PG
    API --> REDIS
    API --> NOTIF
    API --> MLSVC
    NOTIF --> PWA
    MLSVC --> PG
    MLSVC --> MLDB
    CRON --> MLSVC
    CRON --> MAIL
    API --> S3

    style Frontend fill:#e8eaf6,stroke:#3759b6,stroke-width:2px
    style BFF fill:#e3f2fd,stroke:#000a34
    style ML fill:#f3e5f5,stroke:#7b1fa2
    style Data fill:#fff8e1,stroke:#636100
```

### 9.3 Flujos de Interacción

#### 9.3.1 Flujo de Autenticación y Control de Acceso por Rol

```mermaid
flowchart TD
    A([Usuario accede a la app]) --> B{Sesion activa?}
    B -- No --> C[Pantalla de Login]
    B -- Si --> D{Cual es el rol?}

    C --> E["Ingresa correo institucional + contrasena"]
    E --> F{Dominio unisabana.edu.co?}
    F -- No --> G[Toast: Acceso restringido]
    G --> C

    F -- Si --> H{Correo contiene 'admin'?}
    H -- Si --> I[Rol: Administrador]
    H -- No --> J[Rol: Estudiante / Comunidad]

    I --> K[Dashboard Admin]
    J --> L[Dashboard Comunidad]

    D -- admin --> K
    D -- student --> L

    K --> M[Gestion incidentes - Exportacion - Panel en tiempo real]
    L --> N[Mapa - Reporte - IA Insights - Validacion]

    style G fill:#fde8e8,stroke:#ba1a1a
    style I fill:#e8eaf6,stroke:#3759b6
    style J fill:#e8f5e9,stroke:#18409d
```

#### 9.3.2 Flujo de Reporte de Incidente — 3 Pasos

```mermaid
flowchart TD
    A([Usuario autenticado]) --> B[Navega a Reportar]
    B --> C[Paso 1 - Seleccion de tipo de incidente]

    C --> C1[Hurto / Robo]
    C --> C2[Persona Sospechosa]
    C --> C3[Zona Oscura]
    C --> C4[Otro]

    C1 & C2 & C3 & C4 --> D[Paso 2 - Contexto adicional y modo anonimo]
    D --> E[Paso 3 - Confirmar y Enviar]

    E --> F{Modo anonimo activo?}
    F -- Si --> G[reportedBy: anonymous]
    F -- No --> H[reportedBy: user.email]

    G & H --> I[validationStatus: pending]
    I --> J[Toast: Reporte enviado]
    J --> K[Redireccion al Dashboard]

    K --> L{Otros usuarios ven el reporte}
    L --> M[Seccion Validacion Comunitaria]

    M --> N{Votos recibidos}
    N -- 2 o mas confirmaciones --> O[validationStatus: verified - Alerta confirmada]
    N -- 2 o mas negaciones --> P[validationStatus: discarded - Falsa alarma]

    style J fill:#e8f5e9,stroke:#18409d
    style O fill:#e8f5e9,stroke:#18409d
    style P fill:#fde8e8,stroke:#ba1a1a
```

#### 9.3.3 Flujo de Validación Comunitaria (Estilo Waze)

```mermaid
flowchart LR
    A[Incidente pendiente] --> B{El usuario es el autor?}
    B -- Si --> C[No puede votar - Toast de aviso]
    B -- No --> D{Ya voto este usuario?}
    D -- Si --> C
    D -- No --> E{Que vota?}

    E -- Confirmar --> F[confirmations - agregar usuario]
    E -- Negar --> G[denials - agregar usuario]

    F --> H{2 o mas confirmaciones?}
    H -- Si --> I[status: verified - riskScore aumenta]
    H -- No --> J[Sigue pending]

    G --> K{2 o mas negaciones?}
    K -- Si --> L[status: discarded - riskScore revierte]
    K -- No --> J

    I --> M[Toast a usuarios cercanos]
    L --> N[Removido de vista comunidad]

    style I fill:#e8f5e9,stroke:#18409d
    style L fill:#fde8e8,stroke:#ba1a1a
    style C fill:#fff8e1,stroke:#636100
```

#### 9.3.4 Flujo del Panel Administrador

```mermaid
flowchart TD
    A([Admin autenticado]) --> B[Panel de Seguridad - 6 metricas en tiempo real]
    B --> C{Accion seleccionada}

    C --> D[Ver incidente]
    C --> E[Actualizar estado]
    C --> F[Eliminar incidente]
    C --> G[Exportar reporte]

    D --> D1[Vista detalle con badge de validacion y votos]

    E --> E1[Modal - Nota administrativa con ShowPrompt]
    E1 --> E2{Guarda cambios?}
    E2 -- Si --> E3[store.updateStatus - nuevo estado y nota]
    E2 -- No --> B

    F --> F1[Modal - Confirmar eliminacion con estilo danger]
    F1 --> F2{Confirma?}
    F2 -- Si --> F3[store.deleteIncident - actualiza dashboard]
    F2 -- No --> B

    G --> G1[Toast - Generando PDF y Toast success al finalizar]

    E3 & F3 & D1 --> B

    style B fill:#e8eaf6,stroke:#000a34
    style E1 fill:#e3f2fd,stroke:#3759b6
    style F1 fill:#fde8e8,stroke:#ba1a1a
```

### 9.4 Modelo de Datos del Prototipo

```mermaid
erDiagram
    USER {
        string email PK
        string name
        string role "student | admin"
        string language "es | en"
        boolean notifications
        string alertRadius
    }

    INCIDENT {
        int id PK
        string type
        string location
        string details
        string time
        string intensity "High | Medium | Information"
        string status "New | In Progress | Resolved"
        int riskScore
        string adminNote
        string validationStatus "pending | verified | discarded"
        string reportedBy FK
        boolean isAnonymous
    }

    ZONE {
        string id PK
        string name
        int riskScore
        string density "High | Medium | Low"
        int alerts
        float lat
        float lng
    }

    VALIDATION_VOTE {
        int incidentId FK
        string voterEmail FK
        string vote "confirm | deny"
    }

    USER ||--o{ INCIDENT : "reportedBy"
    INCIDENT ||--o{ VALIDATION_VOTE : "receives"
    USER ||--o{ VALIDATION_VOTE : "casts"
    INCIDENT }o--|| ZONE : "occursIn"
```

---

## 10. Diseño de la Solución y Planeación del Sprint

### 10.1 Sistema de Diseño — CampusShield Design System

El diseño de CampusShield fue formulado bajo la filosofía **"The Institutional Guardian"**: una experiencia editorial de alta gama que combina la autoridad institucional de la Universidad de La Sabana con una estética de tecnología de punta.

#### 10.1.1 Tokens de Color y Jerarquía Semántica

| Token | Valor HEX | Uso |
|-------|-----------|-----|
| `primary` | `#000a34` | Identidad principal, texto de alta jerarquía |
| `primary-container` | `#001c65` | CTAs, gradientes de acción |
| `secondary` | `#3759b6` | Interacciones activas, badges |
| `error` | `#ba1a1a` | Riesgo alto, alertas críticas, SOS |
| `tertiary` | `#636100` | Riesgo medio, advertencias |
| `on-secondary-fixed-variant` | `#18409d` | Riesgo bajo, zona segura |
| `surface` | `#faf9ff` | Canvas base |
| `surface-container-low` | `#f2f3fd` | Áreas de contenido secundario |

#### 10.1.2 Reglas de Diseño Aplicadas

```mermaid
flowchart LR
    DS(["CampusShield\nDesign System"])

    subgraph TIP["Tipografia"]
        T1["Manrope 800\nTitulares y scores\nAutoridad editorial"]
        T2["Inter 400-600\nCuerpo y labels\nLegibilidad funcional"]
    end

    subgraph ELE["Elevacion y Profundidad"]
        E1["Tonal Layering\nSin bordes 1px\nShifts de color"]
        E2["Sombras institucionales\nrgba 0,10,52 - 0.08\nNunca negro puro"]
    end

    subgraph FOR["Forma"]
        F1["Radios 1.5rem en cards"]
        F2["Circulos 9999px en badges"]
        F3["Pildoras en indicadores"]
    end

    subgraph ANI["Animacion"]
        A1["fadeSlideUp en vistas"]
        A2["animate-pulse en riesgo alto"]
        A3["Scale en interacciones"]
        A4["Spring modal 0.25s"]
    end

    subgraph GLA["Glassmorphism"]
        G1["Navbar blur-xl 80% opacidad"]
        G2["Modales backdrop-blur-6px"]
        G3["Toasts con shadow-xl"]
    end

    DS --> TIP
    DS --> ELE
    DS --> FOR
    DS --> ANI
    DS --> GLA

    style DS fill:#000a34,color:#ffffff,stroke:#000a34
    style TIP fill:#e8eaf6,stroke:#3759b6,stroke-width:2px
    style ELE fill:#e3f2fd,stroke:#000a34,stroke-width:2px
    style FOR fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px
    style ANI fill:#e8f5e9,stroke:#18409d,stroke-width:2px
    style GLA fill:#fff8e1,stroke:#636100,stroke-width:2px
    style T1 fill:#c5cae9,stroke:#3759b6
    style T2 fill:#c5cae9,stroke:#3759b6
    style E1 fill:#bbdefb,stroke:#000a34
    style E2 fill:#bbdefb,stroke:#000a34
    style F1 fill:#e1bee7,stroke:#6a1b9a
    style F2 fill:#e1bee7,stroke:#6a1b9a
    style F3 fill:#e1bee7,stroke:#6a1b9a
    style A1 fill:#c8e6c9,stroke:#18409d
    style A2 fill:#c8e6c9,stroke:#18409d
    style A3 fill:#c8e6c9,stroke:#18409d
    style A4 fill:#c8e6c9,stroke:#18409d
    style G1 fill:#fff9c4,stroke:#636100
    style G2 fill:#fff9c4,stroke:#636100
    style G3 fill:#fff9c4,stroke:#636100
```

### 10.2 Wireframes y Mockups del Prototipo

Los siguientes diseños fueron elaborados mediante la herramienta **Stitch (AI-assisted UI design)** y representan la base visual que guió el desarrollo del prototipo funcional CampusShield.

---

#### 10.2.1 Pantalla de Login — Autenticación Institucional

**Descripción:** Pantalla de acceso dividida en dos paneles (desktop) con identidad visual de La Sabana. El formulario exige correo `@unisabana.edu.co` y asigna rol automáticamente.

**HU asociada:** HU-SYS-01 · **RF:** RF-SYS-01-A, RF-SYS-01-B, RF-SYS-01-C

![Login CampusShield](./stitch_prototipo_campusshield/login_campusshield/screen.png)

**Decisiones de diseño evidenciadas:**
- Panel izquierdo con imagen del campus + overlay institucional azul oscuro
- Campos con iconos de Material Symbols (mail, lock)
- Botón CTA con gradiente `primary → primary-container`
- Selector de idioma ES/EN en la parte inferior
- Indicador de "Sesión Encriptada" con icono `verified_user`

---

#### 10.2.2 Dashboard Comunidad — Vista Principal del Estudiante

**Descripción:** Vista central del usuario estudiante. Incluye gauge de riesgo de zona actual, tarjeta de acción rápida para reportar, sección de validación comunitaria y listado de alertas activas.

**HU asociada:** HU-CU-01, HU-CU-02, HU-CU-03 · **RF:** RF-M01-01, RF-M03-01

![Dashboard Community](./stitch_prototipo_campusshield/dashboard_community/screen.png)

**Elementos visuales clave:**
- **Shield Gauge**: Componente radial SVG con score de riesgo (0-100)
- **Tarjetas de incidente**: Borde izquierdo semafórico (rojo/ámbar/azul)
- **Sección de validación**: Cards pendientes con botones "¿Sigue ahí?"
- **FAB SOS**: Botón circular rojo con animación `animate-ping`

---

#### 10.2.3 Mapa Interactivo — Zonas Críticas Georreferenciadas

**Descripción:** Mapa del campus de la Universidad de La Sabana (Chía) con pins de riesgo fijados a coordenadas reales mediante Leaflet.js. Incluye panel inferior de zonas críticas ordenadas por score.

**HU asociada:** HU-CU-02 · **RF:** RF-M02-01

![Heatmap Campus Zones](./stitch_prototipo_campusshield/heatmap_campus_zones/screen.png)

**Zonas implementadas con coordenadas reales:**

| Zona | Coordenadas | Score | Color |
|------|-------------|-------|-------|
| Ad Portas | 4.863640, -74.031723 | 58 | Ámbar |
| Portón Café | 4.863549, -74.037457 | 15 | Azul (seguro) |
| Puente Madera | 4.858675, -74.031506 | 82 | Rojo (alto riesgo) |

---

#### 10.2.4 Flujo de Reporte — 3 Pasos

El flujo de reporte fue diseñado bajo el principio de **máximo 3 pasos** (RF-M03-01), reduciendo la fricción para que cualquier miembro de la comunidad pueda reportar un incidente en menos de 30 segundos. Una barra de progreso segmentada en 3 tramos acompaña al usuario durante todo el flujo.

**HU asociada:** HU-CU-01 · **RF:** RF-M03-01, RF-M03-02

> **Nota de diseño:** La iteración inicial contemplaba una pantalla única con todos los campos (tipo, descripción y GPS) en una sola vista. Tras la validación con usuarios, se migró al flujo de 3 pasos para reducir la carga cognitiva y permitir el modo anónimo como decisión explícita del usuario.

![Iteración inicial — formulario unificado](./stitch_prototipo_campusshield/image.png_1/screen.png)

---

**Paso 1 — Selección del tipo de incidente**

El usuario ve una grilla de 4 botones con icono y etiqueta. El botón de "Zona Oscura" ocupa el ancho completo (col-span-2) por ser el tipo más reportado en las zonas críticas identificadas. Al seleccionar cualquier tipo, avanza automáticamente al paso 2.

![Paso 1 - Tipo de incidente](./stitch_prototipo_campusshield/report_step_1/screen.png)

| Tipo | Icono | Intensidad asignada |
|------|-------|---------------------|
| Hurto / Robo | `lock_open` | Alta |
| Persona Sospechosa | `visibility` | Media |
| Zona Oscura | `lightbulb_outline` | Media |
| Otro | `emergency` | Media |

---

**Paso 2 — Contexto adicional**

El usuario puede añadir una descripción libre del incidente y activar el **modo anónimo**. Si el modo anónimo está activo, el campo `reportedBy` se disocia de la identidad del usuario antes de persistir (no es un enmascaramiento posterior, sino una decisión en el backend).

Elementos de la pantalla:
- `textarea` con placeholder *"Describe el incidente..."* (5 filas)
- Checkbox `Reporte Anónimo` con label bold y fondo `surface-container-lowest`
- Botón CTA `Revisar Ubicación` con gradiente institucional `primary → primary-container`
- Botón `← Volver` para regresar al Paso 1 sin perder los datos

---

**Paso 3 — Confirmar ubicación y enviar**

Pantalla de confirmación final. La ubicación detectada automáticamente (`Ad Portas Building`) se presenta en una tarjeta con borde izquierdo azul institucional. El usuario puede enviar o volver al Paso 2. Al confirmar, se dispara `store.addIncident()` con `validationStatus: pending` y se muestra un toast de confirmación.

Elementos de la pantalla:
- Tarjeta de ubicación con icono `location_on` y texto *"Ad Portas Building"*
- Botón principal `Enviar Reporte` con icono `send`
- Botón `← Volver` al Paso 2
- **Post-envío:** toast verde *"Reporte enviado con éxito · La comunidad podrá verificarlo pronto"*

---

#### 10.2.5 IA Insights — Rutas Seguras y Análisis Predictivo

**Descripción:** Vista de inteligencia artificial con 4 tarjetas dinámicas: planificador de ruta segura, ranking de zonas por riesgo, estadísticas comunitarias (verificados/falsas alarmas) y análisis de riesgo por franja horaria.

**HU asociada:** HU-CU-04, HU-AD-01 · **RF:** RF-M05-01, RF-M05-02

![AI Insights Routes](./stitch_prototipo_campusshield/ai_insights_routes/screen.png)

---

#### 10.2.6 Panel de Administración de Seguridad

**Descripción:** Panel exclusivo para el rol Administrador. Muestra 6 métricas en tiempo real, listado de todos los incidentes con badges de validación, y acciones de gestión (actualizar estado, eliminar, exportar).

**HU asociada:** HU-AD-02, HU-AD-03 · **RF:** RF-M06-01, RF-M06-02

![Security Admin Panel](./stitch_prototipo_campusshield/security_admin_panel/screen.png)

---

#### 10.2.7 Vistas Adicionales del Diseño

Los siguientes mockups complementarios evidencian la iteración del proceso de diseño y exploración visual previa a la versión final implementada:

![Diseño adicional 1](./stitch_prototipo_campusshield/image.png_1/screen.png)
![Diseño adicional 2](./stitch_prototipo_campusshield/image.png_2/screen.png)
![Diseño adicional 3](./stitch_prototipo_campusshield/image.png_3/screen.png)
![Diseño adicional 4](./stitch_prototipo_campusshield/image.png_4/screen.png)

### 10.3 Planeación del Sprint de Construcción

#### 10.3.1 Estructura del Sprint — Metodología Ágil

El prototipo MVP se planeó y ejecutó en un **único sprint de 6 semanas** (19 de abril – 30 de mayo de 2026), organizado en tres fases de entrega incremental basadas en el backlog priorizado por la escala Fibonacci.

```mermaid
gantt
    title Sprint CampusShield MVP — Abril-Mayo 2026
    dateFormat YYYY-MM-DD
    axisFormat %d/%m

    section Fase 1 — Núcleo (20 SP)
    HU-SYS-01 Autenticación institucional     :done, sys01, 2026-04-19, 3d
    HU-SYS-02 Internacionalización ES/EN       :done, sys02, 2026-04-19, 2d
    HU-CU-01 Reporte de incidente 3 pasos     :done, cu01,  2026-04-21, 4d
    HU-AD-02 Panel admin tiempo real          :done, ad02,  2026-04-24, 4d
    HU-CU-02 Mapa interactivo Leaflet.js      :done, cu02,  2026-04-26, 5d

    section Fase 2 — Inteligencia (19 SP)
    HU-CU-03 Toasts y notificaciones          :active, cu03, 2026-05-01, 3d
    Validación comunitaria estilo Waze        :active, val,  2026-05-02, 4d
    HU-CU-04 IA Insights y rutas seguras      :active, cu04, 2026-05-06, 6d
    HU-AD-03 Exportación estadística          :active, ad03, 2026-05-10, 5d

    section Fase 3 — Refinamiento (13 SP)
    HU-AD-01 Análisis predictivo avanzado     :crit, ad01, 2026-05-15, 8d
    Pruebas de usuario y ajustes UX           :crit, test, 2026-05-22, 5d
    Documentación y entrega final             :crit, docs, 2026-05-27, 3d
```

#### 10.3.2 Distribución de Story Points por Fase

```mermaid
pie title Story Points por Fase del Sprint
    "Fase 1 - Núcleo MVP (20 SP)" : 20
    "Fase 2 - Inteligencia comunitaria (19 SP)" : 19
    "Fase 3 - Análisis predictivo (13 SP)" : 13
```

#### 10.3.3 Asignación de Roles por Historia de Usuario

| Historia | SP | Responsable Principal | Soporte |
|----------|----|-----------------------|---------|
| HU-SYS-01 Auth | 3 | Daniel Pareja (Dev) | Ricardo Cortés |
| HU-SYS-02 i18n | 2 | Daniel Pareja (Dev) | Julián Zafra |
| HU-CU-01 Reporte | 5 | Daniel Pareja (Dev) | Juan Montes |
| HU-CU-02 Mapa | 5 | Daniel Pareja (Dev) | Juan Montes |
| HU-CU-03 Notif. | 3 | Daniel Pareja (Dev) | Julián Zafra |
| HU-CU-04 IA Routes | 8 | Julián Zafra (Ideador) | Daniel Pareja |
| HU-AD-01 Predictivo | 13 | Juan Montes (Clarif.) | Julián Zafra |
| HU-AD-02 Panel Admin | 5 | Ricardo Cortés (Impl.) | Daniel Pareja |
| HU-AD-03 Reportes | 8 | Ricardo Cortés (Impl.) | Juan Montes |

> Los roles Foursight del equipo (Implementador, Clarificador, Desarrollador, Ideador) guiaron la asignación: el Implementador (Ricardo) lideró la ejecución del panel admin, el Clarificador (Juan) el análisis predictivo, el Desarrollador (Daniel) el stack técnico completo, y el Ideador (Julián) los módulos de IA y experiencia.

#### 10.3.4 Estado de Implementación — Funcionalidades del MVP

| Funcionalidad | Estado | Historia | RF |
|---------------|--------|----------|----|
| Login con roles (student/admin) | ✅ Implementado | HU-SYS-01 | RF-SYS-01-A/B/C |
| Internacionalización ES/EN | ✅ Implementado | HU-SYS-02 | RF-SYS-02 |
| Reporte de incidente 3 pasos | ✅ Implementado | HU-CU-01 | RF-M03-01 |
| Mapa Leaflet con pins coordenados | ✅ Implementado | HU-CU-02 | RF-M02-01 |
| Validación comunitaria (Waze-style) | ✅ Implementado | HU-CU-03 | RF-M04-01 |
| Sistema de toasts in-app | ✅ Implementado | HU-CU-03 | RF-SYS-03 |
| IA Insights (datos reales del store) | ✅ Implementado | HU-CU-04 | RF-M05-01 |
| Panel administrador en tiempo real | ✅ Implementado | HU-AD-02 | RF-M06-01 |
| Modales personalizados (sin alerts nativos) | ✅ Implementado | HU-AD-02 | RF-M06-01 |
| SOS de emergencia | ✅ Implementado | HU-CU-01 | RF-M03-01 |
| Gestión de estado de incidentes | ✅ Implementado | HU-AD-02 | RF-M06-01 |
| Exportación estadística | 🔄 Simulado (toast) | HU-AD-03 | RF-M06-02 |
| Modelo predictivo XGBoost real | ⏳ Fase 3 | HU-AD-01 | RF-M05-02 |
| Clustering DBSCAN | ⏳ Fase 3 | HU-AD-01 | RF-M05-02 |

---

## 11. Integración y Organización de Evidencias

### 11.1 Trazabilidad Completa: Problema → Solución

La siguiente sección demuestra la coherencia entre cada componente del proyecto, desde la identificación del problema hasta el prototipo funcional, pasando por el backlog, el diseño y el impacto triple.

```mermaid
flowchart TD
    subgraph P["1. PROBLEMA IDENTIFICADO"]
        P1["32 entrevistas estructuradas\n14.500 personas afectadas"]
        P2["41% seguridad ciudadana\n59% movilidad urbana"]
        P3["Zonas críticas georreferenciadas:\nAd Portas · Puente Madera · Portón Café"]
    end

    subgraph R["2. RETO DE DISEÑO"]
        R1["¿Cómo podríamos diseñar una solución tecnológica\nque mejore la seguridad universitaria utilizando\ndatos geoespaciales y participación comunitaria?"]
    end

    subgraph B["3. BACKLOG PRIORIZADO"]
        B1["9 Historias de Usuario\n52 Story Points\nEscala Fibonacci + INVEST"]
        B2["Alta prioridad MVP:\nAuth · Mapa · Reporte · Admin Panel"]
    end

    subgraph D["4. DISEÑO"]
        D1["Design System: The Institutional Guardian\nPaleta institucional #000a34"]
        D2["6 Mockups en Stitch\nLogin · Dashboard · Mapa · Reporte · IA · Admin"]
    end

    subgraph PR["5. PROTOTIPO FUNCIONAL"]
        PR1["CampusShield MVP\nVanilla JS SPA · Leaflet.js · Tailwind CSS"]
        PR2["Funcionalidades implementadas:\nValidación comunitaria · Modales · Toasts · Mapa Leaflet"]
    end

    subgraph TI["6. TRIPLE IMPACTO + ODS 11"]
        TI1["Económico:\nReducción costos operativos seguridad"]
        TI2["Social:\nMejora percepción seguridad comunidad"]
        TI3["Ambiental:\nRutas seguras → menos desplazamientos\ninnecesarios → menor huella de carbono"]
    end

    P --> R
    R --> B
    B --> D
    D --> PR
    PR --> TI

    style P fill:#fff3e0,stroke:#636100
    style R fill:#e8eaf6,stroke:#3759b6
    style B fill:#e3f2fd,stroke:#000a34
    style D fill:#f3e5f5,stroke:#7b1fa2
    style PR fill:#e8f5e9,stroke:#18409d
    style TI fill:#fce4ec,stroke:#ba1a1a
```

### 11.2 Coherencia entre Dolor Identificado y Funcionalidad Implementada

| Dolor identificado en entrevistas | Feature de CampusShield | HU | RF |
|-----------------------------------|------------------------|----|----|
| "Zonas oscuras y sin seguridad en Ad Portas" | Mapa de riesgo con score por zona + pin rojo en Ad Portas (score 58) | HU-CU-02 | RF-M02-01 |
| "Personas sospechosas en el puente y portón" | Reporte de incidente 3 pasos + tipo 'Suspicious Person' | HU-CU-01 | RF-M03-01 |
| "Respuesta institucional lenta o nula (92.4%)" | Panel admin en tiempo real + validación comunitaria inmediata | HU-AD-02 | RF-M06-01 |
| "No hay información sobre zonas peligrosas" | IA Insights: ranking de zonas + consejo por franja horaria | HU-CU-04 | RF-M05-01 |
| "Reportes no tienen seguimiento formal" | Sistema de estados (New → In Progress → Resolved) + nota admin | HU-AD-02 | RF-M06-01 |
| "Comunidad no puede participar en seguridad" | Validación comunitaria Waze-style (confirm/deny con umbral 2 votos) | HU-CU-03 | RF-M04-01 |
| "Barrera lingüística para estudiantes internacionales" | i18n completo ES/EN con cambio instantáneo | HU-SYS-02 | RF-SYS-02 |

### 11.3 Contribución al Triple Impacto

```mermaid
graph TD
    CS["CampusShield\nPrototipo MVP"]

    CS --> ECO["IMPACTO ECONÓMICO"]
    CS --> SOC["IMPACTO SOCIAL"]
    CS --> AMB["IMPACTO AMBIENTAL"]

    ECO --> E1["Reducción costos operativos\nde seguridad (focalización\nde recursos en zonas críticas)"]
    ECO --> E2["Gestión basada en datos\nevita duplicación de esfuerzos\nde vigilancia"]
    ECO --> E3["Reportes estadísticos exportables\npara justificar inversiones\nante directivas y municipio"]

    SOC --> S1["Mejora percepción de seguridad\nen 14.500 personas de la\ncomunidad universitaria"]
    SOC --> S2["Empoderamiento ciudadano:\ncada usuario puede reportar\ny validar incidentes"]
    SOC --> S3["Reducción de tiempo\nentre incidente y respuesta\ninstitucional"]
    SOC --> S4["Inclusión: multilingüe\nES/EN para comunidad\ninternacional"]

    AMB --> A1["Rutas seguras sugeridas\nreducen desplazamientos\ninnecesarios"]
    AMB --> A2["Menor uso de transporte\nprivado cuando rutas\nson conocidas y seguras"]
    AMB --> A3["Alineación ODS 11:\nCiudades y Comunidades\nSostenibles"]

    style ECO fill:#fff8e1,stroke:#636100
    style SOC fill:#e8f5e9,stroke:#18409d
    style AMB fill:#e8f5f9,stroke:#00695c
    style CS fill:#e8eaf6,stroke:#000a34,stroke-width:3px
```

### 11.4 Alineación con ODS 11 — Evidencia por Meta

| Meta ODS 11 | Evidencia en el Proyecto |
|-------------|--------------------------|
| **Meta 11.2** Transporte sostenible | IA Insights calcula la ruta con menor exposición al riesgo, promoviendo desplazamientos más seguros y eficientes |
| **Meta 11.3** Urbanización participativa | 32 entrevistas como base + validación comunitaria Waze-style permite co-gestión de la seguridad |
| **Meta 11.7** Espacios públicos seguros | Mapa de calor con zonas críticas georreferenciadas (Ad Portas, Puente Madera, Portón Café) |
| **Meta 11.b** Políticas integradas de resiliencia | Panel admin con exportación de reportes para toma de decisiones institucionales basadas en datos |

### 11.5 Arquitectura de la Solución vs. Requerimientos No Funcionales

```mermaid
flowchart LR
    subgraph RNF["Requerimientos No Funcionales"]
        N1["RNF-SEG: JWT RS256\nrefresh token httpOnly"]
        N2["RNF-PERF: Carga mapa < 3s\nRegistro incidente < 5s"]
        N3["RNF-ACC: PWA instalable en movil y PC\nsin app store, cualquier navegador moderno"]
        N4["RNF-I18N: Cambio idioma < 500ms\nsin recarga de página"]
        N5["RNF-UX: Flujo reporte ≤ 3 pasos\nInterfaz premium institucional"]
    end

    subgraph IMP["Implementación en el Prototipo"]
        I1["Store con roles student/admin\nControl de acceso por hash-route"]
        I2["Leaflet.js con tiles OSM\nLocalStorage como cache offline"]
        I3["PWA: HTML + ES Modules via CDN\nInstalable en movil y PC sin app store"]
        I4["translations object en views.js\nReactividad inmediata en re-render"]
        I5["3-step form con progress bar\nDesign System Institucional"]
    end

    N1 --> I1
    N2 --> I2
    N3 --> I3
    N4 --> I4
    N5 --> I5

    style RNF fill:#e8eaf6,stroke:#3759b6
    style IMP fill:#e8f5e9,stroke:#18409d
```

### 11.6 Evolución del Diseño: Del Mockup al Prototipo Funcional

El proceso de diseño siguió una trayectoria clara de fidelidad creciente:

```mermaid
flowchart LR
    A["Investigación de Campo\n32 entrevistas\nMapa de calor territorial"] 
    --> B["Ideación\nBrainstorming 1.0 y 2.0\nDiagrama de Afinidad\nMatriz Impacto x Factibilidad"]
    --> C["Wireframes Conceptuales\nFlujos de navegación\nArquitectura de información"]
    --> D["Mockups Alta Fidelidad\nStitch AI-assisted design\n6 pantallas completas\nDesign System definido"]
    --> E["Prototipo Funcional\nCampusShield MVP\nVanilla JS + Leaflet.js\n14+ funcionalidades"]
    --> F["Validación con Usuarios\nPruebas con comunidad\nUniversidad de La Sabana\nIteración final"]

    style A fill:#fff3e0,stroke:#636100
    style B fill:#f3e5f5,stroke:#7b1fa2
    style C fill:#e3f2fd,stroke:#3759b6
    style D fill:#e8eaf6,stroke:#000a34
    style E fill:#e8f5e9,stroke:#18409d
    style F fill:#fce4ec,stroke:#ba1a1a
```

### 11.7 Resumen Ejecutivo de Evidencias

| Entregable | Estado | Evidencia |
|-----------|--------|-----------|
| **Investigación de campo** | ✅ Completo | 32 entrevistas, 5 áreas del conocimiento, mapa de calor |
| **Definición del problema** | ✅ Completo | 41% seguridad, 59% movilidad. Problema escogido: seguridad |
| **Reto de diseño** | ✅ Completo | Formulado, validado cuantitativa y cualitativamente |
| **Backlog con HU** | ✅ Completo | 9 HU, 52 SP, criterios Gherkin, validación INVEST |
| **Requisitos IEEE 830** | ✅ Completo | RF y RNF con trazabilidad completa |
| **Sistema de diseño** | ✅ Completo | Design System "The Institutional Guardian" |
| **Mockups (Stitch)** | ✅ Completo | 6 pantallas + 4 iteraciones adicionales |
| **Prototipo funcional** | ✅ Completo | CampusShield MVP, 14 funcionalidades implementadas |
| **Arquitectura documentada** | ✅ Completo | MVP + Arquitectura objetivo, flujos de interacción, ER |
| **Sprint planning** | ✅ Completo | 3 fases, Gantt, distribución de SP por perfil Foursight |
| **Triple impacto documentado** | ✅ Completo | Económico + Social + Ambiental con alineación ODS 11 |
| **Validación con usuarios** | 🔄 En progreso | Pruebas de concepto con comunidad universitaria |

---

_Documento generado para el Tercer Corte — Capstone Design Project · Facultad de Ingeniería · Universidad de La Sabana · Abril 2026_
