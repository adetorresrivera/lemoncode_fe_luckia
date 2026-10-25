# Postula · TFM

Gestor de candidaturas de empleo. Los usuarios registran sus candidaturas, las
siguen en una tabla o en un tablero kanban, guardan los contactos de cada
empresa y controlan qué versión de su CV y carta enviaron a cada oferta.

Ahora mismo estoy en el laboratorio 2 del máster (02-Lenguajes/lab.md): katas
de JavaScript/TypeScript sobre el catálogo de cafés de Tueste. El proyecto vive
en 02-Lenguajes/lab-lenguajes.

## Stack (lab 2)
- Vite (plantilla vanilla-ts), TypeScript 6 en modo estricto, Immer.
- Un fichero por kata en `src/` y `main.ts` que los importa todos.
- Vite no comprueba tipos: el árbitro es `npx tsc`.

## Reglas para todas las katas (lab 2)
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
- Si dudas entre dos enfoques, pregúntame antes de elegir.
- Todas las soluciones deben funcionar con DevContainers. No instales dependencies en local sin confirmar antes.
- El proyecto está estructurado en laboratorios entregables dentro de cada carpeta (lab.md) que irán desarrollandose hasta el producto final. Cada uno es una fase distinta del proyecto. No modifiques varios entregables a la vez.
- Para cada entregable asegurate de que exite un fichero readme.md con instrucciones sobre como lanzar el proyecto.

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
