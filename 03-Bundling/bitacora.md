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

## 6 · Variables de entorno: el banner sale también en producción

### Prompt

"Obligatorio 6 de 03-Bundling/lab.md (variables de entorno) [...]
src/env.constants.ts: el único sitio que lee import.meta.env. Exporta
SHOP_NAME, API_BASE y SHOW_OFFERS, este último como boolean de verdad [...]"

### Qué me dio

Un `env.constants.ts` que pasaba `npx tsc` sin errores:

```ts
export const SHOW_OFFERS = Boolean(import.meta.env.VITE_SHOW_OFFERS);
```

con la explicación de que "`Boolean()` convierte la variable en un booleano
sin necesidad de `as`".

En `npm start` todo cuadraba, pero con `npm run build` + `npm run preview`
el título decía "Tueste" y la URL era la de producción... y el banner "Envío
gratis este mes" seguía ahí, aunque `.env.production` tiene
`VITE_SHOW_OFFERS=false`.

### Qué corregí y por qué

- La causa: en un `.env` todo es texto, así que `VITE_SHOW_OFFERS` vale
  `"false"`, no `false`. `Boolean("false")` es `true`, como el de cualquier
  string que no esté vacío. Con `Boolean()` sólo se quitaba el banner
  dejando la variable vacía (`VITE_SHOW_OFFERS=`).
- TypeScript no lo podía detectar: `Boolean(string)` devuelve `boolean`,
  así que el tipo era correcto y lo que fallaba era el valor.
- La solución: comparar con el texto,
  `import.meta.env.VITE_SHOW_OFFERS === "true"`. Sólo `"true"` activa el
  banner; `"false"`, una variable vacía o una errata (`"ture"`) lo dejan
  apagado, que es lo seguro para un flag de ofertas. Tras otro build, el
  banner desaparece de la preview y el texto "Envío gratis" ya no está en
  `dist/assets/index-<hash>.js`.

<!-- Pendiente: el enunciado pide al menos 3 casos. Añadir los de los
     obligatorios 2 a 6 a medida que salgan. -->
