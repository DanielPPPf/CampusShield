import { store } from './store.js';

const translations = {
    es: {
        welcome: 'Bienvenido de nuevo,',
        home: 'Inicio',
        map: 'Mapa',
        report: 'Reportar',
        ai: 'IA Insights',
        activeAlerts: 'Alertas Activas',
        reportIncident: 'Reportar un Incidente',
        reportDesc: 'Notifica inmediatamente a seguridad sobre peligros o actividad sospechosa.',
        initiateAlert: 'Iniciar Alerta',
        settings: 'Configuración',
        language: 'Idioma',
        alertRadius: 'Radio de Alerta',
        notifications: 'Notificaciones',
        logout: 'Cerrar Sesión',
        step: 'Paso',
        of: 'de',
        whatHappened: '¿Qué pasó?',
        additionalContext: 'Contexto Adicional',
        confirmAndSend: 'Confirmar y Enviar',
        sendReport: 'Enviar Reporte',
        anonymous: 'Reporte Anónimo',
        safeRoute: 'Planificador de Ruta Segura',
        riskReduction: 'Reducción de Riesgo',
        highRiskAlert: 'Alerta: Todas las rutas presentan riesgo elevado',
        securityCommand: 'Comando de Seguridad',
        liveActivity: 'Actividad en Vivo',
        updateStatus: 'Actualizar Estado',
        exportReport: 'Exportar Reporte',
        criticalZones: 'Zonas Críticas',
        welcomeBack: 'Bienvenido de Nuevo',
        loginDesc: 'Accede a la red segura con tus credenciales institucionales.',
        emailLabel: 'Correo Institucional',
        passLabel: 'Credencial de Seguridad',
        signIn: 'Iniciar Sesión en Shield',
        forgotPass: '¿Olvidó su contraseña?',
        encryptedSession: 'Sesión Encriptada',
        ssoDesc: 'Su autenticación es gestionada por el proveedor de identidad de la universidad (SSO).',
        details: 'Detalles',
        detectedLoc: 'Ubicación Detectada',
        currentZone: 'Zona Actual',
        safetyLevels: 'Análisis de riesgo en tiempo real para tu ubicación.',
        riskScoreLabel: 'Índice de Riesgo',
        statsTotal: 'Total Incidentes',
        statsActive: 'En Atención',
        statsResolved: 'Resueltos',
        communityValidation: 'Validación Comunitaria',
        helpVerify: 'Ayuda a confirmar estos reportes recientes',
        stillThere: '¿Sigue ahí?',
        confirmReport: 'Sí, está ahí',
        denyReport: 'Ya no está',
        pendingBadge: 'Pendiente',
        verifiedBadge: 'Verificado',
        falseAlarmBadge: 'Falsa Alarma',
        votes: 'votos',
        eliteProtection: 'Protección de Élite para nuestra Comunidad Académica.',
        securingFuture: 'Asegurando el futuro de la Universidad de La Sabana a través de insights avanzados de IA e infraestructura de respuesta en tiempo real.',
        back: 'Volver',
        reviewLocation: 'Revisar Ubicación',
        provideDetails: 'Proporciona más detalles para ayudar a nuestro equipo de seguridad a responder eficazmente.',
        finalizeReport: 'Finaliza tu reporte. Hemos detectado automáticamente tu ubicación.',
        statsNew: 'Nuevas Solicitudes',
        adminIntelligence: 'Inteligencia Administrativa',
        archive: 'Archivar',
        attend: 'Atender',
        resolve: 'Resolver',
        liveInsights: 'Insights de seguridad en vivo calculados a partir de datos de incidentes del campus.',
        zoneRanking: 'Ranking de Riesgo por Zona',
        commIntel: 'Inteligencia Comunitaria',
        verificationRate: 'Tasa de verificación',
        systemAccuracy: 'de reportes marcados como falsa alarma por la comunidad — la precisión del sistema mejora con el tiempo.',
        currentTimeWindow: 'Ventana de Tiempo Actual',
        activeSlot: 'Franja activa',
        riskLevel: 'Nivel de riesgo',
        high: 'Alto',
        moderate: 'Moderado',
        low: 'Bajo',
        routeRisk: 'Riesgo de Ruta',
        extraTime: 'Tiempo Extra',
        avoid: 'Evitar',
        routeVia: 'Ruta vía',
        selectTypeDesc: 'Selecciona el tipo de incidente que mejor describa la situación.',
        viewMap: 'Ver Mapa',
        activeQueue: 'Cola de Incidentes Activos',
        forceOps: 'Centro de Operaciones de Fuerzas de Élite',
        aiEscortAdvice: 'La IA sugiere esperar al acompañamiento universitario o usar los buses institucionales.',
        timeAdviceHigh: 'Usa rutas iluminadas y el servicio de acompañamiento. Evita el Puente Peatonal después de las 20h.',
        timeAdviceModerate: 'Ten precaución cerca de Ad Portas y el puente peatonal.',
        timeAdviceLow: 'Condiciones normales. Mantente alerta en los puntos de acceso.',
        instIntel: 'Inteligencia Institucional',
        density: 'Densidad',
        alerts: 'Alertas',
        riskIndex: 'Índice de Riesgo',
        activeIncidentQueue: 'Cola de Incidentes Activos',
        campusZone: 'Zona del Campus'
    },
    en: {
        welcome: 'Welcome back,',
        home: 'Home',
        map: 'Map',
        report: 'Report',
        ai: 'AI Insights',
        activeAlerts: 'Active Alerts',
        reportIncident: 'Report an Incident',
        reportDesc: 'Immediately notify security of hazards or suspicious activity.',
        initiateAlert: 'Initiate Alert',
        settings: 'Settings',
        language: 'Language',
        alertRadius: 'Alert Radius',
        notifications: 'Notifications',
        logout: 'Logout',
        step: 'Step',
        of: 'of',
        whatHappened: 'What happened?',
        additionalContext: 'Additional Context',
        confirmAndSend: 'Confirm and Send',
        sendReport: 'Send Report',
        anonymous: 'Anonymous Report',
        safeRoute: 'Safe Route Planner',
        riskReduction: 'Risk Reduction',
        highRiskAlert: 'Alert: All routes present high risk',
        securityCommand: 'Security Command',
        liveActivity: 'Live Activity',
        updateStatus: 'Update Status',
        exportReport: 'Export Report',
        criticalZones: 'Critical Zones',
        welcomeBack: 'Welcome Back',
        loginDesc: 'Access the secure sentinel network with your institutional credentials.',
        emailLabel: 'Institutional Email',
        passLabel: 'Security Credential',
        signIn: 'Sign In to Shield',
        forgotPass: 'Forgot password?',
        encryptedSession: 'Encrypted Session',
        ssoDesc: 'Your authentication is handled through the university\'s central identity provider (SSO).',
        details: 'Details',
        detectedLoc: 'Detected Location',
        currentZone: 'Current Zone',
        safetyLevels: 'Real-time risk analysis for your current location.',
        riskScoreLabel: 'Risk Index',
        statsTotal: 'Total Incidents',
        statsActive: 'In Attention',
        statsResolved: 'Resolved',
        communityValidation: 'Community Validation',
        helpVerify: 'Help confirm these recent reports',
        stillThere: 'Is it still there?',
        confirmReport: 'Yes, still there',
        denyReport: 'Not anymore',
        pendingBadge: 'Pending',
        verifiedBadge: 'Verified',
        falseAlarmBadge: 'False Alarm',
        votes: 'votes',
        eliteProtection: 'Elite Protection for our Academic Community.',
        securingFuture: 'Securing the future of Universidad de La Sabana through advanced AI insights and real-time response infrastructure.',
        back: 'Back',
        reviewLocation: 'Review Location',
        provideDetails: 'Provide more details to help our security team respond effectively.',
        finalizeReport: 'Finalize your report. We\'ve automatically detected your location.',
        statsNew: 'New Requests',
        adminIntelligence: 'Administrative Intelligence',
        archive: 'Archive',
        attend: 'Attend',
        resolve: 'Resolve',
        liveInsights: 'Live safety insights computed from campus incident data.',
        zoneRanking: 'Zone Risk Ranking',
        commIntel: 'Community Intelligence',
        verificationRate: 'Verification rate',
        systemAccuracy: 'of reports marked false alarm by community — system accuracy improving over time.',
        currentTimeWindow: 'Current Time Window',
        activeSlot: 'Active slot',
        riskLevel: 'Risk level',
        high: 'High',
        moderate: 'Moderate',
        low: 'Low',
        routeRisk: 'Route Risk',
        extraTime: 'Extra Time',
        avoid: 'Avoid',
        routeVia: 'Route via',
        selectTypeDesc: 'Select the type of incident that best describes the situation.',
        viewMap: 'View Map',
        activeQueue: 'Active Incident Queue',
        forceOps: 'Elite Force Operations Center',
        aiEscortAdvice: 'AI suggests waiting for the university escort or using institutional shuttles.',
        timeAdviceHigh: 'Use lit routes and the university escort service. Avoid the Puente Peatonal after 20h.',
        timeAdviceModerate: 'Exercise caution near Ad Portas and the pedestrian bridge.',
        timeAdviceLow: 'Normal conditions. Stay alert at access points.',
        instIntel: 'Institutional Intelligence',
        density: 'Density',
        alerts: 'Alerts',
        riskIndex: 'Risk Index',
        activeIncidentQueue: 'Active Incident Queue',
        campusZone: 'Campus Zone'
    }
};

const t = (key) => {
    const lang = store.getLanguage();
    return translations[lang][key] || key;
};

export const common = {
    header: () => `
        <header class="fixed top-0 w-full z-50 bg-[#faf9ff] shadow-[0_12px_32px_rgba(0,10,52,0.08)] flex justify-between items-center px-6 py-4">
            <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-primary text-2xl">shield</span>
                <h1 class="text-xl font-headline font-extrabold text-[#000a34] uppercase tracking-widest">CampusShield</h1>
            </div>
            <div class="flex items-center gap-4">
                <button class="w-10 h-10 flex items-center justify-center circle bg-surface-container-low hover:bg-surface-container-highest transition-colors active:scale-95 duration-200">
                    <span class="material-symbols-outlined text-primary">notifications</span>
                </button>
                <div class="w-10 h-10 circle overflow-hidden border-2 border-primary-container cursor-pointer transition-transform hover:scale-105" id="profile-btn">
                    <div class="w-full h-full bg-primary flex items-center justify-center text-white text-xs font-bold uppercase">
                        ${store.getUser()?.name?.substring(0, 2) || 'UP'}
                    </div>
                </div>
            </div>
        </header>
    `,
    navbar: (active) => `
        <nav class="fixed bottom-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-white/80 backdrop-blur-xl z-50 rounded-t-[1.5rem] shadow-[0_-8px_24px_rgba(0,10,52,0.06)]">
            <a class="flex flex-col items-center justify-center ${active === 'dashboard' ? 'bg-gradient-to-br from-[#000a34] to-[#001c65] text-white rounded-[1rem] px-4 py-2 shadow-lg scale-105' : 'text-[#3759b6] opacity-60 px-4 py-2 hover:opacity-100 transition-opacity'}" href="#dashboard">
                <span class="material-symbols-outlined text-xl" style="${active === 'dashboard' ? "font-variation-settings: 'FILL' 1;" : ""}">home</span>
                <span class="font-label text-[10px] font-semibold uppercase tracking-tighter mt-1">${t('home')}</span>
            </a>
            <a class="flex flex-col items-center justify-center ${active === 'map' ? 'bg-gradient-to-br from-[#000a34] to-[#001c65] text-white rounded-[1rem] px-4 py-2 shadow-lg scale-105' : 'text-[#3759b6] opacity-60 px-4 py-2 hover:opacity-100 transition-opacity'}" href="#map">
                <span class="material-symbols-outlined text-xl" style="${active === 'map' ? "font-variation-settings: 'FILL' 1;" : ""}">map</span>
                <span class="font-label text-[10px] font-semibold uppercase tracking-tighter mt-1">${t('map')}</span>
            </a>
            <a class="flex flex-col items-center justify-center ${active === 'report' ? 'bg-gradient-to-br from-[#000a34] to-[#001c65] text-white rounded-[1rem] px-4 py-2 shadow-lg scale-105' : 'text-[#3759b6] opacity-60 px-4 py-2 hover:opacity-100 transition-opacity'}" href="#report">
                <span class="material-symbols-outlined text-xl" style="${active === 'report' ? "font-variation-settings: 'FILL' 1;" : ""}">emergency</span>
                <span class="font-label text-[10px] font-semibold uppercase tracking-tighter mt-1">${t('report')}</span>
            </a>
            <a class="flex flex-col items-center justify-center ${active === 'ai' ? 'bg-gradient-to-br from-[#000a34] to-[#001c65] text-white rounded-[1rem] px-4 py-2 shadow-lg scale-105' : 'text-[#3759b6] opacity-60 px-4 py-2 hover:opacity-100 transition-opacity'}" href="#ai">
                <span class="material-symbols-outlined text-xl" style="${active === 'ai' ? "font-variation-settings: 'FILL' 1;" : ""}">psychology</span>
                <span class="font-label text-[10px] font-semibold uppercase tracking-tighter mt-1">${t('ai')}</span>
            </a>
        </nav>
    `,
    sosFab: () => `
        <button id="sos-btn" class="fixed right-6 bottom-28 w-16 h-16 bg-error circle shadow-[0_12px_32px_rgba(186,26,26,0.3)] text-white flex items-center justify-center z-40 active:scale-90 transition-transform relative group">
            <span class="absolute inset-0 circle bg-error/20 animate-ping group-hover:animate-none"></span>
            <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">sos</span>
        </button>
    `
};

export const views = {
    login: () => `
        <div class="relative min-h-screen flex flex-col md:flex-row">
            <div class="hidden md:flex md:w-1/2 lg:w-3/5 bg-primary relative overflow-hidden items-end p-16">
                <div class="absolute inset-0 z-0">
                    <img class="w-full h-full object-cover opacity-40 mix-blend-luminosity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwz21f8Y6gVmwqvx6H99HyMBcTfdSMG7_koV3s5UgwXN0-wu6XpenumSViFVfniZ5RCwgPxmP7rjaHDvyLImzrKXxxuc2kX3s6r8tGeAWFMnpaWyG3HdgK_lr21PZUQMeLY8LNmsUQeY7LnYXv-8N1ut8OHff74xE09WSfI6EEG4oDIbYpHIeymVRJWo0YDXTyerRyNYXGq9oNiMKMSIXiKV_9_OQPrG0wq-kEpyWNy8_GfxK-pfzbApSSzI-uFBzSJoHHD2pje3A"/>
                    <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent"></div>
                </div>
                <div class="relative z-10 max-w-lg">
                    <div class="flex items-center gap-4 mb-8">
                        <span class="material-symbols-outlined text-surface text-5xl">shield</span>
                        <h1 class="font-headline font-extrabold text-4xl text-surface tracking-widest uppercase">CampusShield</h1>
                    </div>
                    <h2 class="font-headline text-5xl font-extrabold text-surface leading-tight mb-6">${t('eliteProtection')}</h2>
                    <p class="text-surface-variant text-lg leading-relaxed max-w-md">${t('securingFuture')}</p>
                </div>
            </div>
            <div class="flex-1 flex flex-col justify-center items-center px-6 py-12 md:px-16 lg:px-24 bg-surface relative">
                <div class="md:hidden absolute top-8 left-8 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-3xl">shield</span>
                    <span class="font-headline font-extrabold text-primary text-lg tracking-widest uppercase">CampusShield</span>
                </div>
                <div class="w-full max-w-md">
                    <div class="mb-10 text-center md:text-left">
                        <h3 class="font-headline text-3xl font-extrabold text-primary mb-2">${t('welcomeBack')}</h3>
                        <p class="text-on-surface-variant">${t('loginDesc')}</p>
                    </div>
                    <form id="login-form" class="space-y-6">
                        <div class="space-y-2">
                            <label class="block font-label text-xs font-semibold uppercase tracking-wider text-outline" for="email">${t('emailLabel')}</label>
                            <div class="relative group">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span class="material-symbols-outlined text-outline group-focus-within:text-secondary transition-colors">mail</span>
                                </div>
                                <input class="block w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl text-on-surface focus:ring-2 focus:ring-secondary transition-all placeholder:text-outline/50" id="email" name="email" placeholder="username@unisabana.edu.co" required type="email"/>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="flex justify-between items-end">
                                <label class="block font-label text-xs font-semibold uppercase tracking-wider text-outline" for="password">${t('passLabel')}</label>
                                <a class="text-xs font-semibold text-secondary hover:underline transition-all" href="#">${t('forgotPass')}</a>
                            </div>
                            <div class="relative group">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span class="material-symbols-outlined text-outline group-focus-within:text-secondary transition-colors">lock</span>
                                </div>
                                <input class="block w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl text-on-surface focus:ring-2 focus:ring-secondary transition-all placeholder:text-outline/50" id="password" name="password" placeholder="••••••••" required type="password"/>
                            </div>
                        </div>
                        <div class="pt-4">
                            <button class="w-full py-4 px-6 bg-gradient-to-br from-primary to-primary-container text-surface font-headline font-bold rounded-xl shadow-[0_12px_32px_rgba(0,10,52,0.15)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2" type="submit">
                                <span>${t('signIn')}</span>
                                <span class="material-symbols-outlined text-lg">login</span>
                            </button>
                        </div>
                    </form>
                    <div class="mt-8 flex justify-center gap-4">
                        <button onclick="window.setLang('es')" class="text-xs font-bold ${store.getLanguage() === 'es' ? 'text-primary' : 'text-outline'} hover:text-secondary transition-colors uppercase">Español</button>
                        <span class="text-outline/20">|</span>
                        <button onclick="window.setLang('en')" class="text-xs font-bold ${store.getLanguage() === 'en' ? 'text-primary' : 'text-outline'} hover:text-secondary transition-colors uppercase">English</button>
                    </div>
                    <div class="mt-12 p-6 bg-surface-container rounded-xl flex items-start gap-4">
                        <span class="material-symbols-outlined text-on-secondary-fixed-variant">verified_user</span>
                        <div>
                            <p class="text-xs font-bold uppercase text-primary tracking-tight">${t('encryptedSession')}</p>
                            <p class="text-xs text-on-surface-variant leading-relaxed">${t('ssoDesc')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    dashboard: () => {
        const user = store.getUser();
        const allIncidents = store.getIncidents();
        const pendingForUser = store.getPendingValidationForUser();
        const incidents = allIncidents.filter(i => i.validationStatus !== 'discarded');
        const zones = store.getZones();
        const currentZone = zones.find(z => z.id === 'ad-portas') || zones[0];
        
        const circumference = 2 * Math.PI * 58;
        const offset = circumference - (currentZone.riskScore / 100) * circumference;
        const riskColor = currentZone.riskScore > 70 ? '#ba1a1a' : currentZone.riskScore > 40 ? '#eee900' : '#18409d';
        
        return `
            ${common.header()}
            <main class="pt-24 pb-32 px-6 max-w-5xl mx-auto space-y-8 view-enter">
                <section class="space-y-1">
                    <p class="text-secondary font-label font-semibold tracking-wider uppercase text-[10px]">Institutional Security Dashboard</p>
                    <h2 class="text-3xl font-headline font-extrabold text-primary leading-tight">${t('welcome')}<br/>${user?.name || 'User'}</h2>
                </section>
                
                <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div class="md:col-span-7 bg-surface-container-lowest rounded-[1.5rem] p-8 shadow-[0_8px_24px_rgba(0,10,52,0.04)] relative overflow-hidden flex flex-col justify-between transition-all hover:shadow-lg border border-outline-variant/10">
                        <div class="relative z-10">
                            <div class="flex justify-between items-start mb-6">
                                <div>
                                    <h3 class="text-sm font-label font-bold text-outline uppercase tracking-widest mb-1">${t('currentZone')}</h3>
                                    <p class="text-xl font-headline font-bold text-primary">${currentZone.name}</p>
                                </div>
                                <div class="flex items-center gap-2 bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant/20">
                                    <span class="w-2 h-2 rounded-full animate-pulse" style="background-color: ${riskColor}"></span>
                                    <span class="text-[10px] font-bold uppercase tracking-tighter" style="color: ${riskColor}">${currentZone.riskScore > 70 ? t('high') : currentZone.riskScore > 40 ? t('moderate') : t('low')} Risk</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-8 mb-4">
                                <div class="relative w-32 h-32 flex items-center justify-center">
                                    <svg class="w-full h-full -rotate-90">
                                        <circle class="text-surface-container" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" stroke-width="10"></circle>
                                        <circle cx="64" cy="64" fill="transparent" r="58" stroke="${riskColor}" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round" stroke-width="12" class="transition-all duration-1000"></circle>
                                    </svg>
                                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                                        <span class="text-3xl font-headline font-extrabold text-primary">${currentZone.riskScore}</span>
                                        <span class="text-[10px] text-outline font-semibold uppercase">${t('riskScoreLabel')}</span>
                                    </div>
                                </div>
                                <div class="flex-1 space-y-4">
                                    <p class="text-sm text-on-surface-variant leading-relaxed">${t('safetyLevels')}</p>
                                    <div class="space-y-2">
                                        <div class="flex justify-between text-[10px] font-bold text-outline uppercase">
                                            <span>${t('density')}: ${currentZone.density}</span>
                                            <span>${t('alerts')}: ${currentZone.alerts}</span>
                                        </div>
                                        <div class="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                                            <div class="h-full transition-all duration-1000" style="background-color: ${riskColor}; width: ${currentZone.riskScore}%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="absolute -right-16 -bottom-16 w-48 h-48 opacity-10 rounded-full blur-3xl" style="background-color: ${riskColor}"></div>
                    </div>

                    <div class="md:col-span-5 bg-primary rounded-[1.5rem] p-8 text-white flex flex-col justify-between shadow-[0_12px_32px_rgba(0,10,52,0.12)] relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
                        <div class="relative z-10">
                            <h3 class="text-2xl font-headline font-bold mb-4">${t('reportIncident')}</h3>
                            <p class="text-white/70 text-sm mb-6 leading-relaxed">${t('reportDesc')}</p>
                        </div>
                        <a href="#report" class="w-full py-4 bg-white text-primary font-headline font-bold rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform text-center relative z-10 hover:bg-secondary-fixed transition-colors">
                            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">warning</span>
                            ${t('initiateAlert')}
                        </a>
                    </div>
                </div>

                ${pendingForUser.length > 0 ? `
                <section class="space-y-4">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                            <span class="material-symbols-outlined text-secondary text-lg" style="font-variation-settings: 'FILL' 1;">fact_check</span>
                        </div>
                        <div>
                            <h3 class="text-lg font-headline font-bold text-primary">${t('communityValidation')}</h3>
                            <p class="text-[11px] text-outline">${t('helpVerify')}</p>
                        </div>
                        <span class="ml-auto text-[10px] font-extrabold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full uppercase">${pendingForUser.length}</span>
                    </div>
                    <div class="space-y-3">
                        ${pendingForUser.map(inc => `
                        <div class="bg-surface-container-lowest rounded-2xl p-5 border border-secondary/20 relative overflow-hidden shadow-sm">
                            <div class="absolute top-0 right-0 px-3 py-1.5 bg-secondary/10 rounded-bl-2xl flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                                <span class="text-[9px] font-extrabold text-secondary uppercase tracking-wider">${t('pendingBadge')}</span>
                            </div>
                            <div class="flex items-start gap-4 mb-4 pr-20">
                                <div class="w-10 h-10 ${inc.intensity === 'High' ? 'bg-error/10 text-error' : 'bg-tertiary/10 text-tertiary'} rounded-xl flex items-center justify-center shrink-0">
                                    <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">${inc.type === 'SOS EMERGENCY' ? 'emergency_home' : inc.type === 'Maintenance' ? 'bolt' : 'warning'}</span>
                                </div>
                                <div>
                                    <h4 class="font-headline font-bold text-primary">${inc.type} — ${inc.location}</h4>
                                    <p class="text-[11px] text-outline mt-0.5">${inc.time}</p>
                                    <p class="text-xs text-on-surface-variant mt-1 line-clamp-2">${inc.details}</p>
                                </div>
                            </div>
                            <div class="flex items-center justify-between mb-3">
                                <p class="text-sm font-bold text-primary">${t('stillThere')}</p>
                                <span class="text-[10px] text-outline">${inc.confirmations.length} ✓ · ${inc.denials.length} ✗</span>
                            </div>
                            <div class="flex gap-3">
                                <button onclick="window.validateIncident(${inc.id}, 'confirm')"
                                    class="flex-1 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm">
                                    <span class="material-symbols-outlined text-base" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                                    ${t('confirmReport')}
                                </button>
                                <button onclick="window.validateIncident(${inc.id}, 'deny')"
                                    class="flex-1 py-3 border-2 border-error/40 text-error font-bold rounded-xl text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-error/5">
                                    <span class="material-symbols-outlined text-base" style="font-variation-settings: 'FILL' 1;">cancel</span>
                                    ${t('denyReport')}
                                </button>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </section>
                ` : ''}

                <section class="space-y-6">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-headline font-bold text-primary">${t('activeAlerts')}</h3>
                        <a href="#map" class="text-xs font-bold text-secondary uppercase hover:underline">${t('viewMap')}</a>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${incidents.map(inc => {
                            const isHigh = inc.intensity === 'High' || inc.type === 'SOS EMERGENCY';
                            const isMed  = inc.intensity === 'Medium' || inc.type === 'Suspicious Person' || inc.type === 'Suspicious Activity' || inc.type === 'Dark Zone';
                            const borderColor = isHigh ? 'border-l-error' : isMed ? 'border-l-tertiary' : 'border-l-secondary';
                            const iconBg      = isHigh ? 'bg-error/10 text-error' : isMed ? 'bg-tertiary/10 text-tertiary' : 'bg-secondary/10 text-secondary';
                            const scoreColor  = inc.riskScore > 70 ? 'text-error' : inc.riskScore > 40 ? 'text-tertiary' : 'text-on-secondary-fixed-variant';
                            const icon = inc.type === 'SOS EMERGENCY' ? 'emergency_home'
                                       : inc.type === 'Maintenance'   ? 'bolt'
                                       : inc.type === 'Theft/Robbery' ? 'lock_open'
                                       : inc.type === 'Dark Zone'     ? 'lightbulb'
                                       : 'visibility';
                            const validationBadge = inc.validationStatus === 'pending'
                                ? `<span class="text-[9px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 circle flex items-center gap-1"><span class="w-1.5 h-1.5 circle bg-secondary animate-pulse inline-block"></span>${t('pendingBadge')}</span>`
                                : `<span class="text-[9px] font-bold text-on-secondary-fixed-variant bg-on-secondary-fixed-variant/10 px-2 py-0.5 circle flex items-center gap-1"><span class="material-symbols-outlined text-[10px]">verified</span>${t('verifiedBadge')}</span>`;
                            return `
                            <div class="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-[5px] ${borderColor}">
                                <div class="p-5 space-y-3">
                                    <div class="flex items-start justify-between gap-3">
                                        <div class="flex items-start gap-3 min-w-0">
                                            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${iconBg}">
                                                <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">${icon}</span>
                                            </div>
                                            <div class="min-w-0">
                                                <p class="text-[10px] font-extrabold text-outline uppercase tracking-widest leading-none">${inc.location}</p>
                                                <h4 class="font-headline font-bold text-primary text-base leading-snug mt-0.5">${inc.type}</h4>
                                            </div>
                                        </div>
                                        ${inc.riskScore !== undefined ? `
                                        <div class="shrink-0 text-right mt-0.5">
                                            <p class="text-2xl font-headline font-extrabold leading-none ${scoreColor}">${inc.riskScore}</p>
                                            <p class="text-[9px] text-outline uppercase font-bold tracking-wider">Index</p>
                                        </div>` : ''}
                                    </div>
                                    <p class="text-sm text-on-surface-variant leading-relaxed line-clamp-2">${inc.details}</p>
                                    <div class="flex flex-wrap items-center gap-1.5">
                                        ${validationBadge}
                                        <span class="text-[9px] font-medium text-outline">${inc.time}</span>
                                    </div>
                                </div>
                            </div>`;
                        }).join('')}
                    </div>
                </section>
            </main>
            ${common.sosFab()}
            ${common.navbar('dashboard')}
        `;
    },
    report: () => `
        ${common.header()}
        <main class="pt-24 pb-32 px-6 max-w-2xl mx-auto view-enter">
            <section class="mb-10">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="font-headline text-2xl text-primary font-semibold">${t('report')}</h2>
                    <span id="step-counter" class="text-secondary font-bold text-sm">${t('step')} 1 ${t('of')} 3</span>
                </div>
                <div class="flex gap-2 h-1.5 w-full">
                    <div id="step-bar-1" class="flex-1 bg-secondary rounded-full transition-all"></div>
                    <div id="step-bar-2" class="flex-1 bg-surface-container-highest rounded-full transition-all"></div>
                    <div id="step-bar-3" class="flex-1 bg-surface-container-highest rounded-full transition-all"></div>
                </div>
            </section>
            
            <section id="report-step-1" class="space-y-8 animate-in fade-in duration-300">
                <section>
                    <h3 class="font-headline text-xl text-primary-container mb-2">${t('whatHappened')}</h3>
                    <p class="text-on-surface-variant text-sm">${t('selectTypeDesc')}</p>
                </section>
                <div class="grid grid-cols-2 gap-4 mb-12">
                    <button class="incident-type-btn flex flex-col items-start p-6 rounded-xl bg-surface-container-low hover:bg-secondary-container hover:text-on-secondary-container transition-all group border border-transparent shadow-sm text-left" data-type="Theft/Robbery">
                        <div class="mb-4 bg-primary-container/10 p-3 rounded-lg group-hover:bg-white/20">
                            <span class="material-symbols-outlined text-primary">lock_open</span>
                        </div>
                        <span class="font-headline font-bold text-lg leading-tight">Theft/Robbery</span>
                    </button>
                    <button class="incident-type-btn flex flex-col items-start p-6 rounded-xl bg-surface-container-highest hover:bg-secondary-container hover:text-on-secondary-container transition-all group border border-transparent shadow-sm text-left" data-type="Suspicious Person">
                        <div class="mb-4 bg-primary-container/10 p-3 rounded-lg group-hover:bg-white/20">
                            <span class="material-symbols-outlined text-primary">visibility</span>
                        </div>
                        <span class="font-headline font-bold text-lg leading-tight">Suspicious Person</span>
                    </button>
                    <button class="incident-type-btn flex items-center justify-between p-6 rounded-xl bg-primary-container text-white hover:bg-secondary transition-all group shadow-lg col-span-2 relative overflow-hidden" data-type="Dark Zone">
                        <div class="z-10 relative">
                            <div class="mb-2 bg-white/20 p-3 rounded-lg inline-block">
                                <span class="material-symbols-outlined text-white">lightbulb_outline</span>
                            </div>
                            <span class="block font-headline font-bold text-xl">Dark Zone</span>
                            <p class="text-white/70 text-xs mt-1 font-body">Reporting insufficient lighting</p>
                        </div>
                        <span class="material-symbols-outlined z-10 relative">arrow_forward</span>
                    </button>
                </div>
            </section>

            <section id="report-step-2" class="hidden space-y-6 animate-in fade-in duration-300">
                <section>
                    <h3 class="font-headline text-xl text-primary-container mb-2">${t('additionalContext')}</h3>
                    <p class="text-on-surface-variant text-sm">${t('provideDetails')}</p>
                </section>
                <div class="space-y-4">
                    <label class="block font-label text-xs font-semibold uppercase tracking-wider text-outline">${t('details')}</label>
                    <textarea id="incident-details" class="w-full p-4 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-secondary text-on-surface transition-all" rows="5" placeholder="Describe the incident..."></textarea>
                    
                    <div class="flex items-center gap-3 p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20 transition-colors hover:bg-surface-container-low">
                        <input type="checkbox" id="anonymous-mode" class="w-5 h-5 rounded border-outline text-primary focus:ring-primary"/>
                        <label for="anonymous-mode" class="text-sm font-bold text-primary cursor-pointer">${t('anonymous')}</label>
                    </div>
                </div>
                <div class="flex gap-3 pt-4">
                    <button id="back-to-step-1" class="flex-1 py-5 rounded-xl border-2 border-primary/20 text-primary font-headline font-bold text-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined">chevron_left</span>
                        ${t('back')}
                    </button>
                    <button id="next-to-step-3" class="flex-[2] py-5 rounded-xl bg-gradient-to-br from-[#000a34] to-[#001c65] text-white font-headline font-bold text-lg shadow-[0_12px_32px_rgba(0,10,52,0.15)] active:scale-95 transition-transform flex items-center justify-center gap-2">
                        ${t('reviewLocation')}
                        <span class="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </section>

            <section id="report-step-3" class="hidden space-y-6 animate-in fade-in duration-300">
                <section>
                    <h3 class="font-headline text-xl text-primary-container mb-2">${t('confirmAndSend')}</h3>
                    <p class="text-on-surface-variant text-sm">${t('finalizeReport')}</p>
                </section>
                <div class="bg-surface-container-low p-6 rounded-xl border-l-4 border-on-secondary-fixed-variant space-y-4">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-on-secondary-fixed-variant" style="font-variation-settings: 'FILL' 1;">location_on</span>
                        <div>
                            <p class="text-[10px] font-label uppercase tracking-wider text-outline">${t('detectedLoc')}</p>
                            <p class="text-lg font-bold text-primary">Ad Portas Building</p>
                        </div>
                    </div>
                </div>
                <div class="flex gap-3">
                    <button id="back-to-step-2" class="flex-1 py-5 rounded-xl border-2 border-primary/20 text-primary font-headline font-bold text-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined">chevron_left</span>
                        ${t('back')}
                    </button>
                    <button id="submit-report-btn" class="flex-[2] py-5 rounded-xl bg-gradient-to-br from-[#000a34] to-[#001c65] text-white font-headline font-bold text-lg shadow-[0_12px_32px_rgba(0,10,52,0.15)] active:scale-95 transition-transform flex items-center justify-center gap-2">
                        ${t('sendReport')}
                        <span class="material-symbols-outlined">send</span>
                    </button>
                </div>
            </section>
        </main>
        ${common.navbar('report')}
    `,
    map: () => {
        const zones = store.getZones();
        return `
            ${common.header()}
            <main class="pt-20 pb-32 view-enter">
                <section class="px-4 relative">
                    <div id="campus-map" class="w-full h-[397px] rounded-[2rem] overflow-hidden shadow-2xl bg-surface-container-highest"></div>
                </section>
                <section class="px-6 mt-10">
                    <h2 class="font-headline text-2xl font-semibold text-primary mb-6">${t('criticalZones')}</h2>
                    <div class="grid grid-cols-1 gap-4">
                        ${zones.map(z => `
                            <div class="bg-surface-container-lowest rounded-[1.5rem] p-5 shadow-sm border-l-8 ${z.riskScore > 70 ? 'border-error' : z.riskScore > 40 ? 'border-tertiary' : 'border-on-secondary-fixed-variant'} transition-transform hover:translate-x-1">
                                <div class="flex justify-between items-start">
                                    <div class="flex items-center gap-4">
                                        <div class="w-14 h-14 rounded-2xl bg-primary-container/10 flex items-center justify-center">
                                            <span class="material-symbols-outlined text-primary">${z.riskScore > 50 ? 'warning' : 'verified_user'}</span>
                                        </div>
                                        <div>
                                            <h3 class="font-headline font-bold text-primary text-lg">${z.name}</h3>
                                            <p class="text-sm text-outline">${t('density')}: <b>${z.density}</b> • ${t('alerts')}: <b>${z.alerts}</b></p>
                                        </div>
                                    </div>
                                    <div class="flex flex-col items-end">
                                        <span class="text-2xl font-headline font-extrabold ${z.riskScore > 70 ? 'text-error' : z.riskScore > 40 ? 'text-tertiary' : 'text-on-secondary-fixed-variant'}">${z.riskScore}</span>
                                        <span class="text-[10px] font-bold uppercase tracking-tighter opacity-60">${t('riskIndex')}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>
            </main>
            ${common.sosFab()}
            ${common.navbar('map')}
        `;
    },
    ai: () => {
        const zones     = store.getZones();
        const incidents = store.getIncidents();
        const isAllHighRisk = zones.every(z => z.riskScore > 60);

        const sorted      = [...zones].sort((a, b) => b.riskScore - a.riskScore);
        const worstZone   = sorted[0];
        const safestZone  = sorted[sorted.length - 1];
        const riskReduction = worstZone.riskScore > safestZone.riskScore
            ? Math.round(((worstZone.riskScore - safestZone.riskScore) / worstZone.riskScore) * 100)
            : 5;

        const total     = incidents.length;
        const verified  = incidents.filter(i => i.validationStatus === 'verified').length;
        const discarded = incidents.filter(i => i.validationStatus === 'discarded').length;
        const pending   = incidents.filter(i => i.validationStatus === 'pending').length;
        const verifiedPct  = total > 0 ? Math.round((verified  / total) * 100) : 0;
        const falseAlarmPct = total > 0 ? Math.round((discarded / total) * 100) : 0;

        const hour = new Date().getHours();
        const timeSlot    = hour < 6 ? '00–06h' : hour < 12 ? '06–12h' : hour < 18 ? '12–18h' : '18–24h';
        const timeRiskLvl = hour >= 20 || hour < 6 ? t('high') : hour >= 18 ? t('moderate') : t('low');
        const timeColor   = hour >= 20 || hour < 6 ? 'text-error' : hour >= 18 ? 'text-tertiary' : 'text-on-secondary-fixed-variant';
        const timeAdvice  = hour >= 20 || hour < 6 ? t('timeAdviceHigh') : hour >= 18 ? t('timeAdviceModerate') : t('timeAdviceLow');

        return `
            ${common.header()}
            <main class="pt-24 px-6 max-w-2xl mx-auto space-y-8 pb-32 view-enter">
                <section>
                    <span class="text-secondary font-label text-[10px] font-semibold uppercase tracking-[0.2em] block mb-2">${t('instIntel')}</span>
                    <h1 class="text-4xl font-headline font-extrabold text-primary tracking-tight leading-tight">${t('ai')}</h1>
                    <p class="text-on-surface-variant text-sm mt-2">${t('liveInsights')}</p>
                </section>

                ${isAllHighRisk ? `
                <div class="bg-error/10 border-2 border-error rounded-2xl p-5 flex items-start gap-4 animate-pulse">
                    <span class="material-symbols-outlined text-error text-3xl" style="font-variation-settings:'FILL' 1;">warning_amber</span>
                    <div>
                        <h3 class="font-bold text-error text-base">${t('highRiskAlert')}</h3>
                        <p class="text-error/80 text-sm mt-1">${t('aiEscortAdvice')}</p>
                    </div>
                </div>` : ''}

                <div class="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgba(0,10,52,0.05)] border border-outline-variant/10">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">route</span>
                        <h2 class="font-headline font-semibold text-lg text-primary">${t('safeRoute')}</h2>
                    </div>
                    <div class="p-5 bg-gradient-to-br from-primary to-primary-container rounded-2xl text-white shadow-xl relative overflow-hidden group">
                        <div class="relative z-10">
                            <p class="text-white/60 text-[10px] uppercase font-bold tracking-widest mb-1">${t('avoid')} ${worstZone.name} (${worstZone.riskScore} risk)</p>
                            <h3 class="text-lg font-headline font-bold mb-4">${t('routeVia')} ${safestZone.name}</h3>
                            <div class="flex items-center gap-6">
                                <div>
                                    <p class="text-3xl font-headline font-extrabold text-tertiary-fixed">${riskReduction}%</p>
                                    <p class="text-[10px] text-white/60 uppercase font-bold mt-0.5">${t('riskReduction')}</p>
                                </div>
                                <div class="w-px h-10 bg-white/15"></div>
                                <div>
                                    <p class="text-3xl font-headline font-extrabold">+4 min</p>
                                    <p class="text-[10px] text-white/60 uppercase font-bold mt-0.5">${t('extraTime')}</p>
                                </div>
                                <div class="w-px h-10 bg-white/15"></div>
                                <div>
                                    <p class="text-3xl font-headline font-extrabold">${safestZone.riskScore}</p>
                                    <p class="text-[10px] text-white/60 uppercase font-bold mt-0.5">${t('routeRisk')}</p>
                                </div>
                            </div>
                        </div>
                        <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-white/10 text-9xl transition-transform group-hover:scale-110">verified_user</span>
                    </div>
                </div>

                <div class="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgba(0,10,52,0.05)] border border-outline-variant/10 space-y-4">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">bar_chart</span>
                        <h2 class="font-headline font-semibold text-lg text-primary">${t('zoneRanking')}</h2>
                    </div>
                    <div class="space-y-3">
                        ${sorted.map((z, i) => {
                            const zColor = z.riskScore > 70 ? '#ba1a1a' : z.riskScore > 40 ? '#636100' : '#18409d';
                            return `
                            <div class="space-y-1">
                                <div class="flex justify-between items-center">
                                    <div class="flex items-center gap-2">
                                        <span class="text-[10px] font-extrabold text-outline w-4">${i + 1}</span>
                                        <p class="text-sm font-bold text-primary">${z.name}</p>
                                    </div>
                                    <span class="text-sm font-headline font-extrabold" style="color:${zColor}">${z.riskScore}</span>
                                </div>
                                <div class="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                                    <div class="h-full rounded-full transition-all duration-700" style="width:${z.riskScore}%; background-color:${zColor}"></div>
                                </div>
                            </div>`;
                        }).join('')}
                    </div>
                </div>

                <div class="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgba(0,10,52,0.05)] border border-outline-variant/10 space-y-4">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">groups</span>
                        <h2 class="font-headline font-semibold text-lg text-primary">${t('commIntel')}</h2>
                    </div>
                    <div class="grid grid-cols-3 gap-3">
                        <div class="bg-on-secondary-fixed-variant/10 rounded-2xl p-4 text-center">
                            <p class="text-2xl font-headline font-extrabold text-on-secondary-fixed-variant">${verified}</p>
                            <p class="text-[10px] font-bold text-outline uppercase mt-1">${t('verifiedBadge')}</p>
                        </div>
                        <div class="bg-secondary/10 rounded-2xl p-4 text-center">
                            <p class="text-2xl font-headline font-extrabold text-secondary">${pending}</p>
                            <p class="text-[10px] font-bold text-outline uppercase mt-1">${t('pendingBadge')}</p>
                        </div>
                        <div class="bg-surface-container-high rounded-2xl p-4 text-center">
                            <p class="text-2xl font-headline font-extrabold text-outline">${discarded}</p>
                            <p class="text-[10px] font-bold text-outline uppercase mt-1">${t('falseAlarmBadge')}</p>
                        </div>
                    </div>
                    <div class="space-y-2 pt-1">
                        <div class="flex justify-between text-xs font-bold text-outline uppercase">
                            <span>${t('verificationRate')}</span><span class="text-on-secondary-fixed-variant">${verifiedPct}%</span>
                        </div>
                        <div class="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                            <div class="h-full bg-on-secondary-fixed-variant rounded-full" style="width:${verifiedPct}%"></div>
                        </div>
                        <p class="text-[11px] text-on-surface-variant">${falseAlarmPct}% ${t('systemAccuracy')}</p>
                    </div>
                </div>

                <div class="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgba(0,10,52,0.05)] border border-outline-variant/10">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">schedule</span>
                        <h2 class="font-headline font-semibold text-lg text-primary">${t('currentTimeWindow')}</h2>
                    </div>
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <p class="text-[10px] font-bold text-outline uppercase tracking-widest">${t('activeSlot')}</p>
                            <p class="text-2xl font-headline font-extrabold text-primary">${timeSlot}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-[10px] font-bold text-outline uppercase tracking-widest">${t('riskLevel')}</p>
                            <p class="text-2xl font-headline font-extrabold ${timeColor}">${timeRiskLvl}</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl">
                        <span class="material-symbols-outlined text-secondary shrink-0 mt-0.5" style="font-variation-settings:'FILL' 1;">psychology</span>
                        <p class="text-sm text-on-surface-variant leading-relaxed">${timeAdvice}</p>
                    </div>
                </div>
            </main>
            ${common.navbar('ai')}
        `;
    },
    settings: () => {
        const settings = store.getSettings();
        const user = store.getUser();
        return `
            ${common.header()}
            <main class="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-8 view-enter">
                <section>
                    <h2 class="text-3xl font-headline font-extrabold text-primary">${t('settings')}</h2>
                    <p class="text-on-surface-variant text-sm mt-1">${user?.email}</p>
                </section>

                <div class="space-y-4">
                    <div class="bg-surface-container-low rounded-xl p-6 flex justify-between items-center transition-colors hover:bg-surface-container-high">
                        <div class="flex items-center gap-4">
                            <span class="material-symbols-outlined text-primary">translate</span>
                            <div>
                                <h4 class="font-bold text-primary">${t('language')}</h4>
                                <p class="text-xs text-outline">${store.getLanguage() === 'es' ? 'Español' : 'English'}</p>
                            </div>
                        </div>
                        <select id="lang-select" class="bg-white border-none rounded-lg text-sm font-bold text-primary focus:ring-2 focus:ring-secondary cursor-pointer">
                            <option value="es" ${store.getLanguage() === 'es' ? 'selected' : ''}>Español</option>
                            <option value="en" ${store.getLanguage() === 'en' ? 'selected' : ''}>English</option>
                        </select>
                    </div>

                    <div class="bg-surface-container-low rounded-xl p-6 flex justify-between items-center transition-colors hover:bg-surface-container-high">
                        <div class="flex items-center gap-4">
                            <span class="material-symbols-outlined text-primary">radar</span>
                            <div>
                                <h4 class="font-bold text-primary">${t('alertRadius')}</h4>
                                <p class="text-xs text-outline">Receive alerts near you</p>
                            </div>
                        </div>
                        <select id="radius-select" class="bg-white border-none rounded-lg text-sm font-bold text-primary focus:ring-2 focus:ring-secondary cursor-pointer">
                            <option value="200m" ${settings.alertRadius === '200m' ? 'selected' : ''}>200m</option>
                            <option value="500m" ${settings.alertRadius === '500m' ? 'selected' : ''}>500m</option>
                            <option value="0" ${settings.alertRadius === '0' ? 'selected' : ''}>Disabled</option>
                        </select>
                    </div>

                    <div class="bg-surface-container-low rounded-xl p-6 flex justify-between items-center transition-colors hover:bg-surface-container-high">
                        <div class="flex items-center gap-4">
                            <span class="material-symbols-outlined text-primary">notifications</span>
                            <div>
                                <h4 class="font-bold text-primary">${t('notifications')}</h4>
                                <p class="text-xs text-outline">Push alerts on critical events</p>
                            </div>
                        </div>
                        <button id="toggle-notifications" class="w-12 h-6 circle relative transition-all duration-300 ${settings.notifications ? 'bg-secondary' : 'bg-outline/30'}">
                            <div class="absolute top-1 left-1 w-4 h-4 bg-white circle transition-transform duration-300 ${settings.notifications ? 'translate-x-6' : ''}"></div>
                        </button>
                    </div>
                </div>

                <button id="logout-btn" class="w-full py-4 text-error font-bold border-2 border-error/20 rounded-xl hover:bg-error/5 transition-all flex items-center justify-center gap-2 active:scale-95">
                    <span class="material-symbols-outlined">logout</span>
                    ${t('logout')}
                </button>
            </main>
            ${common.navbar('settings')}
        `;
    },
    admin: () => {
        const incidents = store.getIncidents();
        const zones = store.getZones();

        const stats = {
            total: incidents.length,
            active: incidents.filter(i => i.status === 'In Attention').length,
            new: incidents.filter(i => i.status === 'New').length,
            resolved: incidents.filter(i => i.status === 'Resolved').length,
            falseAlarms: incidents.filter(i => i.validationStatus === 'discarded').length,
            pending: incidents.filter(i => i.validationStatus === 'pending').length
        };
        
        return `
            ${common.header()}
            <main class="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto space-y-8 view-enter">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 class="text-4xl font-headline font-extrabold text-primary leading-tight">${t('securityCommand')}</h2>
                        <p class="text-outline font-bold uppercase text-[10px] tracking-widest mt-2">${t('forceOps')}</p>
                    </div>
                    <div class="flex gap-4">
                        <button id="export-btn" class="bg-white text-primary font-bold text-xs border border-primary/20 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-surface-container-low transition-all shadow-sm active:scale-95">
                            <span class="material-symbols-outlined text-sm">download</span>
                            ${t('exportReport')}
                        </button>
                    </div>
                </div>

                <!-- Admin Statistics -->
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div class="bg-primary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group col-span-1">
                        <div class="relative z-10">
                            <p class="text-[10px] font-bold opacity-60 uppercase">${t('statsTotal')}</p>
                            <p class="text-3xl font-headline font-extrabold mt-1">${stats.total}</p>
                        </div>
                        <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-white/5 text-8xl group-hover:scale-110 transition-transform">analytics</span>
                    </div>
                    <div class="bg-error text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group col-span-1">
                        <div class="relative z-10">
                            <p class="text-[10px] font-bold opacity-60 uppercase">${t('statsNew')}</p>
                            <p class="text-3xl font-headline font-extrabold mt-1">${stats.new}</p>
                        </div>
                        <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-white/5 text-8xl group-hover:scale-110 transition-transform">priority_high</span>
                    </div>
                    <div class="bg-tertiary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group col-span-1">
                        <div class="relative z-10">
                            <p class="text-[10px] font-bold opacity-60 uppercase">${t('statsActive')}</p>
                            <p class="text-3xl font-headline font-extrabold mt-1">${stats.active}</p>
                        </div>
                        <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-white/5 text-8xl group-hover:scale-110 transition-transform">engineering</span>
                    </div>
                    <div class="bg-on-secondary-fixed-variant text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group col-span-1">
                        <div class="relative z-10">
                            <p class="text-[10px] font-bold opacity-60 uppercase">${t('statsResolved')}</p>
                            <p class="text-3xl font-headline font-extrabold mt-1">${stats.resolved}</p>
                        </div>
                        <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-white/5 text-8xl group-hover:scale-110 transition-transform">verified</span>
                    </div>
                    <div class="bg-secondary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group col-span-1">
                        <div class="relative z-10">
                            <p class="text-[10px] font-bold opacity-60 uppercase">${t('pendingBadge')}</p>
                            <p class="text-3xl font-headline font-extrabold mt-1">${stats.pending}</p>
                        </div>
                        <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-white/5 text-8xl group-hover:scale-110 transition-transform">fact_check</span>
                    </div>
                    <div class="bg-surface-container-highest text-primary p-6 rounded-2xl shadow-lg relative overflow-hidden group col-span-1">
                        <div class="relative z-10">
                            <p class="text-[10px] font-bold text-outline uppercase">${t('falseAlarmBadge')}</p>
                            <p class="text-3xl font-headline font-extrabold mt-1">${stats.falseAlarms}</p>
                        </div>
                        <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-primary/5 text-8xl group-hover:scale-110 transition-transform">block</span>
                    </div>
                </div>

                <!-- Zone Monitors -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    ${zones.map(z => `
                        <div class="bg-surface-container-low p-5 rounded-2xl border-t-4 transition-all hover:shadow-md ${z.riskScore > 70 ? 'border-error' : z.riskScore > 40 ? 'border-tertiary' : 'border-on-secondary-fixed-variant'}">
                            <div class="flex justify-between items-start">
                                <p class="text-[10px] font-bold text-outline uppercase tracking-wider">${z.name}</p>
                                <span class="material-symbols-outlined text-xs ${z.riskScore > 70 ? 'text-error animate-pulse' : 'text-outline'}">${z.riskScore > 70 ? 'warning' : 'info'}</span>
                            </div>
                            <div class="flex justify-between items-end mt-4">
                                <div>
                                    <span class="text-3xl font-headline font-extrabold text-primary">${z.riskScore}</span>
                                    <span class="text-[10px] text-outline font-bold ml-1">INDEX</span>
                                </div>
                                <span class="text-[9px] px-2 py-0.5 rounded font-bold ${z.riskScore > 70 ? 'bg-error/10 text-error' : 'bg-on-secondary-fixed-variant/10 text-on-secondary-fixed-variant'} uppercase">${z.riskScore > 70 ? 'CRITICAL' : 'STABLE'}</span>
                            </div>
                            <div class="w-full h-1 bg-surface-container-high rounded-full mt-3 overflow-hidden">
                                <div class="h-full transition-all duration-1000 ${z.riskScore > 70 ? 'bg-error' : 'bg-on-secondary-fixed-variant'}" style="width: ${z.riskScore}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <!-- Feed Aside -->
                    <aside class="lg:col-span-4 space-y-6">
                        <div class="bg-surface-container-low rounded-2xl p-6 shadow-sm border border-outline-variant/10">
                            <h3 class="font-headline font-bold text-primary flex items-center gap-2 mb-6 uppercase text-xs tracking-widest">
                                <span class="material-symbols-outlined text-sm">sensors</span>
                                ${t('liveActivity')}
                            </h3>
                            <div class="space-y-4">
                                ${incidents.slice(0, 6).map(inc => `
                                    <div class="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-outline-variant/5 group hover:border-primary/20 transition-all cursor-pointer">
                                        <div class="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${inc.intensity === 'High' ? 'bg-error/5 text-error' : 'bg-tertiary/5 text-tertiary'}">
                                            <span class="material-symbols-outlined text-lg">${inc.status === 'Resolved' ? 'done_all' : 'notifications_active'}</span>
                                        </div>
                                        <div>
                                            <p class="text-sm font-bold text-primary">${inc.location}</p>
                                            <p class="text-[11px] text-outline line-clamp-1">${inc.type}: ${inc.details}</p>
                                            <div class="flex items-center gap-2 mt-1">
                                                <span class="text-[9px] font-bold text-outline uppercase">${inc.time}</span>
                                                <span class="w-1 h-1 rounded-full bg-outline/30"></span>
                                                <span class="text-[9px] font-bold ${inc.status === 'Resolved' ? 'text-on-secondary-fixed-variant' : 'text-error'} uppercase">${inc.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </aside>

                    <!-- Main Queue Section -->
                    <section class="lg:col-span-8 space-y-6">
                        <div class="flex items-center justify-between">
                            <h3 class="text-xl font-headline font-bold text-primary">${t('activeIncidentQueue')}</h3>
                            <div class="flex gap-2">
                                <button class="p-2 bg-surface-container-high rounded-lg hover:bg-surface-container-highest transition-colors">
                                    <span class="material-symbols-outlined text-sm">filter_list</span>
                                </button>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 gap-4">
                            ${store.getIncidents().map(inc => `
                                <div class="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/10 border-l-[6px] ${inc.validationStatus === 'discarded' ? 'border-l-outline opacity-60' : inc.intensity === 'High' ? 'border-l-error' : 'border-l-secondary'} transition-all hover:shadow-md">
                                    <div class="flex flex-col md:flex-row justify-between items-start gap-6">
                                        <div class="flex-1 space-y-3">
                                            <div class="flex flex-wrap items-center gap-3">
                                                <span class="${inc.status === 'New' ? 'bg-error text-white' : inc.status === 'In Attention' ? 'bg-tertiary text-white' : 'bg-on-secondary-fixed-variant text-white'} px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm">${inc.status}</span>
                                                <span class="text-[10px] font-bold text-outline bg-surface-container-high px-3 py-1 rounded-full uppercase">${inc.intensity} RISK</span>
                                                ${inc.validationStatus === 'pending' ? `<span class="text-[10px] font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>${t('pendingBadge')}</span>` : inc.validationStatus === 'discarded' ? `<span class="text-[10px] font-bold text-outline bg-outline/10 px-3 py-1 rounded-full uppercase flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">block</span>${t('falseAlarmBadge')}</span>` : `<span class="text-[10px] font-bold text-on-secondary-fixed-variant bg-on-secondary-fixed-variant/10 px-3 py-1 rounded-full uppercase flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">verified</span>${t('verifiedBadge')}</span>`}
                                                <span class="text-[10px] font-medium text-outline bg-surface-container px-3 py-1 rounded-full flex items-center gap-1" title="Community votes">
                                                    <span class="material-symbols-outlined text-[12px]">how_to_vote</span>
                                                    ${inc.confirmations.length} ✓ · ${inc.denials.length} ✗
                                                </span>
                                                ${inc.isAnonymous ? `<span class="text-[10px] font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">incognito</span> ${t('anonymous')}</span>` : ''}
                                            </div>
                                            <div>
                                                <h4 class="text-2xl font-headline font-extrabold text-primary">${inc.type} @ ${inc.location}</h4>
                                                <p class="text-on-surface-variant mt-2 leading-relaxed">${inc.details}</p>
                                            </div>
                                            ${inc.adminNote ? `
                                                <div class="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 relative overflow-hidden">
                                                    <div class="absolute top-0 right-0 p-2 opacity-5">
                                                        <span class="material-symbols-outlined text-4xl">sticky_note_2</span>
                                                    </div>
                                                    <p class="text-xs font-bold text-primary uppercase tracking-tighter mb-1">${t('adminIntelligence')}</p>
                                                    <p class="text-sm text-on-surface-variant italic">"${inc.adminNote}"</p>
                                                </div>
                                            ` : ''}
                                        </div>
                                        <div class="flex md:flex-col gap-2 shrink-0 w-full md:w-auto pt-2">
                                            ${inc.status !== 'Resolved' ? `
                                                <button onclick="window.updateStatus(${inc.id}, 'In Attention')" class="flex-1 md:w-32 py-3 bg-primary text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                                                    <span class="material-symbols-outlined text-sm">play_arrow</span>
                                                    ${t('attend')}
                                                </button>
                                                <button onclick="window.updateStatus(${inc.id}, 'Resolved')" class="flex-1 md:w-32 py-3 border-2 border-primary text-primary rounded-xl text-xs font-bold hover:bg-primary/5 active:scale-95 transition-all flex items-center justify-center gap-2">
                                                    <span class="material-symbols-outlined text-sm">check_circle</span>
                                                    ${t('resolve')}
                                                </button>
                                            ` : `
                                                <button onclick="window.deleteIncident(${inc.id})" class="flex-1 md:w-32 py-3 bg-error text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                                                    <span class="material-symbols-outlined text-sm">delete_forever</span>
                                                    ${t('archive')}
                                                </button>
                                            `}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                </div>
            </main>
        `;
    }
};