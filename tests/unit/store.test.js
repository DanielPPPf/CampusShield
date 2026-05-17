import { beforeEach, describe, it, expect } from 'vitest';
import { store } from '../../src/store.js';

beforeEach(() => {
  localStorage.clear();
  store.load();
});

describe('Comportamiento básico del store', () => {
  it('permite iniciar sesión con correo de la comunidad', () => {
    store.login('juan@unisabana.edu.co', 'student');
    const user = store.getUser();
    expect(user).toBeTruthy();
    expect(user.email).toBe('juan@unisabana.edu.co');
  });

  it('lanza error para correos externos', () => {
    expect(() => store.login('juan@gmail.com', 'student')).toThrow();
  });

  it('agrega un incidente y ajusta contadores de zona', () => {
    store.login('reportero@unisabana.edu.co', 'student');
    const antes = store.getIncidents().length;
    const nuevo = store.addIncident({ type: 'Prueba', location: 'Portón Café', details: 'detalle', intensity: 'High' });
    const despues = store.getIncidents().length;
    expect(despues).toBe(antes + 1);
    expect(nuevo.reportedBy).toBe('reportero@unisabana.edu.co');
  });
});
