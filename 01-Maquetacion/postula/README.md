# Postula · Lab 01 (Maquetación)

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
   o http://localhost:5173/app/candidaturas.html (candidaturas en tabla).

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
