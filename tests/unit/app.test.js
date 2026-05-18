import { beforeEach, describe, it, expect, vi } from 'vitest';

describe('app UI helpers', () => {
  beforeEach(async () => {
    // Reset module cache so importing re-runs module initialization
    vi.resetModules();
    // Minimal DOM required by app.js
    document.body.innerHTML = `
      <div id="app-root"></div>
      <div id="modal-overlay" class=""></div>
      <div id="modal-card"></div>
      <div id="modal-title"></div>
      <div id="modal-body"></div>
      <input id="modal-input" />
      <div id="modal-actions"></div>
      <div id="modal-icon-wrap"></div>
      <form id="login-form"><input id="email" /></form>
      <div id="campus-map"></div>
      <div id="profile-btn"></div>
    `;
    // ensure modal actions empty
    const ma = document.getElementById('modal-actions');
    if (ma) ma.innerHTML = '';
  });

  it('creates toast container on import', async () => {
    const app = await import('../../src/app.js');
    // ensureToastContainer is invoked on module init
    const el = document.getElementById('toast-container');
    expect(el).toBeTruthy();
  });

  it('showAlert opens modal and resolves on OK', async () => {
    const app = await import('../../src/app.js');
    const p = app.showAlert({ title: 'Hi', body: 'Body' });
    // find the action button and click it
    const btn = document.querySelector('#modal-actions button');
    expect(btn).toBeTruthy();
    btn.click();
    const res = await p;
    expect(res).toBe(true);
    const overlay = document.getElementById('modal-overlay');
    expect(overlay.classList.contains('open')).toBe(false);
  });

  it('showPrompt returns input value when confirmed', async () => {
    const app = await import('../../src/app.js');
    const promise = app.showPrompt({ title: 'P', body: 'B', placeholder: 'x' });
    const input = document.getElementById('modal-input');
    input.value = 'hello';
    // confirm button is last button
    const btns = Array.from(document.querySelectorAll('#modal-actions button'));
    const confirm = btns[btns.length - 1];
    confirm.click();
    const v = await promise;
    expect(v).toBe('hello');
  });

  it('login form submission logs in user', async () => {
    const app = await import('../../src/app.js');
    const email = document.getElementById('email');
    email.value = 'user@unisabana.edu.co';
    const form = document.getElementById('login-form');
    // attach listeners and trigger submit
    app.attachEventListeners('login');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    // small timeout to allow handler to run
    await new Promise(r => setTimeout(r, 20));
    const { store } = await import('../../src/store.js');
    expect(store.getUser()).toBeTruthy();
    expect(window.location.hash).toMatch(/dashboard|admin|login/);
  });
});
