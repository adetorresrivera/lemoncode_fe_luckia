# Postula · TFM

Gestor de candidaturas de empleo. Los usuarios registran sus candidaturas, las
siguen en una tabla o en un tablero kanban, guardan los contactos de cada
empresa y controlan qué versión de su CV y carta enviaron a cada oferta.

Ahora mismo estoy en el laboratorio 1 del máster: SOLO maquetación. Datos
inventados escritos en el HTML, sin backend ni lógica.

## Stack
- Vite (plantilla vanilla), HTML + Tailwind CSS v4. Sin frameworks.
- Tailwind v4: `@import "tailwindcss";` y el tema en `@theme` dentro de
  `src/style.css`. NUNCA tailwind.config.js, ni `@tailwind base;`, ni
  `npx tailwindcss init`, ni autoprefixer.

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

## Reglas obligatorias
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

## Cómo quiero trabajar
- Una sección cada vez. No toques otras secciones sin avisar.
- Después de cada cambio, explícame las clases menos obvias y por qué has
  elegido flex o grid en cada caso. Tengo que poder defender cada clase.
- Si dudas entre dos enfoques, pregúntame antes de elegir.
- Todas las soluciones deben funcionar con DevContainers. No instales dependencies en local sin confirmar antes.
- El proyecto está estructurado en laboratorios entregables dentro de cada carpeta (lab.md) que irán desarrollandose hasta el producto final. Cada uno es una fase distinta del proyecto. No modifiques varios entregables a la vez.