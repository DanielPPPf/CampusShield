# Testing & QA - CampusShield

Este archivo resume lo que se hizo para dejar la parte de calidad un poco más seria y ordenada. No tiene mucha ciencia, pero sí quedó todo lo necesario para probar la app sin depender de hacerlo a mano cada vez.

## Qué se hizo

1. **Pruebas unitarias**
	- Se agregó un archivo de pruebas para validar la lógica del `store`.
	- Ahí se revisa que el login funcione con correos de `@unisabana.edu.co`, que no deje entrar correos externos y que al crear un incidente se actualicen los datos básicos.

2. **Pruebas de interfaz (E2E)**
	- Se dejó una prueba con Playwright para abrir la app, llenar el login y comprobar que entra al dashboard.
	- También se creó una config para que Playwright no se meta a ejecutar los tests unitarios por accidente.

3. **Prueba de carga**
	- Se armó un script con `k6` para pegarle a la app local y revisar que aguante tráfico simulado sin caerse.
	- El script quedó con un par de umbrales simples para ver tiempo de respuesta y fallos.

4. **Servidor local para pruebas**
	- Se agregó un servidor estático chiquito para que Playwright y `k6` puedan abrir la app desde `localhost` sin montar un backend raro.

## Archivos que quedaron

- `package.json`
- `vitest.config.js`
- `playwright.config.js`
- `scripts/serve-static.mjs`
- `tests/unit/store.test.js`
- `e2e/tests/login.spec.mjs`
- `tests/load/dashboard.js`

## Cómo correrlo

Desde la carpeta `CampusShield`:

```bash
npm install
```

```bash
npm test
```

```bash
npm run playwright:install
npm run e2e
```

```bash
npm run load
```

## Resultados verificados (estado actual)

- **Unit tests:** `npm test` pasó correctamente — 11 pruebas en total (todas verdes).
- **E2E:** `npm run e2e` pasó y confirmó que el flujo de login llega al dashboard.
- **Carga:** `k6` pasó en el entorno local con los umbrales configurados (p95 baja, sin fallos).
- **Cobertura:** `npm run test:coverage` se ejecutó y la cobertura global actual es **63.82%** (detalle en la carpeta `coverage/`).

Nota: la cobertura quedó por debajo del objetivo objetivo del 85%. Si quieres, puedo seguir añadiendo pruebas unitarias dirigidas a los archivos con baja cobertura para elevar ese porcentaje.

## Comentarios normales de implementación

- Al principio Playwright estaba agarrando archivos que no tocaban, entonces se ajustó la configuración para que solo mire `e2e/tests`.
- También se tuvo que poner el servidor local por fuera, porque si no la prueba de carga quedaba muy amarrada a la terminal donde se ejecutaba.
- En Windows, algunas terminales no toman el `PATH` nuevo de inmediato, así que en un par de casos hubo que abrir una terminal nueva.

## Conclusión

Se dejó todo listo para subir al repositorio: tests unitarios, E2E y de carga funcionan localmente y los scripts están en `package.json`. Falta trabajo si queremos alcanzar la cobertura >= 85% — puedo encargarme de eso ahora mismo si confirmas.

## Comandos rápidos para push (sugerido)

```bash
# crear rama de trabajo
git checkout -b qa-setup

# añadir cambios y commitear
git add .
git commit -m "qa: setup tests, e2e, load scripts and coverage adapter"

# (opcional) subir la rama al remoto
git push -u origin qa-setup
```
