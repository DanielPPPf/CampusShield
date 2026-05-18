import { beforeEach, describe, it, expect } from 'vitest';
import { store } from '../../src/store.js';

beforeEach(() => {
  localStorage.clear();
  store.load();
});

describe('Casos avanzados del store', () => {
  it('validateIncident devuelve not_logged_in cuando no hay usuario', () => {
    const nuevo = store.addIncident({ type: 'Prueba', location: 'Ad Portas', details: 'd', intensity: 'High' });
    const res = store.validateIncident(nuevo.id, 'confirm');
    expect(res.error).toBe('not_logged_in');
  });

  it('no permite votar sobre propio reporte (own_report)', () => {
    store.login('autor@unisabana.edu.co', 'student');
    const nuevo = store.addIncident({ type: 'Prueba', location: 'Ad Portas', details: 'd', intensity: 'High' });
    const res = store.validateIncident(nuevo.id, 'confirm');
    expect(res.error).toBe('own_report');
  });

  it('confirmación marca verified según umbral', () => {
    store.login('autor@unisabana.edu.co', 'student');
    const nuevo = store.addIncident({ type: 'Prueba', location: 'Ad Portas', details: 'd', intensity: 'High' });
    store.logout();
    store.login('votante@unisabana.edu.co', 'student');
    const res = store.validateIncident(nuevo.id, 'confirm');
    expect(res.success).toBe(true);
    expect(res.validationStatus).toBe('verified');
  });

  it('deny puede descartar y revertir impacto en la zona', () => {
    store.login('autor2@unisabana.edu.co', 'student');
    const antesZ = store.getZones().find(z => z.name === 'Portón Café');
    const antesAlerts = antesZ.alerts;
    const antesRisk = antesZ.riskScore;

    const nuevo = store.addIncident({ type: 'Falsa', location: 'Portón Café', details: 'd', intensity: 'High' });
    store.logout();
    store.login('votador@unisabana.edu.co', 'student');
    const res = store.validateIncident(nuevo.id, 'deny');
    expect(res.success).toBe(true);
    // After deny threshold 1, should be discarded
    expect(res.validationStatus).toBe('discarded');

    const despuesZ = store.getZones().find(z => z.name === 'Portón Café');
    expect(despuesZ.alerts).toBe(Math.max(0, antesAlerts));
    expect(despuesZ.riskScore).toBeGreaterThanOrEqual(0);
  });

  it('getPendingValidationForUser devuelve pendientes para otro usuario', () => {
    store.login('autor3@unisabana.edu.co', 'student');
    const nuevo = store.addIncident({ type: 'Prueba', location: 'Ad Portas', details: 'd', intensity: 'Low' });
    store.logout();
    store.login('observador@unisabana.edu.co', 'student');
    const pendientes = store.getPendingValidationForUser();
    expect(pendientes.some(p => p.id === nuevo.id)).toBe(true);
  });

  it('updateSettings y getSettings funcionan', () => {
    const before = store.getSettings();
    store.updateSettings({ notifications: false });
    const after = store.getSettings();
    expect(after.notifications).toBe(false);
    // other settings remain
    expect(after.alertRadius).toBe(before.alertRadius);
  });

  it('setLanguage/getLanguage funcionan', () => {
    store.setLanguage('en');
    expect(store.getLanguage()).toBe('en');
  });

  it('updateIncidentStatus y deleteIncident funcionan', () => {
    store.login('admin@unisabana.edu.co', 'admin');
    const nuevo = store.addIncident({ type: 'Operativo', location: 'Ad Portas', details: 'd', intensity: 'Low' });
    store.updateIncidentStatus(nuevo.id, 'In Attention', 'nota');
    const inc = store.getIncidents().find(i => i.id === nuevo.id);
    expect(inc.status).toBe('In Attention');
    expect(inc.adminNote).toBe('nota');
    store.deleteIncident(nuevo.id);
    expect(store.getIncidents().some(i => i.id === nuevo.id)).toBe(false);
  });
});
