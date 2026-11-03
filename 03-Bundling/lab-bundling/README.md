# Lab 03 · Bundling con Vite

La tienda de _Tueste_ montada con Vite **a mano**, desde un `package.json`
vacío (sin `npm create vite`): Sass, imágenes, TypeScript con comprobación de
tipos, React y variables de entorno.

<!-- TODO (obligatorio 7): este README se completa al final con las
     respuestas, capturas, la salida de npm run build, el checklist y la
     bitácora de IA. -->

## Cómo arrancarlo

### Con DevContainer (recomendado)
1. Abre la raíz del repo en VS Code → *Dev Containers: Reopen in Container*.
2. La primera vez, el contenedor (Node 24) clona el repo en el volumen de
   Docker `lemoncode-fe-luckia` e instala las dependencias de todos los
   laboratorios (`postCreateCommand`).
   Si el contenedor ya existía de antes del lab 3, haz *Dev Containers:
   Rebuild Container* (para pasar a Node 24 y reenviar el puerto 4173) o, como
   mínimo, instala a mano:
   ```bash
   cd 03-Bundling/lab-bundling
   npm install
   ```
3. En la terminal del contenedor:
   ```bash
   cd 03-Bundling/lab-bundling
   npm start
   ```
4. Abre http://localhost:5173. VS Code reenvía los puertos 5173 (desarrollo)
   y 4173 (preview) del contenedor a tu máquina.

### En local (Node 20.19+; recomendado 24)
```bash
cd 03-Bundling/lab-bundling
npm install
npm start
```

### Scripts

| Comando | Qué hace |
|---|---|
| `npm start` | Servidor de desarrollo de Vite en http://localhost:5173: sirve los ficheros sin empaquetar, transformados al vuelo, con HMR. Los errores de tipos salen en la terminal y en una capa encima de la página, pero no impiden que se sirva |
| `npm run build` | Genera la versión de producción en `dist/`: empaquetada, minificada y con hash en los nombres. Si hay errores de tipos, falla y no genera nada |
| `npm run preview` | Sirve la carpeta `dist/` ya construida en http://localhost:4173, para comprobar la versión de producción |

`start` y `preview` llevan `--host`: sin él, Vite sólo escucha en `localhost`,
que con Node 17+ se resuelve a la dirección IPv6 `::1`. El reenvío de puertos
de VS Code entra en el contenedor por `127.0.0.1` (IPv4), así que la página no
cargaba desde el navegador de la máquina anfitriona aunque Vite arrancara sin
errores. Con `--host`, Vite escucha en todas las interfaces del contenedor
(`0.0.0.0`).

`vite-plugin-checker` comprueba los tipos en paralelo mientras trabajas. Si
hay un error, `npm start` arranca igualmente, pero la terminal muestra
`ERROR(TypeScript)` con el fichero, la línea y el trozo de código, y el
navegador pinta una capa con el mismo error encima de la página. Para comprobar
los tipos sin arrancar nada: `npx tsc`.

## Checklist

### Obligatorios
- [x] 1 - Proyecto desde cero
- [x] 2 - Estilos con Sass
- [x] 3 - Imágenes
- [x] 4 - TypeScript con comprobación de tipos
- [x] 5 - React
- [ ] 6 - Variables de entorno
- [ ] 7 - README + bitácora de IA

### Opcionales
- [ ] 1 - Tailwind
- [ ] 2 - Code splitting y análisis del bundle

## 1 - Proyecto desde cero

`package.json` creado con `npm init -y` y limpiado: `"private": true` (npm
no deja publicarlo), `"type": "module"` (Node trata los `.js` como ES
modules), Vite 8.3.5 en `devDependencies` y los tres scripts. Se han quitado
`main`, `description`, `keywords`, `author`, `license` y el script `test`:
sirven para publicar un paquete en npm, y este proyecto es una web privada
cuyo punto de entrada es `index.html`, no un `main`.

### Salida de `npm run build`

```
vite v8.3.5 building client environment for production...
transforming...
✓ 4 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                0.38 kB │ gzip: 0.26 kB
dist/assets/index-Cbd1MwUr.js  0.70 kB │ gzip: 0.42 kB

✓ built in 43ms
```

`dist/index.html` ya no apunta a `/src/index.js`, sino al fichero con hash:

```html
<script type="module" crossorigin src="/assets/index-Cbd1MwUr.js"></script>
```

### Captura: `index.js` responde 304 al recargar con F5

![index.js con 304 Not Modified en la pestaña Network](docs/screenshots/01-304.png)

_Network con `npm start`: al recargar con F5, `index.js` responde 304 Not
Modified porque el navegador manda su ETag y el fichero no ha cambiado._

### Preguntas

**¿Para qué sirve el hash del nombre del fichero en producción? ¿Qué pasaría
sin él cuando subís una versión nueva?**

El hash se calcula a partir del contenido del fichero: si el código cambia,
cambia el nombre (`index-Cbd1MwUr.js` pasa a ser otro). Así el servidor puede
decirle al navegador que guarde esos ficheros en caché para siempre, y cuando
sale una versión nueva el `index.html` apunta a un nombre distinto que el
navegador todavía no tiene y descarga. Sin hash, el fichero se seguiría
llamando `index.js`: los usuarios que lo tuvieran en caché seguirían usando la
versión antigua hasta que caducara la caché o forzaran la recarga.

**¿Qué diferencia hay entre `npm start` y `npm run preview`? ¿Cuál usaríais
para comprobar que la versión de producción funciona?**

`npm start` arranca el servidor de desarrollo: no empaqueta, transforma cada
fichero cuando el navegador lo pide.
`npm run preview` no transforma nada: sirve tal cual la carpeta `dist` que ha
generado `npm run build`, empaquetada y minificada.

## 2 - Estilos con Sass

Se ha instalado sólo `sass-embedded` como `devDependency`
(`npm install -D sass-embedded`), que es justo lo que pedía el error de Vite
al importar `main.scss` sin compilador: `Preprocessor dependency
"sass-embedded" not found. Did you install it? Try npm install -D
sass-embedded`. Vite ya trae el soporte de `.scss` y sólo necesita el
compilador; `sass-embedded` es el compilador oficial de Dart Sass y es el que
Vite prefiere, así que ni `sass`, ni `node-sass` (obsoleto) ni loaders.

Las variables viven en `src/styles/_variables.scss` y `main.scss` las carga
con `@use "variables" as *;` (`@import` está obsoleto en Sass).

### Salida de `npm run build`

```
vite v8.3.5 building client environment for production...
transforming...
✓ 5 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                 0.57 kB │ gzip: 0.35 kB
dist/assets/index-B-6UkqOc.css  0.30 kB │ gzip: 0.20 kB
dist/assets/index-DKo7hhUa.js   0.70 kB │ gzip: 0.42 kB

✓ built in 207ms
```

`dist/index.html` enlaza el CSS generado, ya sin variables de Sass
(`$tueste-900` es ahora `#2e1a10`):

```html
<link rel="stylesheet" crossorigin href="/assets/index-B-6UkqOc.css">
```

### Pregunta

**¿Por qué en desarrollo el CSS llega como un módulo de JavaScript y en
producción como un fichero `.css`?**

En desarrollo, Vite compila el `.scss` y lo devuelve envuelto en un módulo JS
que llama a `updateStyle()` para meter el CSS en un `<style>` del `<head>` y
acepta su propio HMR (`import.meta.hot.accept()`): al guardar, sólo se vuelve
a pedir ese módulo y se sustituye el `<style>`, sin recargar la página ni
volver a ejecutar `index.js`. <!-- REVISAR: el navegador no puede hacer
`import` de un .css, por eso hace falta envolverlo en JS --> En producción no
hay HMR que mantener, así que Vite extrae el CSS a un fichero `.css` con hash
y lo enlaza con un `<link>` en el `index.html`: el navegador lo descarga en
paralelo con el JS, lo puede cachear por separado y la página no espera a que
se ejecute ningún script para tener estilos. <!-- REVISAR: lo del parpadeo
sin estilos (FOUC) si el CSS dependiera del JS -->

## 3 - Imágenes

Dos imágenes en `src/assets/`, sin instalar nada ni tocar la configuración:
Vite ya sabe tratar imágenes.

- `logo.svg` (629 B): el icono `coffee` de [Lucide](https://lucide.dev)
  (licencia ISC, indicada en un comentario del propio SVG), con el trazo en
  `#9a5b33` (`$tueste-500`) en vez de `currentColor`: un SVG cargado con
  `<img>` es un documento aparte y no hereda el `color` del CSS de la página.
  Va en la cabecera del `index.html` con
  `<img src="/src/assets/logo.svg" alt="Tueste" />`.
- `coffee.jpg` (268 KB): se importa desde `src/index.js`. El `import`
  devuelve un texto, la URL de la imagen, y con él se crea el `<img>`:

```js
import coffeePhoto from "./assets/coffee.jpg";

console.log(coffeePhoto);
// en desarrollo → "/src/assets/coffee.jpg"
// en producción → "/assets/coffee-CVLsT1_e.jpg"
```

### Salida de `npm run build`

```
vite v8.3.5 building client environment for production...
transforming...
✓ 6 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                    1.39 kB │ gzip: 0.75 kB
dist/assets/coffee-CVLsT1_e.jpg  274.53 kB
dist/assets/index-BeDCDn6j.css     0.21 kB │ gzip: 0.16 kB
dist/assets/index-D9HIMtZe.js      0.84 kB │ gzip: 0.48 kB

✓ built in 159ms
```

La foto sale como fichero con hash; el logo no aparece en `dist/assets`. En
`dist/index.html`, el `src` del `<img>` es ahora el propio SVG:

```html
<img class="brand-header__logo" src="data:image/svg+xml,%3c!--%20Icono%20'coffee'%20de%20Lucide%20(lucide-static%20v1.67.0)%20-…
```

![Network con el iniciador de cada imagen](docs/screenshots/03-network-imagenes.png)

_Network con `npm start`, filtro Img: `coffee.jpg` la pide `index.js` (la
crea el JavaScript) y `logo.svg` la pide `(index)`, el propio HTML._


### Pregunta

**¿Dónde ha ido a parar el logo y por qué Vite lo trata distinto que la
foto? ¿Qué ganamos y qué perdemos con eso?**

El logo está dentro de `dist/index.html`, incrustado como *data URI* en el
`src` del `<img>`. Lo decide
[`build.assetsInlineLimit`](https://vite.dev/config/build-options#build-assetsinlinelimit):
los assets importados o referenciados que pesan menos de ese límite se
incrustan en el fichero que los usa en vez de salir como fichero aparte. En
Vite 8 vale `4096` (4 KiB) por defecto; el logo pesa 629 B y se incrusta, la
foto pesa 268 KB y sale como `coffee-<hash>.jpg`. Los SVG no se pasan a
base64 (aunque la documentación diga *base64 URLs*): Vite los mete como texto
escapando sólo algunos caracteres (`%3c`, `%20`…), que ocupa menos.

- **Ganamos**: una petición HTTP menos, y el logo llega con el HTML, sin
  esperar a otra descarga ni ver un hueco mientras carga.
- **Perdemos**: el logo no se cachea por separado y vuelve a viajar con cada
  descarga del HTML (y en cada página que lo use); cualquier cambio en el logo
  invalida el fichero que lo contiene, y el HTML es más difícil de leer. En
  base64, además, ocuparía alrededor de un 33 % más. Por eso el límite es
  pequeño: sólo compensa con ficheros diminutos.

## 4 - TypeScript con comprobación de tipos

`typescript` (7.0.2) en `devDependencies` aporta el compilador que comprueban
el editor y `npx tsc`. Vite no lo usa para transformar: quita los tipos con
Oxc. `vite-plugin-checker` (0.14.5) ejecuta ese mismo `tsc` dentro de Vite,
tanto en `npm start` como en `npm run build`. Por eso el script de build sigue
siendo `vite build` y no `tsc && vite build`: sería comprobar los tipos dos
veces y, en desarrollo, `tsc &&` no avisaría de nada.

- `tsconfig.json`: el del enunciado. `noEmit` (tsc sólo comprueba, el JS lo
  genera Vite), `isolatedModules` y `moduleResolution: "bundler"`.
- `src/vite-env.d.ts` con `/// <reference types="vite/client" />`: le dice
  a TypeScript qué devuelve importar un `.jpg` (un `string` con la URL) o un
  `.scss`. Sin él, `npx tsc` daba `TS2882` en `main.scss` y `TS2307` en
  `coffee.jpg`.
- `vite.config.ts` con `checker({ typescript: true })`. `vite-plugin-checker`
  declara `typescript: "*"` en sus `peerDependencies` y `vite: ">=5.4.21"`, y
  funciona con TypeScript 7 y Vite 8.3.5.

Con `const total: string = 3;` en `src/index.ts` y sin el checker, `npm start`
no se queja ni en la terminal ni en el navegador (la consola muestra `3`). Sólo
lo marca el editor.

### Salida de `npm run build` con el error puesto

```
> lab-bundling@1.0.0 build
> vite build

vite v8.3.5 building client environment for production...
transforming...
src/index.ts(14,7): error TS2322: Type 'number' is not assignable to type 'string'.
```

Termina con código de salida 1.

### Salida de `npm run build` sin el error

```
vite v8.3.5 building client environment for production...
transforming...
✓ 6 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                    1.39 kB │ gzip: 0.75 kB
dist/assets/coffee-CVLsT1_e.jpg  274.53 kB
dist/assets/index-BeDCDn6j.css     0.21 kB │ gzip: 0.16 kB
dist/assets/index-D9HIMtZe.js      0.84 kB │ gzip: 0.48 kB

✓ built in 198ms
```

### Pregunta

**¿Por qué Vite, por sí solo, no comprueba los tipos? ¿Qué gana con ello?**

Vite transforma cada `.ts` con Oxc, que sólo borra las anotaciones de tipos
fichero a fichero, sin leer los demás ficheros ni saber de qué tipo es nada.
`isolatedModules` garantiza que eso siempre se puede hacer sin cambiar el
significado del código. <!-- REVISAR: por qué hace falta isolatedModules
(p. ej. re-exportar un tipo sin `export type`) --> Gana velocidad: cada
fichero se transforma en milisegundos cuando el navegador lo pide, y el
arranque y el HMR no dependen del tamaño del proyecto. Comprobar los tipos
obliga a analizar el proyecto entero, así que ese trabajo se deja al editor,
a `tsc` o a `vite-plugin-checker`, que lo hace aparte sin bloquear la
transformación. <!-- REVISAR: el checker corre en un worker thread, aparte
del servidor -->

## 5 - React

`react` y `react-dom` (19.3.1) van en `dependencies` porque se ejecutan en el
navegador y acaban dentro del JS del build. `@types/react`, `@types/react-dom`
y `@vitejs/plugin-react` (6.2.1) van en `devDependencies`: los tipos sólo los
usan el editor y `tsc`, y el plugin sólo actúa mientras Vite transforma; nada
de ellos llega al JS que se descarga.

- `tsconfig.json`: `"jsx": "react-jsx"` (runtime automático: el JSX pasa a
  llamadas a `jsx()` de `react/jsx-runtime`, sin `import React`) y
  `"verbatimModuleSyntax": true` (los imports que sólo traen tipos se marcan
  con `type`, como `type Coffee` en `app.tsx`, porque Oxc transforma fichero a
  fichero y no sabe si `Coffee` es un tipo o un valor).
- `index.html`: `<div id="root"></div>` debajo de la cabecera y el `<script>`
  a `/src/index.tsx`.
- `src/index.ts` → `src/index.tsx`, más `src/data.ts` y `src/app.tsx` del
  enunciado. Desaparecen los dos `console.log` y la foto creada con
  `createElement`: ahora la pinta `App`.
- `vite.config.ts`: `plugins: [react(), checker({ typescript: true })]`.
  `@vitejs/plugin-react` 6 pide `vite: ^8.0.0`; sus otras `peerDependencies`
  (Babel, React Compiler) son opcionales y no se instalan.

### El carrito, antes y después de `@vitejs/plugin-react`

<!-- REVISAR: confirmar en el navegador que es lo que viste -->
- **Sin el plugin**: el JSX funciona (Oxc lo transforma de serie), pero al
  añadir 3 bolsas y cambiar el `<h2>`, la terminal muestra `page reload
  src/app.tsx`, la página se recarga entera y el carrito vuelve a 0.
- **Con el plugin**: el título cambia sin recargar y el carrito sigue con sus
  3 bolsas. En Network aparece `@react-refresh` y `app.tsx` llega con llamadas
  a `$RefreshReg$` e `import.meta.hot.accept`.

### Salida de `npm run build`

```
vite v8.3.5 building client environment for production...
transforming...
✓ 18 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                    1.41 kB │ gzip:  0.76 kB
dist/assets/coffee-CVLsT1_e.jpg  274.53 kB
dist/assets/index-BeDCDn6j.css     0.21 kB │ gzip:  0.16 kB
dist/assets/index-BXu9FbnC.js    220.11 kB │ gzip: 68.91 kB

✓ built in 470ms
```

El JS pasa de 0,84 kB a 220 kB: React va dentro del bundle. La salida es la
misma con y sin el plugin, porque Fast Refresh sólo existe en desarrollo.

### Captura: `Cache-Control` de una dependencia pre-empaquetada

![react.js servido desde /node_modules/.vite/deps/ con Cache-Control immutable](docs/screenshots/05-cache-control.png)

_Network con `npm start` (Disable cache desmarcado), tras pulsar F5:
`react.js?v=e99a8634` viene de `/node_modules/.vite/deps/`, responde `200 OK
(from disk cache)` sin llegar al servidor, y su cabecera es `Cache-Control:
max-age=31536000,immutable` (un año). `app.tsx`, en cambio, llega con
`Cache-Control: no-cache` y responde 304._

### Preguntas

**¿Por qué Vite trata distinto a `react` (dependencia) y a `app.tsx`
(vuestro código)? ¿Qué es el pre-bundling y qué problema resuelve?**

Al arrancar, Vite empaqueta con Rolldown cada dependencia de `node_modules`
en un único módulo ES dentro de `node_modules/.vite/deps/`: eso es el
pre-bundling. Resuelve dos problemas: React se publica en CommonJS, que el
navegador no sabe importar, y algunos paquetes están partidos en decenas de
ficheros que serían decenas de peticiones. <!-- REVISAR: CommonJS → ESM y
"cascada" de peticiones --> Como las dependencias no cambian mientras
programas, Vite les pone `?v=<hash>` y `immutable` y el navegador no vuelve a
pedirlas; tu código sí cambia, así que lo sirve con `no-cache` y el navegador
pregunta cada vez (304 si no ha cambiado).

**¿Qué aporta exactamente `@vitejs/plugin-react` si el JSX ya funcionaba sin
él?**

Fast Refresh: cuando guardas un componente, el plugin sustituye sólo ese
componente en la página y React conserva su estado (`useState`), en vez de
recargarla entera. Por eso el carrito mantiene las 3 bolsas. Sólo actúa en
desarrollo: el build no cambia. <!-- REVISAR: si cambias el orden o el número
de hooks, Fast Refresh sí reinicia el estado -->

## Bitácora de IA

Herramienta: **Claude Code** (extensión de VS Code), dentro del DevContainer,
con las reglas del lab en `CLAUDE.md`: Vite 8 (Rolldown + Oxc), nada de
`npm create vite`, `@use` en Sass, sólo `sass-embedded`, `import.meta.env.VITE_X`
y cada dependencia justificada.

La bitácora completa, con el prompt, lo que me dio y lo que corregí en cada
caso, está en [`../bitacora.md`](../bitacora.md):

- **1 · Proyecto desde cero**: me dijo que en el DevContainer no hacía falta
  `--host`. Vite escuchaba sólo en `::1` (IPv6) y el reenvío de VS Code llega
  por `127.0.0.1`, así que la página no cargaba. Lo arreglé con `--host` en
  los scripts de `start` y `preview`.
