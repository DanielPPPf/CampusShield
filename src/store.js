const VALIDATION_THRESHOLD = 2;

const INITIAL_INCIDENTS = [
    {
        id: 1,
        type: 'Suspicious Activity',
        location: 'Puente Madera',
        details: 'Reported near Campus North Exit. Officers dispatched for verification.',
        time: '2 mins ago',
        intensity: 'High',
        status: 'New',
        riskScore: 85,
        adminNote: '',
        validationStatus: 'verified',
        confirmations: ['system@unisabana.edu.co', 'security@unisabana.edu.co'],
        denials: [],
        reportedBy: 'system@unisabana.edu.co'
    },
    {
        id: 2,
        type: 'Maintenance',
        location: 'Portón Café',
        details: 'Pathway lights undergoing repair. Use alternative walkway after 6 PM.',
        time: '15 mins ago',
        intensity: 'Information',
        status: 'Resolved',
        riskScore: 12,
        adminNote: 'Maintenance team scheduled for tomorrow.',
        validationStatus: 'verified',
        confirmations: ['system@unisabana.edu.co', 'security@unisabana.edu.co'],
        denials: [],
        reportedBy: 'system@unisabana.edu.co'
    }
];

const INITIAL_ZONES = [
    { id: 'ad-portas',     name: 'Ad Portas',    riskScore: 58, density: 'High',   alerts: 4, lat: 4.863640, lng: -74.031723 },
    { id: 'porton-cafe',   name: 'Portón Café',  riskScore: 15, density: 'Low',    alerts: 0, lat: 4.863549, lng: -74.037457 },
    { id: 'puente-madera', name: 'Puente Madera', riskScore: 82, density: 'Medium', alerts: 1, lat: 4.858675, lng: -74.031506 },
];

class Store {
    constructor() {
        this.load();
    }

    load() {
        const defaults = {
            user: null,
            incidents: INITIAL_INCIDENTS,
            zones: INITIAL_ZONES,
            lang: 'es',
            settings: {
                alertRadius: '500m',
                notifications: true
            }
        };
        const saved = JSON.parse(localStorage.getItem('campus_shield_data')) || {};
        this.state = { ...defaults, ...saved };

        // Ensure nested settings are also merged
        if (saved.settings) {
            this.state.settings = { ...defaults.settings, ...saved.settings };
        }

        // Always rebuild zones from INITIAL_ZONES so removed zones don't persist,
        // but carry over saved riskScore/alerts if the zone still exists.
        const savedZoneMap = Object.fromEntries((saved.zones || []).map(z => [z.id, z]));
        this.state.zones = INITIAL_ZONES.map(z => ({
            ...z,
            ...(savedZoneMap[z.id]
                ? { riskScore: savedZoneMap[z.id].riskScore, alerts: savedZoneMap[z.id].alerts }
                : {})
        }));

        // Migrate existing incidents that predate the validation system
        this.state.incidents = this.state.incidents.map(inc => ({
            validationStatus: 'verified',
            confirmations: [],
            denials: [],
            reportedBy: 'system@unisabana.edu.co',
            ...inc
        }));

        this.save();
    }

    save() {
        localStorage.setItem('campus_shield_data', JSON.stringify(this.state));
    }

    login(email, role) {
        if (!email.endsWith('@unisabana.edu.co')) {
            throw new Error('Access restricted to UniSabana community.');
        }
        this.state.user = { email, role, name: email.split('@')[0] };
        this.save();
    }

    logout() {
        this.state.user = null;
        this.save();
    }

    setLanguage(lang) {
        this.state.lang = lang;
        this.save();
    }

    getLanguage() {
        return this.state.lang || 'es';
    }

    updateSettings(settings) {
        this.state.settings = { ...this.state.settings, ...settings };
        this.save();
    }

    addIncident(incident) {
        const newIncident = {
            id: Date.now(),
            ...incident,
            time: 'Just now',
            status: 'New',
            adminNote: '',
            validationStatus: 'pending',
            confirmations: [],
            denials: [],
            reportedBy: this.state.user?.email || 'anonymous'
        };
        this.state.incidents.unshift(newIncident);

        // Tentatively update zone risk — reversed if incident is later discarded
        const zone = this.state.zones.find(z => z.name === incident.location);
        if (zone) {
            zone.alerts += 1;
            zone.riskScore = Math.min(100, zone.riskScore + (incident.intensity === 'High' ? 15 : 5));
        }

        this.save();
        return newIncident;
    }

    validateIncident(id, vote) {
        const userEmail = this.state.user?.email;
        if (!userEmail) return { error: 'not_logged_in' };

        const inc = this.state.incidents.find(i => i.id === id);
        if (!inc || inc.validationStatus !== 'pending') return { error: 'not_found' };
        if (inc.reportedBy === userEmail) return { error: 'own_report' };
        if (inc.confirmations.includes(userEmail) || inc.denials.includes(userEmail)) {
            return { error: 'already_voted' };
        }

        if (vote === 'confirm') {
            inc.confirmations.push(userEmail);
            if (inc.confirmations.length >= VALIDATION_THRESHOLD) {
                inc.validationStatus = 'verified';
            }
        } else if (vote === 'deny') {
            inc.denials.push(userEmail);
            if (inc.denials.length >= VALIDATION_THRESHOLD) {
                inc.validationStatus = 'discarded';
                // Reverse the zone risk contribution from this false alarm
                const zone = this.state.zones.find(z => z.name === inc.location);
                if (zone) {
                    zone.alerts = Math.max(0, zone.alerts - 1);
                    zone.riskScore = Math.max(0, zone.riskScore - (inc.intensity === 'High' ? 15 : 5));
                }
            }
        }

        this.save();
        return { success: true, validationStatus: inc.validationStatus };
    }

    getPendingValidationForUser() {
        const userEmail = this.state.user?.email;
        if (!userEmail) return [];
        return this.state.incidents.filter(inc =>
            inc.validationStatus === 'pending' &&
            inc.reportedBy !== userEmail &&
            !inc.confirmations.includes(userEmail) &&
            !inc.denials.includes(userEmail)
        );
    }

    updateIncidentStatus(id, status, note = '') {
        const inc = this.state.incidents.find(i => i.id === id);
        if (inc) {
            inc.status = status;
            inc.adminNote = note;
            this.save();
        }
    }

    deleteIncident(id) {
        this.state.incidents = this.state.incidents.filter(i => i.id !== id);
        this.save();
    }

    getIncidents() {
        return this.state.incidents;
    }

    getZones() {
        return this.state.zones;
    }

    getUser() {
        return this.state.user;
    }

    getSettings() {
        return this.state.settings;
    }
}

export const store = new Store();