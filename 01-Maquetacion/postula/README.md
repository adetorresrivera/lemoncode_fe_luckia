# Postula · Lab 01 (Maquetación)

## Tema elegido: la UI de mi TFM (vía 🅱️)

**Postula** es un gestor de candidaturas de empleo. Cada usuario registra las
ofertas a las que se presenta, las sigue en una tabla o en un tablero kanban,
guarda los contactos de cada empresa y apunta qué versión de su CV y carta
envió a cada oferta, para saber cuál le consigue más entrevistas.

En este laboratorio solo hay **maquetación**: HTML + Tailwind CSS v4, con datos
inventados escritos en el HTML. No hay backend ni lógica; el único JavaScript es
el botón de modo oscuro.

### Pantallas maquetadas

| Pantalla | Fichero | Qué contiene |
|---|---|---|
| Landing pública | [`index.html`](index.html) | Cabecera, hero, cómo funciona (3 pasos), qué puedes hacer (6 tarjetas), planes (Gratis / Pro destacado / Escuelas), preguntas frecuentes y pie con newsletter |
| Panel | [`app/panel.html`](app/panel.html) | Barra lateral y un resumen tipo bento: 4 estadísticas (una destacada), próximos pasos, entrevistas por versión de CV y últimas candidaturas |
| Candidaturas en tabla | [`app/candidaturas.html`](app/candidaturas.html) | Filtros y tabla de candidaturas |
| Candidaturas en kanban | [`app/kanban.html`](app/kanban.html) | 5 columnas por estado: Guardada, Enviada, Entrevista, Oferta y Descartada |

La tabla y el kanban se enlazan con un selector de vista **Tabla | Kanban**.

### Equivalencias con el tema propuesto

| Pieza del tema propuesto | En Postula |
|---|---|
| Cabecera + menú | Cabecera de la landing (sticky, con menú hamburguesa en móvil) y barra lateral de la app |
| Hero | Hero de la landing |
| Tarjetas de cafés | «Qué puedes hacer» (6 tarjetas) y la tarjeta de candidatura del kanban y el panel |
| Cómo funciona (3 pasos) | «Cómo funciona» |
| Planes con destacado | Planes (Pro destacado) y estadísticas del panel (una destacada) |
| FAQ | Preguntas frecuentes con `<details>` |
| Pie + newsletter | Pie con newsletter y filtros de la tabla de candidaturas |

## Capturas

<!-- TODO: hacer las capturas y guardarlas en docs/screenshots/ con estos nombres.
     Móvil: DevTools → modo dispositivo, 390 px de ancho. Escritorio: 1440 px.
     Para una página entera: Ctrl/Cmd + Shift + P → "Capture full size screenshot". -->

| Pantalla | Móvil | Escritorio |
|---|---|---|
| Landing | ![Landing en móvil](docs/screenshots/landing-movil.png) | ![Landing en escritorio](docs/screenshots/landing-escritorio.png) |
| Landing (modo oscuro) | ![Landing en móvil, modo oscuro](docs/screenshots/landing-movil-oscuro.png) | ![Landing en escritorio, modo oscuro](docs/screenshots/landing-escritorio-oscuro.png) |
| Panel | ![Panel en móvil](docs/screenshots/panel-movil.png) | ![Panel en escritorio](docs/screenshots/panel-escritorio.png) |
| Candidaturas (tabla) | ![Tabla de candidaturas en móvil](docs/screenshots/candidaturas-movil.png) | ![Tabla de candidaturas en escritorio](docs/screenshots/candidaturas-escritorio.png) |
| Candidaturas (kanban) | ![Kanban en móvil](docs/screenshots/kanban-movil.png) | ![Kanban en escritorio](docs/screenshots/kanban-escritorio.png) |

## Cómo arrancarlo

### Con DevContainer (recomendado)
1. Abre la raíz del repo en VS Code → *Dev Containers: Reopen in Container*.
2. La primera vez, el contenedor crea el volumen de Docker `lemoncode-fe-luckia`,
   **clona el repo de GitHub dentro** (`onCreateCommand`) e instala las
   dependencias (`postCreateCommand`).
3. En la terminal del contenedor:
   ```bash
   cd 01-Maquetacion/postula
   npm run dev
   ```
4. Abre http://localhost:5173 (landing), http://localhost:5173/app/panel.html (panel)
   , http://localhost:5173/app/candidaturas.html (candidaturas en tabla)
   o http://localhost:5173/app/kanban.html (candidaturas en kanban).

`npm run build` genera en `dist/` todas las páginas listadas en
`build.rollupOptions.input` de `vite.config.js`: Vite solo construye por
defecto `index.html`, así que cada página nueva de `app/` hay que añadirla ahí.

### Dónde está el código

El contenedor **no monta la carpeta de Windows**: trabaja sobre su propia copia
clonada en un volumen Linux (`/workspaces/lemoncode_fe_luckia`). Así se evitan
los problemas de montar `C:\...` en Linux (git marcando ficheros como
modificados sin cambios reales, finales de línea, recarga lenta de Vite).

Consecuencias:

- Lo que edites en el contenedor **no aparece en la carpeta de Windows** (ni al
  revés). Para sincronizar, usa git: `commit` + `push` en el contenedor y
  `pull` donde lo necesites.
- Haz commits y push desde el contenedor; VS Code le pasa tus credenciales y tu
  `user.name` / `user.email`.
- El volumen persiste aunque reconstruyas el contenedor (*Rebuild Container*):
  no se vuelve a clonar ni pierdes cambios sin subir. Para empezar de cero,
  borra el volumen: `docker volume rm lemoncode-fe-luckia`.

### En local (Node 20+)
```bash
cd 01-Maquetacion/postula
npm install
npm run dev
```

## Integración de Tailwind
Plugin `@tailwindcss/vite`: el proyecto ya es Vite, así que hay menos dependencias, no hace falta `postcss.config` y la recarga es más rápida. PostCSS solo compensaría si usáramos otros plugins de PostCSS o una herramienta distinta de Vite.

## Checklist

### ✅ Obligatorios

- [x] **O1 · Estructura semántica**: `header`, `nav`, `main`, `section` con su título, `footer`, `article` en las tarjetas y `ul` en las listas de enlaces. Un solo `h1` por página, sin saltarse niveles, y todas las imágenes con `alt` (`alt=""` en las decorativas).
- [x] **O2 · Tema con `@theme`**: marca `brote` (50, 300, 500, 900, 950), acento `coral` (400, 500), *Bricolage Grotesque* para los títulos e *Inter* para el texto. Están en [`src/style.css`](src/style.css) y no hay ningún color a pelo en el HTML.
- [x] **O3 · Cabecera con flexbox**: logo a la izquierda y menú a la derecha; en móvil, menú hamburguesa (D1).
- [x] **O4 · Hero**: `grid` de una columna que pasa a `md:grid-cols-2`, con el texto limitado por `max-w-xl`.
- [x] **O5 · Rejilla de tarjetas**: «Qué puedes hacer», 6 tarjetas con `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, `aspect-video` + `object-cover` y hover con sombra, `-translate-y-1` y zoom de la imagen.
- [x] **O6 · Pasos con flexbox**: «Cómo funciona», con `flex flex-col md:flex-row` y cada paso centrado.
- [x] **O7 · Pie**: 4 columnas en escritorio (marca + redes, Producto, Recursos y legal, Newsletter) que se apilan en móvil, y el copyright separado con `border-t`.
- [x] **O8 · Accesibilidad mínima**: todo se usa con teclado y tiene `focus-visible:`, las páginas de la app tienen el enlace «Saltar al contenido» y el contraste está comprobado en los dos modos (ver [Accesibilidad y Lighthouse](#accesibilidad-y-lighthouse)).
- [x] **O9 · README + bitácora de IA**: este fichero y la [bitácora](#bitácora-de-ia).

### ⭐ Opcionales

- [x] **P1 · Modo oscuro** con botón y la preferencia guardada (ver [Modo oscuro](#modo-oscuro)).
- [x] **P2 · Cabecera fija con efecto cristal** (ver [Cabecera sticky](#cabecera-sticky)).
- [x] **P3 · Planes con tarjeta destacada**: la etiqueta «Más popular» se coloca con `absolute` sobre el plan Pro, que es `relative`.
- [x] **P4 · FAQ plegable sin JavaScript**: `<details>` + `<summary>`, con la flecha girada mediante `group-open:rotate-180`.
- [x] **P5 · Formulario con estados**: la newsletter (`label`, `focus:`, `user-invalid:`, `disabled:` y el error con `peer-user-invalid:block`) y los filtros de la tabla.
- [x] **P6 · Bento grid**: el resumen del panel, con `col-span-2` y `lg:row-span-2` en la estadística destacada.
- [x] **P7 · Animaciones**: transiciones en botones, enlaces y tarjetas, y la animación propia `animate-menu-in` (definida en `@theme`) al abrir el menú móvil. Todo lo que se mueve lleva `motion-safe:`.

### 🔥 Desafíos

- [x] **D1 · Menú hamburguesa sin JavaScript**, con `<details>` (ver [Menú móvil](#menú-móvil-sin-javascript-checkbox-vs-detailssummary)).
- [x] **D2 · Container queries**: la misma `.job-card` es vertical en las columnas del kanban y horizontal en el panel (ver [Kanban](#kanban-y-tarjeta-con-container-queries-d2)).
- [ ] **D3 · Multitema**
- [x] **D4 · Utilidades propias**: `@utility app-layout`, `app-layout-sidebar` y `area-*`, y la variante propia `current-page:` (ver [Utilidades propias](#utilidades-propias-d4)).
- [x] **D5 · Layout de aplicación**: rejilla con áreas con nombre en la que solo hace scroll el contenido (ver [Panel](#panel-layout-de-aplicación)).
- [ ] **D6 · De captura a código**
- [ ] **D7 · Lighthouse al 100**

## Accesibilidad y Lighthouse

<!-- TODO: pasar Lighthouse desde el Chrome del host (DevTools → Lighthouse →
     Accesibilidad, Buenas prácticas y SEO), mejor sobre la versión de
     producción: npm run build && npm run preview → http://localhost:4173 -->

| Página | Accesibilidad | Buenas prácticas | SEO | Rendimiento |
|---|---|---|---|---|
| Landing | TODO | TODO | TODO | TODO |
| Panel | TODO | TODO | TODO | TODO |
| Candidaturas (tabla) | TODO | TODO | TODO | TODO |
| Candidaturas (kanban) | TODO | TODO | TODO | TODO |

Comprobaciones hechas a mano:

- **Teclado**: recorrido con Tab en las 4 páginas. El menú hamburguesa, las preguntas frecuentes, el botón de tema, la tabla y el tablero kanban (los dos con scroll horizontal, `tabindex="0"`) se pueden usar sin ratón.
- **Contraste**: todas las parejas de texto de los dos modos pasan AA (≥ 4,5:1). La más justa es la etiqueta «Más popular» (`brote-950` sobre `coral-500`), con 5,2:1.
- **Sin texto en imágenes**: las ilustraciones son SVG decorativos y todo el texto está en el HTML.
- **Color con texto**: los estados de las candidaturas siempre muestran su nombre; el color solo lo refuerza.

## Cabecera sticky
`sticky` y no `fixed`: la cabecera sigue ocupando su hueco en el flujo, así que el hero no queda debajo y no hay que compensar con un `padding-top` en el `body`; solo se pega arriba al hacer scroll.
Hace falta `z-10` porque las tarjetas con `transform` en hover (`-translate-y-1`, `scale-105`) crean su propio contexto de apilamiento y, al ir después en el DOM, se pintarían por encima de una cabecera con `z-index: auto`.
Como la cabecera tapa el inicio de cada sección, `<html>` lleva `scroll-pt-*` para que los enlaces `#como-funciona`, `#planes`… dejen el título visible.

## Menú móvil sin JavaScript: checkbox vs. details/summary
Para esconder el menú tras el botón ☰ en móvil había dos técnicas sin JS. La del **checkbox oculto + `peer-checked:`** permite un único `<nav>` y control total del estilo, pero el lector de pantalla anuncia el control como «casilla de verificación» y no como un botón que abre un menú. Sin JS no se puede poner `aria-expanded`, el foco cae en un `<input>` oculto (y hay que pintarlo en el `<label>` con `peer-focus-visible:`), y **solo se activa con Espacio, no con Enter**. Con **`<details>/<summary>`**, el `<summary>` es enfocable de forma nativa, se anuncia como botón con estado «contraído/expandido» y responde a Enter y a Espacio. A cambio, un `<details>` cerrado oculta su contenido y CSS no puede abrirlo desde `sm:`, así que el `<nav>` está duplicado (uno dentro del `<details>` con `sm:hidden` y otro con `hidden sm:block`; el que tiene `display: none` sale del árbol de accesibilidad y no se anuncian dos menús). Además hay que quitar el triángulo con `list-none` y `[&::-webkit-details-marker]:hidden`. Elegí `<details>` porque el teclado y la semántica vienen de serie. Limitaciones que quedan en las dos técnicas: Escape no cierra el menú, y al pulsar un enlace ancla el menú sigue abierto hasta que se vuelve a pulsar ☰ (que siempre queda visible, así que el panel nunca tapa el contenido sin poder cerrarse).

## Modo oscuro
`@custom-variant dark (&:where(.dark, .dark *));` en `src/style.css`: el modo oscuro depende de la clase `.dark` en `<html>` y no del sistema, para que el usuario pueda elegir. Un script bloqueante en el `<head>` pone la clase **antes del primer pintado** (tema guardado en `localStorage` o, la primera vez, `prefers-color-scheme`), así no parpadea el tema claro. `src/theme.js` solo alterna la clase al pulsar el botón, actualiza `aria-pressed` y guarda la elección. El botón tiene un nombre fijo («Modo oscuro») y es `aria-pressed` el que cambia: el lector anuncia «activado/desactivado». Sin JavaScript la página se ve en claro y el botón no hace nada.

Criterio de color en oscuro (todas las parejas de texto pasan AA): fondo `brote-950`, superficies (tarjetas, «Cómo funciona», plan Pro) `brote-900`, texto `brote-50`, enlaces/hover/foco `brote-300` (`brote-500` sobre `brote-950` solo da 2,6:1) y acento `coral-400` **solo como fondo** con texto `brote-950` (como texto sobre `brote-900` se queda en 4,2:1). Es el mismo criterio que ya seguía el pie, que no cambia salvo un borde superior para separarse del resto de la página, que ahora tiene su mismo fondo.

Las ilustraciones van en `<img>`, así que las clases `dark:` no llegan a sus colores internos, y un `@media (prefers-color-scheme)` dentro del SVG seguiría al sistema y no al botón. Por eso cada una tiene una variante `-dark.svg` y el HTML lleva las dos imágenes, con `dark:hidden` y `hidden dark:block`. Las de las tarjetas tienen `loading="lazy"`, así que la que está oculta no se descarga; las dos del hero sí se descargan, pero son SVG de unos 2 KB.

## Panel: layout de aplicación
`<body>` es una rejilla con áreas con nombre definidas con `@utility` en `src/style.css` (`app-layout` en móvil y `md:app-layout-sidebar` desde `md:`), así que en el HTML no hay valores arbitrarios. Tiene `h-dvh` y la última fila es `minmax(0, 1fr)`: con `1fr` a secas (`minmax(auto, 1fr)`) la fila crecería con el contenido y haría scroll toda la página; así solo lo hace `main` con `overflow-y-auto`, y la cabecera y la barra lateral se quedan fijas sin `sticky` ni `fixed`. En móvil la barra lateral pasa arriba como una fila de enlaces con scroll horizontal; no uso el `<details>` de la landing porque obligaría a duplicar el `<nav>`. El enlace de la página actual lleva `aria-current="page"` y se pinta con la variante propia `current-page:` (`@custom-variant`).

## Kanban y tarjeta con container queries (D2)
El tablero es un `flex` (una sola fila, una dimensión). En móvil cada columna tiene ancho fijo (`w-4/5`, `sm:w-72`) y `shrink-0`, así que no caben y el contenedor hace scroll horizontal; `snap-x snap-mandatory` en el contenedor y `snap-start` en cada columna hacen que al soltar el dedo la columna quede alineada al borde. Como la tabla, el contenedor tiene `tabindex="0"` y `role="region"` con nombre para poder desplazarlo con las flechas. Desde `lg:` las columnas pasan a `flex-1` y se reparten el ancho. No uso `grid-cols-5` porque sus columnas son `minmax(0, 1fr)` y, si no cupiera el contenido, se saldría de la columna; con `flex-1` el mínimo es el contenido y, en el peor caso, vuelve a aparecer el scroll.

La tarjeta de candidatura (`.job-card`) es la misma en el kanban y en «Últimas candidaturas» del panel. La `ul` que la contiene lleva `@container` y la tarjeta `@md:flex-row`: pasa a horizontal cuando **su lista** mide 28rem o más, mida lo que mida la ventana.

## Utilidades propias (D4)

En [`src/style.css`](src/style.css) conviven dos formas de crear clases propias:

- **`@utility`** (`app-layout`, `app-layout-sidebar`, `area-header`, `area-sidebar`, `area-main`): son utilidades de verdad. Tailwind las registra como las suyas, así que admiten variantes (`md:app-layout-sidebar`) y se ordenan con el resto de utilidades. Las uso para lo que Tailwind no trae, como `grid-template-areas`, y así evito valores arbitrarios en el HTML.
- **Clases en `@layer components` con `@apply`** (`.btn-primary`, `.card`, `.nav-link`…): son CSS normal que reúne varias utilidades bajo un nombre. Van en la capa `components` para que una utilidad puesta en el HTML pueda sobrescribirlas (`btn-primary px-6 py-3`). No admiten variantes: `md:btn-primary` no existe.

También hay una **variante propia**, `@custom-variant current-page (&[aria-current="page"])`, para no escribir el selector arbitrario `aria-[current=page]:` en cada enlace.

**Cuándo crear una utilidad o un componente en CSS y cuándo repetir clases.** Una utilidad con `@utility` tiene sentido cuando falta una propiedad CSS en Tailwind o cuando un valor del diseño se repite y tiene nombre propio (el layout de la app). Una clase de componente con `@apply` solo compensa cuando el mismo grupo de clases se repite en muchos sitios y **no hay forma de reutilizar el HTML**. Si el patrón aparece una o dos veces, es mejor repetir las clases: se leen donde se usan y no hay que inventar nombres. Y si hay un framework o un sistema de plantillas, lo correcto es un **componente de HTML/JS** (React, Vue, un *partial*…), que reutiliza a la vez el marcado y las clases.

**Por qué abusar de `@apply` es mala práctica.** Vuelve a crear los problemas que Tailwind quería resolver: hay que inventar nombres para todo, saltar del HTML al CSS para saber qué hace una clase, el CSS crece con cada componente en vez de reutilizar las mismas utilidades, y aparecen conflictos de cascada (por eso estas clases tienen que ir en la capa `components`). Además se pierde lo que da Tailwind en el HTML: con IntelliSense ya no ves el CSS de cada clase y no se pueden aplicar variantes a la clase entera.

**Lo que he hecho yo, siendo honesto.** En este laboratorio he usado `@apply` más de lo ideal: `.section-title`, `.item-title`, `.cell` o `.status-*` son grupos de clases que, con componentes, vivirían en el HTML. Lo he hecho porque son 4 páginas HTML sin plantillas, con 6 tarjetas, 10 filas de tabla y 13 tarjetas de candidatura repetidas a mano, y cada cambio habría que copiarlo en todas. En el TFM, con un framework, la mayoría de estas clases pasarán a ser componentes y las utilidades volverán al marcado.

## Bitácora de IA

Herramienta: **Claude Code** (extensión de VS Code), dentro del DevContainer, con las reglas del proyecto en `CLAUDE.md`: Tailwind v4, solo tokens de `@theme`, mobile first, `motion-safe:` y nada de JavaScript.

La bitácora completa, con el prompt, lo que me dio y lo que corregí en cada sección, está en [`../bitacora.md`](../bitacora.md):

- **Cabecera**: usaba `bg-white` en vez del token `bg-brote-50`; agrupé las clases repetidas.
- **Hero**: frase mal traducida y botones con las clases repetidas en vez de `btn-primary`.
- **Qué puedes hacer**: los enlaces «Saber más» quedaban alineados a la izquierda; rehíce el pie de la tarjeta.
- **Footer**: el resultado se veía bien pero era difícil de leer (input y botón con 10-14 utilidades en línea, SVG con los mismos atributos repetidos); lo pasé a clases propias y dejé `peer` en el HTML para que se vea la relación.
