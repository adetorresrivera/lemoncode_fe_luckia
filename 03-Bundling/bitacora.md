## 1 · Proyecto desde cero: la página no carga en el DevContainer

### Prompt

"Obligatorio 1 de 03-Bundling/lab.md. Monta el proyecto en
03-Bundling/lab-bundling [...] npm install vite --save-dev [...] Los scripts
start, build y preview tal y como vienen en lab.md. [...] No arranques el
servidor: npm start y npm run preview los pruebo yo."

### Qué me dio

Los scripts tal cual el enunciado (`"start": "vite"`, `"preview": "vite
preview"`) y la afirmación de que **no hacía falta `--host`**: "el reenvío de
puertos de VS Code funciona aunque Vite escuche sólo en localhost".

No era verdad. Vite arrancaba sin errores (`ready in 148 ms`), pero desde el
navegador de mi máquina ni http://localhost:5173 ni http://localhost:4173
cargaban.

### Qué corregí y por qué

- La causa: con Node 17+, `localhost` se resuelve primero a la dirección IPv6
  `::1`, y Vite escuchaba **sólo ahí** (`ss -ltn` → `[::1]:5173`). El
  reenvío de puertos de VS Code entra al contenedor por `127.0.0.1` (IPv4).
  Lo comprobé con `curl` dentro del contenedor: `http://[::1]:4173` → 200 y
  `http://127.0.0.1:4173` → conexión rechazada.
- La solución: `--host` en los scripts de `start` y `preview` (`"start":
  "vite --host"`, `"preview": "vite preview --host"`). Vite pasa a escuchar
  en `0.0.0.0`, todas las interfaces del contenedor, y `127.0.0.1:5173`
  responde 200. Sólo afecta a los servidores de desarrollo y de preview; el
  build no levanta servidor.

<!-- Pendiente: el enunciado pide al menos 3 casos. Añadir los de los
     obligatorios 2 a 6 a medida que salgan. -->
