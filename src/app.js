import { store } from './store.js';
import { views } from './views.js';

const appRoot = document.getElementById('app-root');

// ── Custom Modal System ───────────────────────────────────────────────────────

const modalOverlay = document.getElementById('modal-overlay');
const modalCard    = document.getElementById('modal-card');
const modalTitle   = document.getElementById('modal-title');
const modalBody    = document.getElementById('modal-body');
const modalInput   = document.getElementById('modal-input');
const modalActions = document.getElementById('modal-actions');
const modalIconWrap = document.getElementById('modal-icon-wrap');

let modalResolve = null;

function openModal({ icon, iconBg, title, body, actions, withInput, inputPlaceholder }) {
    // Icon
    if (icon) {
        modalIconWrap.className = `w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${iconBg || 'bg-secondary/10'}`;
        modalIconWrap.innerHTML = `<span class="material-symbols-outlined text-2xl" style="font-variation-settings:'FILL' 1;color:inherit">${icon}</span>`;
        modalIconWrap.style.color = '';
        modalIconWrap.classList.remove('hidden');
    } else {
        modalIconWrap.classList.add('hidden');
    }

    modalTitle.textContent = title || '';
    modalBody.textContent  = body  || '';

    if (withInput) {
        modalInput.classList.remove('hidden');
        modalInput.value = inputPlaceholder || '';
        modalInput.placeholder = inputPlaceholder || '';
        setTimeout(() => modalInput.focus(), 100);
    } else {
        modalInput.classList.add('hidden');
    }

    // Build action buttons
    modalActions.innerHTML = '';
    (actions || []).forEach(({ label, value, style }) => {
        const btn = document.createElement('button');
        btn.className = style === 'primary'
            ? 'flex-1 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold rounded-xl text-sm active:scale-95 transition-transform shadow-sm'
            : style === 'danger'
            ? 'flex-1 py-3 border-2 border-error/40 text-error font-headline font-bold rounded-xl text-sm active:scale-95 transition-transform hover:bg-error/5'
            : 'flex-1 py-3 bg-surface-container text-on-surface font-headline font-bold rounded-xl text-sm active:scale-95 transition-transform';
        btn.textContent = label;
        btn.addEventListener('click', () => {
            closeModal();
            if (modalResolve) {
                modalResolve(value === '__input__' ? modalInput.value : value);
                modalResolve = null;
            }
        });
        modalActions.appendChild(btn);
    });

    modalOverlay.classList.add('open');
}

function closeModal() {
    modalOverlay.classList.remove('open');
}

// Close on backdrop click
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
        if (modalResolve) { modalResolve(null); modalResolve = null; }
    }
});

function showAlert({ icon, iconBg, title, body }) {
    return new Promise(resolve => {
        modalResolve = resolve;
        openModal({
            icon, iconBg, title, body,
            actions: [{ label: 'OK', value: true, style: 'primary' }]
        });
    });
}

function showConfirm({ icon, iconBg, title, body, confirmLabel, cancelLabel, confirmStyle }) {
    return new Promise(resolve => {
        modalResolve = resolve;
        openModal({
            icon, iconBg, title, body,
            actions: [
                { label: cancelLabel  || 'Cancel',  value: false, style: 'neutral' },
                { label: confirmLabel || 'Confirm', value: true,  style: confirmStyle || 'primary' },
            ]
        });
    });
}

function showPrompt({ icon, iconBg, title, body, placeholder, confirmLabel }) {
    return new Promise(resolve => {
        modalResolve = resolve;
        openModal({
            icon, iconBg, title, body,
            withInput: true,
            inputPlaceholder: placeholder || '',
            actions: [
                { label: 'Cancel', value: null,      style: 'neutral' },
                { label: confirmLabel || 'Save', value: '__input__', style: 'primary' },
            ]
        });
    });
}

// ── Notification Toast System ─────────────────────────────────────────────────

function ensureToastContainer() {
    if (!document.getElementById('toast-container')) {
        const el = document.createElement('div');
        el.id = 'toast-container';
        el.className = 'fixed top-20 right-4 z-[200] flex flex-col gap-2 items-end pointer-events-none';
        document.body.appendChild(el);
    }
    return document.getElementById('toast-container');
}

function showToast({ icon, message, sub, type = 'info' }) {
    const container = ensureToastContainer();

    const palette = {
        error:   'bg-error text-white',
        warning: 'bg-[#000a34] text-white',
        success: 'bg-on-secondary-fixed-variant text-white',
        neutral: 'bg-surface-container-highest text-on-surface border border-outline-variant/30',
        info:    'bg-secondary text-white',
    };

    const toast = document.createElement('div');
    toast.className = `
        pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl shadow-xl
        max-w-xs w-full ${palette[type]}
        translate-x-full opacity-0 transition-all duration-300
    `.trim();

    toast.innerHTML = `
        <span class="material-symbols-outlined text-xl shrink-0 mt-0.5" style="font-variation-settings: 'FILL' 1;">${icon}</span>
        <div class="flex-1 min-w-0">
            <p class="text-sm font-bold leading-tight">${message}</p>
            ${sub ? `<p class="text-[11px] opacity-70 mt-0.5 leading-tight">${sub}</p>` : ''}
        </div>
        <button class="shrink-0 opacity-50 hover:opacity-100 transition-opacity self-start mt-0.5" onclick="this.closest('[id]').remove ? this.parentElement.remove() : null">
            <span class="material-symbols-outlined text-base">close</span>
        </button>
    `;

    container.appendChild(toast);

    // Slide in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        });
    });

    // Auto-dismiss after 5 s
    const dismiss = () => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    };
    const timer = setTimeout(dismiss, 5000);
    toast.querySelector('button').addEventListener('click', () => { clearTimeout(timer); dismiss(); });
}

// Snapshot: {id → validationStatus}
let incidentSnapshot = null;

function checkNotifications() {
    const user = store.getUser();
    if (!user) { incidentSnapshot = null; return; }

    const incidents = store.getIncidents();

    if (incidentSnapshot === null) {
        // First tick after login — just baseline, no toasts
        incidentSnapshot = Object.fromEntries(incidents.map(i => [i.id, i.validationStatus]));
        return;
    }

    for (const inc of incidents) {
        const prevStatus = incidentSnapshot[inc.id];

        if (prevStatus === undefined) {
            // Brand-new incident that appeared since last tick
            if (inc.reportedBy !== user.email) {
                showToast({
                    icon: inc.intensity === 'High' ? 'warning' : 'info',
                    message: `${inc.type} — ${inc.location}`,
                    sub: 'New report awaiting community verification',
                    type: inc.intensity === 'High' ? 'error' : 'warning',
                });
            }
        } else if (prevStatus !== inc.validationStatus) {
            // Status changed
            const isOwn = inc.reportedBy === user.email;

            if (inc.validationStatus === 'verified') {
                if (isOwn) {
                    showToast({
                        icon: 'verified',
                        message: 'Your report was confirmed!',
                        sub: `Community verified: ${inc.type} at ${inc.location}`,
                        type: 'success',
                    });
                } else {
                    showToast({
                        icon: 'check_circle',
                        message: `Alert confirmed — ${inc.location}`,
                        sub: `${inc.type} · Risk score ${inc.riskScore ?? ''}`,
                        type: 'warning',
                    });
                }
            } else if (inc.validationStatus === 'discarded') {
                if (isOwn) {
                    showToast({
                        icon: 'block',
                        message: 'Report marked as false alarm',
                        sub: 'Community could not confirm your report.',
                        type: 'neutral',
                    });
                }
            }
        }
    }

    // Refresh snapshot
    incidentSnapshot = Object.fromEntries(incidents.map(i => [i.id, i.validationStatus]));
}

setInterval(checkNotifications, 3000);
ensureToastContainer();

// ── Leaflet Map ───────────────────────────────────────────────────────────────

let leafletMap = null;

function initMap() {
    const container = document.getElementById('campus-map');
    if (!container || typeof L === 'undefined') return;

    // Destroy previous instance if navigating back
    if (leafletMap) {
        leafletMap.remove();
        leafletMap = null;
    }

    const zones = store.getZones();

    // Center on campus centroid
    leafletMap = L.map('campus-map', {
        center: [4.861, -74.034],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(leafletMap);

    zones.forEach(z => {
        const color = z.riskScore > 70 ? '#ba1a1a' : z.riskScore > 40 ? '#636100' : '#18409d';

        // Custom DivIcon — score badge + tail
        const icon = L.divIcon({
            className: '',
            iconAnchor: [22, 50],
            popupAnchor: [0, -54],
            html: `
                <div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.25))">
                    <div style="
                        width:44px;height:44px;border-radius:9999px;
                        background:${color};border:3px solid #fff;
                        display:flex;align-items:center;justify-content:center;
                        font-family:'Manrope',sans-serif;font-weight:800;
                        font-size:13px;color:#fff;
                        ${z.riskScore > 70 ? 'animation:leaflet-pulse 2s infinite;' : ''}
                    ">${z.riskScore}</div>
                    <div style="width:8px;height:8px;border-radius:9999px;background:${color};margin-top:-2px"></div>
                </div>
            `,
        });

        const intensityLabel = z.riskScore > 70 ? 'Alto' : z.riskScore > 40 ? 'Medio' : 'Bajo';
        const intensityEn    = z.riskScore > 70 ? 'High'  : z.riskScore > 40 ? 'Medium' : 'Low';

        const popupHtml = `
            <div style="font-family:'Inter',sans-serif;padding:1rem 1.25rem;min-width:180px">
                <p style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#757682;margin:0 0 2px">Campus Zone</p>
                <h4 style="font-family:'Manrope',sans-serif;font-size:18px;font-weight:800;color:#000a34;margin:0 0 8px">${z.name}</h4>
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                    <span style="display:inline-block;width:8px;height:8px;border-radius:9999px;background:${color}"></span>
                    <span style="font-size:12px;font-weight:700;color:${color}">${intensityEn} Risk</span>
                </div>
                <div style="font-size:11px;color:#454651;line-height:1.6">
                    <div>Density: <b>${z.density}</b></div>
                    <div>Active alerts: <b>${z.alerts}</b></div>
                </div>
                <div style="margin-top:10px;padding-top:10px;border-top:1px solid #e1e2ec;font-size:11px;font-weight:700;color:${color}">
                    Risk Index: ${z.riskScore}/100
                </div>
            </div>
        `;

        L.marker([z.lat, z.lng], { icon })
            .addTo(leafletMap)
            .bindPopup(popupHtml, { maxWidth: 240 });
    });

    // Inject pulse keyframes once
    if (!document.getElementById('leaflet-pulse-style')) {
        const s = document.createElement('style');
        s.id = 'leaflet-pulse-style';
        s.textContent = `
            @keyframes leaflet-pulse {
                0%   { box-shadow: 0 0 0 0 rgba(186,26,26,0.5); }
                70%  { box-shadow: 0 0 0 10px rgba(186,26,26,0); }
                100% { box-shadow: 0 0 0 0 rgba(186,26,26,0); }
            }
        `;
        document.head.appendChild(s);
    }
}

// ── Global handlers for view actions ─────────────────────────────────────────

window.setLang = (lang) => {
    store.setLanguage(lang);
    navigate();
};

window.updateStatus = async (id, status) => {
    const note = await showPrompt({
        icon: 'edit_note',
        iconBg: 'bg-secondary/10',
        title: 'Administrative Note',
        body: 'Add an optional note for this status update.',
        placeholder: 'e.g. Officers dispatched, situation under control…',
        confirmLabel: 'Save & Update',
    });
    if (note === null) return; // cancelled
    store.updateIncidentStatus(id, status, note);
    navigate();
};

window.deleteIncident = async (id) => {
    const confirmed = await showConfirm({
        icon: 'delete_forever',
        iconBg: 'bg-error/10',
        title: 'Delete Incident?',
        body: 'This will permanently remove the incident from all records. This action cannot be undone.',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        confirmStyle: 'danger',
    });
    if (!confirmed) return;
    store.deleteIncident(id);
    navigate();
};

window.validateIncident = (id, vote) => {
    const result = store.validateIncident(id, vote);
    if (result.error === 'own_report') {
        showToast({
            icon: 'block',
            message: 'Cannot validate your own report',
            sub: 'Ask other community members to verify it.',
            type: 'neutral',
        });
        return;
    }
    navigate();
};

function navigate() {
    const hash = window.location.hash || '#login';
    const user = store.getUser();

    // Basic Auth Guard
    if (hash !== '#login' && !user) {
        window.location.hash = '#login';
        return;
    }

    if (hash === '#login' && user) {
        window.location.hash = user.role === 'admin' ? '#admin' : '#dashboard';
        return;
    }

    // Role-based Access Control
    if (hash === '#admin' && user?.role !== 'admin') {
        showAlert({
            icon: 'lock',
            iconBg: 'bg-error/10',
            title: 'Access Denied',
            body: 'Administrative privileges are required to access this panel.',
        }).then(() => { window.location.hash = '#dashboard'; });
        return;
    }

    const viewName = hash.substring(1);
    const render = views[viewName] || views.dashboard;
    appRoot.innerHTML = render();

    // Init Leaflet map after DOM is ready
    if (viewName === 'map') {
        requestAnimationFrame(initMap);
    }

    // Attach view-specific listeners
    attachEventListeners(viewName);

    // Attach global listeners that exist in the header/common parts
    document.getElementById('profile-btn')?.addEventListener('click', () => {
        window.location.hash = '#settings';
    });

    document.getElementById('sos-btn')?.addEventListener('click', async () => {
        const lang = store.getLanguage();
        const confirmed = await showConfirm({
            icon: 'sos',
            iconBg: 'bg-error/10',
            title: lang === 'es' ? 'Enviar Alerta SOS' : 'Send SOS Alert',
            body: lang === 'es'
                ? 'Se notificará a todas las unidades de seguridad cercanas. ¿Confirmar emergencia?'
                : 'This will notify all nearby security units. Confirm emergency?',
            confirmLabel: lang === 'es' ? 'Enviar SOS' : 'Send SOS',
            cancelLabel:  lang === 'es' ? 'Cancelar'   : 'Cancel',
            confirmStyle: 'danger',
        });

        if (!confirmed) return;

        store.addIncident({
            type: 'SOS EMERGENCY',
            details: 'User triggered an emergency SOS panic button.',
            location: 'Ad Portas',
            intensity: 'High'
        });

        showToast({
            icon: 'sos',
            message: lang === 'es' ? 'ALERTA SOS ENVIADA' : 'SOS ALERT SENT',
            sub: lang === 'es' ? 'Mantén la calma, la ayuda va en camino.' : 'Stay calm, help is on the way.',
            type: 'error',
        });

        if (window.location.hash !== '#admin' && window.location.hash !== '#dashboard') {
            window.location.hash = '#dashboard';
        } else {
            navigate();
        }
    });
}

function attachEventListeners(view) {
    if (view === 'login') {
        const form = document.getElementById('login-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            if (!email.endsWith('@unisabana.edu.co')) {
                showToast({
                    icon: 'block',
                    message: 'Acceso restringido',
                    sub: 'Solo cuentas @unisabana.edu.co',
                    type: 'error',
                });
                return;
            }
            const role = email.includes('admin') ? 'admin' : 'student';
            store.login(email, role);
            incidentSnapshot = null; // fresh baseline after login
            window.location.hash = role === 'admin' ? '#admin' : '#dashboard';
        });
    }

    if (view === 'report') {
        let selectedType = '';
        const typeBtns = document.querySelectorAll('.incident-type-btn');
        const step1 = document.getElementById('report-step-1');
        const step2 = document.getElementById('report-step-2');
        const step3 = document.getElementById('report-step-3');
        const counter = document.getElementById('step-counter');
        const bar2 = document.getElementById('step-bar-2');
        const bar3 = document.getElementById('step-bar-3');
        const lang = store.getLanguage();

        typeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                selectedType = btn.dataset.type;
                step1.classList.add('hidden');
                step2.classList.remove('hidden');
                counter.textContent = lang === 'es' ? 'Paso 2 de 3' : 'Step 2 of 3';
                bar2.classList.replace('bg-surface-container-highest', 'bg-secondary');
            });
        });

        document.getElementById('next-to-step-3').addEventListener('click', () => {
            step2.classList.add('hidden');
            step3.classList.remove('hidden');
            counter.textContent = lang === 'es' ? 'Paso 3 de 3' : 'Step 3 of 3';
            bar3.classList.replace('bg-surface-container-highest', 'bg-secondary');
        });

        // Go Back Logic
        document.getElementById('back-to-step-1')?.addEventListener('click', () => {
            step2.classList.add('hidden');
            step1.classList.remove('hidden');
            counter.textContent = lang === 'es' ? 'Paso 1 de 3' : 'Step 1 of 3';
            bar2.classList.replace('bg-secondary', 'bg-surface-container-highest');
        });

        document.getElementById('back-to-step-2')?.addEventListener('click', () => {
            step3.classList.add('hidden');
            step2.classList.remove('hidden');
            counter.textContent = lang === 'es' ? 'Paso 2 de 3' : 'Step 2 of 3';
            bar3.classList.replace('bg-secondary', 'bg-surface-container-highest');
        });

        document.getElementById('submit-report-btn').addEventListener('click', () => {
            const details = document.getElementById('incident-details').value;
            const isAnonymous = document.getElementById('anonymous-mode').checked;

            store.addIncident({
                type: selectedType,
                details: details || 'No additional details provided.',
                location: 'Ad Portas',
                intensity: selectedType === 'Theft/Robbery' ? 'High' : 'Medium',
                isAnonymous
            });

            showToast({
                icon: 'check_circle',
                message: lang === 'es' ? 'Reporte enviado con éxito' : 'Report submitted!',
                sub: lang === 'es' ? 'La comunidad podrá verificarlo pronto.' : 'Community will verify it shortly.',
                type: 'success',
            });
            window.location.hash = '#dashboard';
        });
    }

    if (view === 'settings') {
        document.getElementById('lang-select').addEventListener('change', (e) => {
            store.setLanguage(e.target.value);
            navigate();
        });

        document.getElementById('radius-select').addEventListener('change', (e) => {
            store.updateSettings({ alertRadius: e.target.value });
        });

        document.getElementById('toggle-notifications').addEventListener('click', () => {
            const current = store.getSettings().notifications;
            store.updateSettings({ notifications: !current });
            navigate();
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            incidentSnapshot = null;
            store.logout();
            window.location.hash = '#login';
        });
    }

    if (view === 'admin') {
        document.getElementById('admin-logout')?.addEventListener('click', () => {
            incidentSnapshot = null;
            store.logout();
            window.location.hash = '#login';
        });

        document.getElementById('export-btn')?.addEventListener('click', () => {
            showToast({
                icon: 'picture_as_pdf',
                message: 'Generating report…',
                sub: 'PDF/Excel will be sent to admin@unisabana.edu.co',
                type: 'info',
            });
            setTimeout(() => {
                showToast({
                    icon: 'check_circle',
                    message: 'Report ready!',
                    sub: 'Sent to admin@unisabana.edu.co',
                    type: 'success',
                });
            }, 2500);
        });
    }
}

window.addEventListener('hashchange', navigate);
window.addEventListener('load', navigate);
