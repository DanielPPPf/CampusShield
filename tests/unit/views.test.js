import { beforeEach, describe, expect, it } from 'vitest';
import { store } from '../../src/store.js';
import { views } from '../../src/views.js';

beforeEach(() => {
  localStorage.clear();
  store.load();
});

describe('Vistas principales', () => {
  it('renderiza la pantalla de login', () => {
    const html = views.login();
    expect(html).toContain('CampusShield');
    expect(html).toContain('login-form');
    expect(html).toContain('Correo Institucional');
  });

  it('renderiza dashboard en español con datos base', () => {
    store.login('juan@unisabana.edu.co', 'student');
    const html = views.dashboard();
    expect(html).toContain('Bienvenido de nuevo');
    expect(html).toContain('Alertas Activas');
    expect(html).toContain('Ad Portas');
  });

  it('incluye validación comunitaria cuando hay incidentes pendientes', () => {
    store.login('juan@unisabana.edu.co', 'student');
    const inc = store.addIncident({
      type: 'Suspicious Person',
      location: 'Portón Café',
      details: 'Persona merodeando cerca de la entrada.',
      intensity: 'Medium'
    });
    inc.reportedBy = 'system@unisabana.edu.co';
    const html = views.dashboard();
    expect(html).toContain('Validación Comunitaria');
    expect(html).toContain('Portón Café');
  });

  it('renderiza el reporte con los tres pasos', () => {
    const html = views.report();
    expect(html).toContain('¿Qué pasó?');
    expect(html).toContain('Contexto Adicional');
    expect(html).toContain('Finaliza tu reporte');
  });

  it('renderiza el mapa y el ranking de zonas', () => {
    const html = views.map();
    expect(html).toContain('Zonas Críticas');
    expect(html).toContain('Ad Portas');
    expect(html).toContain('Puente Madera');
  });

  it('renderiza IA con el resumen de riesgo', () => {
    const html = views.ai();
    expect(html).toContain('IA Insights');
    expect(html).toContain('Planificador de Ruta Segura');
    expect(html).toContain('Ranking de Riesgo por Zona');
  });

  it('renderiza ajustes en ambos idiomas según el estado', () => {
    store.setLanguage('en');
    store.login('juan@unisabana.edu.co', 'student');
    const html = views.settings();
    expect(html).toContain('Settings');
    expect(html).toContain('juan@unisabana.edu.co');
    expect(html).toContain('English');
  });

  it('renderiza panel admin con métricas', () => {
    store.login('admin@unisabana.edu.co', 'admin');
    const html = views.admin();
    expect(html).toContain('Inteligencia Administrativa');
    expect(html).toContain('Total Incidentes');
    expect(html).toContain('Nuevas Solicitudes');
  });
});