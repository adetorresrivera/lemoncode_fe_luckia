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
4. Abre http://localhost:5173

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
