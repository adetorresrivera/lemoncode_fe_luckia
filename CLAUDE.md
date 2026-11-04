# Postula · TFM

Gestor de candidaturas de empleo. Los usuarios registran sus candidaturas, las
siguen en una tabla o en un tablero kanban, guardan los contactos de cada
empresa y controlan qué versión de su CV y carta enviaron a cada oferta.

Ahora mismo estoy en el laboratorio 5 del máster (05-API_REST/lab.md): API
REST, en 05-API_REST. Un cliente con fetch (05-API_REST/client) contra el
servidor de hoteles del módulo (05-API_REST/hotels-server).

## Stack (lab 5)
- Servidor: `hotels-server` del módulo (Express + `tsx watch`, datos en
  memoria, puerto 3000, CORS sólo con `USE_CORS=yes`). En los obligatorios NO
  se modifica (arreglarlo es el desafío D1).
- Cliente: `client` de `.start-code`, TypeScript sin framework, Vite.
  `src/hotels.api.ts` con `request<T>` y las cinco funciones (`getHotels`,
  `getHotel`, `createHotel`, `updateHotel`, `deleteHotel`).

## Reglas (lab 5)
- fetch: comprobar siempre `response.ok` y lanzar un error con método, URL y
  estado; no leer JSON en un 204; `Accept: application/json` siempre y
  `Content-Type: application/json` sólo cuando hay cuerpo.
- Las respuestas vienen en `{ data: ... }`: `request<T>` devuelve el `data`.
- Modelo `Hotel` sólo con los campos que usa el front (`id`, `name`, `city`,
  `lowRate`, `highRate`); `NewHotel = Omit<Hotel, "id">`.
- CORS se arregla en el servidor (o con el proxy de Vite en desarrollo),
  nunca con `mode: "no-cors"` ni con extensiones del navegador.
- Un `AbortError` no se muestra como error.
- Peticiones en orden con `for...of` + `await`, nunca `forEach(async …)`.
  Peticiones "para luego" como funciones: `[() => fetch(a), …]`.
- Variables de entorno con `import.meta.env.VITE_X` (lab 3); nada secreto en
  `VITE_`.
- Código TypeScript (heredado del lab 2): nada de `any` ni `enum`, nada de
  `as` para callar errores, tipos con `import type { ... }`.
- Cada dependencia que se instale tiene que hacer falta (axios sólo en P1,
  zod sólo en P5).
- No modificar otros entregables (en particular, P4 tocaría el lab 4: no se
  hace).
- README sin huecos: Claude responde todas las preguntas 📝 con lo que se ha
  comprobado de verdad (curl, build, scripts de medida). Nada de `TODO`.
- Bitácora: cada vez que Claude corrija algo suyo (o el usuario le corrija),
  se añade una entrada a `05-API_REST/bitacora.md` con el formato del
  enunciado (`### Prompt`, `### Qué me dio`, `### Qué corregí y por qué`) y el
  número de prompt de `prompts.md`.

## Lab 4 (cerrado)
React (04-Frameworks/lab-react): el catálogo de cafés de Tueste (lista con
buscador y carrito, detalle, alta y edición). Estas reglas NO aplican al lab 5
salvo lo indicado en "Reglas (lab 5)"; se conservan como referencia.

### Stack (lab 4)
- Copia de la demo `01-de-javascript-a-react/demos/02-react`: Vite 8,
  TypeScript 7 estricto, React 19 y Tailwind 4 (`@tailwindcss/vite`).
- Desde O5: TanStack Router con rutas por archivos (`@tanstack/router-plugin`,
  antes del plugin de React en `vite.config.ts`).
- Desde O6: TanStack Form + Zod 4 (Standard Schema, sin adaptador).
- Datos: `public/coffees.json`; modelo en `src/model.ts` (en O7 pasa a
  `src/core/coffees/model.ts`).

### Reglas (lab 4)
- Componentes como funciones, con las props tipadas. Nada de clases.
- El estado nunca se muta: nada de `push`, `splice` ni `coffee.price = …`;
  spread, `map` y `filter` (`setCart(previous => [...previous, coffee])`).
- Lo que se puede calcular no es estado: total del carrito, número de bolsas
  y lista filtrada se calculan durante el render (nada de useState + useEffect
  para datos derivados).
- Cada `.map` que pinte una lista lleva `key={coffee.id}`, nunca el índice.
- Efectos con limpieza cuando haga falta (`clearInterval`, `controller.abort()`).
- Hooks siempre arriba, antes de cualquier return condicional.
- `useMemo`/`useCallback` sólo si se ha medido un problema.
- Eventos: `onAdd={addToCart}` u `onClick={() => addToCart(coffee)}`, nunca
  `onClick={addToCart(coffee)}`.
- Router: TanStack Router (`createFileRoute`, `Route.useParams()`, `Link`
  tipado). Nada de React Router. `routeTree.gen.ts` no se toca a mano.
- Formularios: TanStack Form acepta el esquema de Zod directamente (nada de
  `@hookform/resolvers` ni `zodValidator`). Cada campo con `<label>` y su
  error. El precio con `event.target.valueAsNumber`.
- Fetch: comprobar `response.ok`; estados `coffees`, `loading` y `error`.
- O7 (pods): cada pod con container + component e `index.ts`; las escenas
  importan sólo de ese index; ningún pod importa a otro; el formulario recibe
  `onSaved` de la escena.
- Dejar `<StrictMode>` en `main.tsx`.
- `npm run build` sin errores. Hasta O4 el script es `tsc --noEmit && vite
  build`; en O5 pasa a `vite build && tsc --noEmit`.
- Cada dependencia que se instale tiene que hacer falta (las de O5 y O6 las
  indica el enunciado).
- Código TypeScript (heredado del lab 2): nada de `any` ni `enum`, nada de
  `as` para callar errores, tipos con `import type { ... }`.

## Lab 3 (cerrado)
Vite montado a mano (03-Bundling/lab-bundling). Estas reglas NO aplican al
lab 4 salvo lo indicado en "Reglas (lab 4)"; se conservan como referencia.

### Stack (lab 3)
- Vite 8 (Rolldown + Oxc; no esbuild ni Rollup).
- Proyecto montado a mano desde un `package.json` vacío.
- Sass con `sass-embedded`, TypeScript, React 19, `vite-plugin-checker`.

### Reglas (lab 3)
- Nada de `npm create vite`: el proyecto se monta a mano.
- Sass: `@use "variables" as *;`, nunca `@import`.
- Sólo `sass-embedded` (ni `sass`, ni `node-sass`, ni loaders): Vite ya sabe
  usarlo.
- Variables de entorno con `import.meta.env.VITE_X`, nunca `process.env`.
- Nada secreto en variables `VITE_`: todo acaba en el JS descargable.
- `/// <reference types="vite/client" />` (no `path=`), en un fichero dentro
  de `src`.
- O `vite-plugin-checker` o `tsc` en el script de build, no los dos.
- Comprobar en la documentación que cada opción existe en Vite 8 (nada de
  opciones de esbuild ni `build.rollupOptions` de Vite 7 o anterior).
- Cada dependencia que se instale tiene que hacer falta: la configuración
  limpia puntúa.
- Código TypeScript (heredado del lab 2): nada de `any` ni `enum`, nada de
  `as` para callar errores, tipos con `import type { ... }` y no mutar el
  estado.

## Pantallas
1. Landing pública (index.html): cabecera, hero, cómo funciona (3 pasos),
   qué puedes hacer (6 tarjetas), planes (Gratis / Pro destacado / Escuelas),
   preguntas frecuentes y pie con newsletter.
2. Panel (app/panel.html): barra lateral + resumen con 4 estadísticas (una
   destacada), próximos pasos, entrevistas por versión de CV, últimas
   candidaturas.
3. Candidaturas en tabla (app/candidaturas.html): filtros + tabla.
4. Candidaturas en kanban (app/kanban.html): 5 columnas por estado
   (Guardada, Enviada, Entrevista, Oferta, Descartada).
   Tabla y kanban se enlazan con un selector de dos enlaces.

## Cómo quiero trabajar
- Una sección cada vez. No toques otras secciones sin avisar.
- Después de cada cambio, explícame las clases menos obvias y por qué has
  elegido flex o grid en cada caso. Tengo que poder defender cada clase.
- Lab 2: una kata cada vez. Después de cada una, explícame las decisiones menos
  obvias: por qué ese método de array, qué infiere TypeScript y qué se copia y
  qué se comparte (referencias).
- Lab 3: un obligatorio cada vez. Después de cada uno, explícame cada línea de
  configuración nueva (qué hace, si actúa en desarrollo, en build o en los
  dos) y lista las comprobaciones que tengo que hacer yo en el navegador.
- Lab 4: un obligatorio cada vez. Después de cada uno, explícame cada
  componente y cada hook: qué es estado y qué se calcula, quién es dueño de
  cada dato, cuándo se ejecuta cada efecto y qué limpia, y lista las
  comprobaciones 🔎 que tengo que hacer en el navegador y las preguntas 📝
  que tocan para el README.
- Lab 5: un obligatorio cada vez. Después de cada uno, explícame cada
  petición (método, URL, cabeceras que envía, código que recibe y por qué),
  qué hace cada función de hotels.api.ts con los errores, y lista las
  comprobaciones 🔎 que tengo que hacer en el navegador (pestaña Network) y
  las capturas que tengo que hacer (qué tiene que verse, nombre de fichero y
  carpeta).
- Si dudas entre dos enfoques, pregúntame antes de elegir.
- Todas las soluciones deben funcionar con DevContainers. No instales dependencies en local sin confirmar antes.
- El proyecto está estructurado en laboratorios entregables dentro de cada carpeta (lab.md) que irán desarrollandose hasta el producto final. Cada uno es una fase distinta del proyecto. No modifiques varios entregables a la vez.
- Para cada entregable asegurate de que exite un fichero readme.md con instrucciones sobre como lanzar el proyecto.

## Lab 2 (cerrado)
Katas de JavaScript/TypeScript sobre el catálogo de cafés de Tueste
(02-Lenguajes/lab-lenguajes). Estas reglas NO aplican al lab 3 salvo lo
indicado en "Reglas (lab 3)"; se conservan como referencia.

### Stack
- Vite (plantilla vanilla-ts), TypeScript 6 en modo estricto, Immer.
- Un fichero por kata en `src/` y `main.ts` que los importa todos.
- Vite no comprueba tipos: el árbitro es `npx tsc`.

### Reglas para todas las katas
- Nada de `any` (el tipo correcto, un genérico o `unknown` con guardas), ni
  `var`, ni `enum` (uniones de literales, por `erasableSyntaxOnly`).
- Nada de `as` para callar errores: se arregla el tipo.
- No mutar los datos de entrada (salvo que la kata lo diga): nada de `push`,
  `sort`, `splice` ni `obj.prop = …` sobre lo recibido. `toSorted()` en vez de
  `sort()`; `map` + spread (`{ ...item, quantity: item.quantity + 1 }`) en vez
  de mutar dentro del `map`; `map`/`filter` en vez de `forEach` + `push`.
- Copias: spread (superficial), `structuredClone` (profunda) o Immer. Nunca
  `JSON.parse(JSON.stringify(...))` ni lodash.
- Anotar parámetros y tipo de retorno de cada función; dentro, dejar que
  TypeScript infiera (nada de `const n: number = 3`).
- Tipos con `import type { ... }` (por `verbatimModuleSyntax`).
- Debajo de cada `console.log`, un comentario con la salida esperada:
  `// → "14.90 €"`.
- `npx tsc` tiene que salir limpio.

## Lab 1 (cerrado)
Maquetación de las pantallas de Postula (01-*). Estas reglas NO aplican al
lab 2; se conservan como referencia.

### Stack
- Vite (plantilla vanilla), HTML + Tailwind CSS v4. Sin frameworks.
- Tailwind v4: `@import "tailwindcss";` y el tema en `@theme` dentro de
  `src/style.css`. NUNCA tailwind.config.js, ni `@tailwind base;`, ni
  `npx tailwindcss init`, ni autoprefixer.

### Reglas obligatorias
- HTML semántico: header, nav, main, section con su título, footer, article
  para tarjetas, ul para listas de enlaces. Un solo h1 por página y sin
  saltarse niveles de título.
- Mobile first: las clases base son para móvil; sm:/md:/lg: añaden.
- Colores y fuentes SOLO con los tokens de @theme. Nada de valores arbitrarios
  como bg-[#123456] o text-[17px].
- Todo lo interactivo con hover: y focus-visible: visibles. Usable con teclado.
- Imágenes con alt descriptivo, o alt="" si son decorativas. Nada de texto
  dentro de imágenes. Contraste suficiente (objetivo: Lighthouse ≥ 90).
- Todo lo que se mueva (animate-*, translate, scale) lleva motion-safe:.
- Sin JavaScript salvo que lo pida expresamente.
