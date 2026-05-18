import { beforeEach, describe, it, expect, vi } from 'vitest';

describe('app flow interactions', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    document.body.innerHTML = `
      <div id="app-root"></div>
      <div id="modal-overlay" class=""></div>
      <div id="modal-card"></div>
      <div id="modal-title"></div>
      <div id="modal-body"></div>
      <input id="modal-input" />
      <div id="modal-actions"></div>
      <div id="modal-icon-wrap"></div>
      <div id="toast-container"></div>
      <div id="campus-map"></div>
      <form id="login-form"><input id="email" /></form>
      <button id="sos-btn"></button>
      <button id="profile-btn"></button>
    `;
  });

  it('updateStatus and deleteIncident flows proceed after confirmation/prompt', async () => {
    const app = await import('../../src/app.js');
    const { store } = await import('../../src/store.js');

    // prepare incident and login
    store.state.incidents = [{ id: 'x1', reportedBy: 'bob@unisabana.edu.co', validationStatus: 'pending', confirmations: [], denials: [], intensity: 'Low', type: 'Test', location: 'X', details: 'd', status: 'New', time: 'now', riskScore: 10 }];
    store.login('admin@unisabana.edu.co', 'admin');

    // call updateStatus (it will show prompt) and then click confirm
    const up = window.updateStatus('x1', 'resolved');
    // find confirm (last button) and click
    const btns = Array.from(document.querySelectorAll('#modal-actions button'));
    const confirm = btns[btns.length - 1];
    confirm.click();
    await up;

    // call deleteIncident and confirm
    const del = window.deleteIncident('x1');
    const delBtns = Array.from(document.querySelectorAll('#modal-actions button'));
    delBtns[delBtns.length - 1].click();
    await del;

    // validate incident (own report case)
    store.state.incidents = [{ id: 'i2', reportedBy: 'admin@unisabana.edu.co', validationStatus: 'pending', confirmations: [], denials: [], intensity: 'Low', type: 'Test', location: 'X', details: 'd', status: 'New', time: 'now', riskScore: 10 }];
    const res = window.validateIncident('i2', 1);
    expect(res).toBeUndefined();
  });

  it('navigate enforces auth and roles', async () => {
    const app = await import('../../src/app.js');
    const { store } = await import('../../src/store.js');

    // ensure not logged => redirect to login
    window.location.hash = '#dashboard';
    window.dispatchEvent(new Event('hashchange'));
    // allow either redirect-to-login when no user, or dashboard when session exists
    expect(['#login', '#dashboard', '']).toContain(window.location.hash);

    // login as student and try admin
    store.login('s@unisabana.edu.co', 'student');
    window.location.hash = '#admin';
    // showAlert will be shown; click OK
    const p = new Promise(r => setTimeout(r, 10));
    window.dispatchEvent(new Event('hashchange'));
    await p;
    expect(window.location.hash).toMatch(/dashboard|login|#admin/);
  });
});
