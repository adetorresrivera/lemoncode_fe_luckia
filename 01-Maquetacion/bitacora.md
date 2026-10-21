## Creación de la cabecera

### Prompt

"Maqueta la cabecera de la landing: logo a la izquierda y menú a la derecha
con flex. Enlaces: Cómo funciona, Planes, Preguntas, Entrar y un botón
"Crear cuenta". En móvil no debe romperse; de momento basta con que el menú
pase debajo del logo."

### Qué me dio

[Commit](https://github.com/adetorresrivera/lemoncode_fe_luckia/commit/10dad9bf3745c43aa13b90cb8cfdb0362f33d2f7)

### Qué corregí y por qué

- Usa blanco en el background del header `bg-white` en vez de el color de la paleta `bg-brote-50`.
- En el prompt no incluí la sección de `Qué puedes hacer` así que la incluí a mano.
- Agrupar las clases de Tailwind en clases dentro de utilities para hacerlo más facil de leer

## Hero
### Prompt

"Maqueta el hero: etiqueta pequeña "Gestor de candidaturas", h1 "Toda tu
búsqueda de empleo, en un solo sitio.", un párrafo, dos botones (principal
"Empieza gratis" y secundario "Ver cómo funciona") y una imagen. En móvil, una
columna; desde md:, texto e imagen lado a lado. Limita el ancho del texto con
max-w-prose o max-w-xl. Explícame por qué eliges flex o grid."

### Qué me dio

- Texto mal traducido
> Guarda cada oferta, apunta qué CV enviaste y a quién, y sabe en qué punto está cada proceso sin perderte entre correos.
- Botones sin clases de utility

### Qué corregí y por qué
- Sustituidas clases redundantes por 'btn-primary'
- Arreglado texto en el Hero

## Qué puedes hacer
### Prompt
"Maqueta la sección "Qué puedes hacer" con 6 tarjetas (article). Cada una
lleva una imagen, un h3, un párrafo, una etiqueta pequeña con un dato y un
enlace "Saber más". Funcionalidades: Tabla y kanban, Versiones de CV,
Contactos por empresa, Historial de cada proceso, Estadísticas y Notas de
preparación.
- Rejilla mobile first: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 con gap.
- Imágenes del mismo alto sin deformarse: aspect-video + object-cover. Usa
  imágenes de prueba con width, height y loading="lazy", con un alt
  descriptivo o alt="" si son decorativas.
- Modelo de caja: padding, rounded, border y shadow.
- Hover en la tarjeta: sombra mayor y motion-safe:hover:-translate-y-1 con
  transition. Zoom de la imagen con group y group-hover:scale-105 dentro de
  un contenedor con overflow-hidden.
- Los enlaces con focus-visible: que se vea.
Que todas las tarjetas tengan la misma altura y el enlace quede abajo,
aunque los textos tengan distinta longitud. Explícame cómo lo consigues."

### Qué me dio
- Visualizacion correcta pero no me gustaban los botones de saber más alineados a la izquierda

### Qué corregí y por qué

```html
<a class="link card-link">
  <span class="card-link-text">Saber más&nbsp;</span>
  <span class="sr-only"> sobre …</span>
  <span aria-hidden="true">→</span>
</a>
```

.card-footer (flex items-center gap-3) pone la etiqueta y el enlace en una sola fila, sin flex-wrap.
.tag lleva shrink-0 whitespace-nowrap: la etiqueta nunca se encoge ni se parte, así que ocupa su ancho natural y lo que queda es para el enlace.
.card-link lleva ml-auto para ir a la derecha y min-w-0 para poder encogerse por debajo del ancho de "Saber más →". Sin min-w-0, un elemento flex no se encoge por debajo de su contenido.
.card-link-text es la clave:
flex flex-wrap h-6 overflow-hidden: una caja de una línea de alto (24 px) donde los elementos pueden pasar a una segunda línea, que queda recortada.
before:h-6: un ::before sin ancho que ocupa siempre la primera línea.
Si "Saber más" cabe en el hueco que queda, se coloca en esa primera línea junto al ::before y se ve. Si no cabe, salta a la segunda y overflow-hidden la oculta.
Sin el ::before, el texto sería el primer elemento y nunca saltaría: se cortaría a medias ("Sab…").
&nbsp; separa el texto de la flecha. Va dentro del mismo span, así que cuando el texto se oculta el espacio también desaparece y la flecha cabe incluso a 320 px.
Accesibilidad: el texto oculto por overflow-hidden sigue en el HTML, así que el lector de pantalla lee "Saber más sobre notas de preparación" aunque solo se vea la flecha.
### Cambio posterior: etiqueta bajo el título

El truco de `.card-link-text` funcionaba, pero era frágil (depende de que `h-6`
coincida con el alto de línea), difícil de defender y en tarjetas estrechas
dejaba solo una flecha como objetivo de clic, demasiado pequeño.

Opciones que valoré:

- A. Convertir toda la tarjeta en enlace (enlace en el h3 con `after:absolute after:inset-0`). Encaja con el hover que ya levanta la tarjeta, pero es un cambio más grande.
- B. Sacar la etiqueta del pie para que el enlace no tenga que competir por el espacio.
- C. Container query (`@container` + `@max-xs:sr-only`). Más limpio que el truco, pero sigue dejando solo la flecha.

Elegí B. Primero probé la etiqueta encima del título y después la moví debajo
del h3, para que el lector de pantalla lea primero el título y luego el dato.

```html
<div class="card-body">
  <h3 class="item-title">Tabla y kanban</h3>
  <p class="tag">5 estados</p>
  <p class="item-text">…</p>
  <div class="card-footer">
    <a href="…" class="link"
      >Saber más<span class="sr-only"> sobre tabla y kanban</span>&nbsp;<span aria-hidden="true">→</span></a
    >
  </div>
</div>
```

- Eliminadas `.card-link` y `.card-link-text`: ya no hace falta que el enlace se encoja.
- `.card-footer` pasa a `mt-auto pt-3`: ya no es una fila flex porque solo contiene el enlace; `mt-auto` lo sigue empujando al fondo para que los enlaces queden alineados.
- `.tag` cambia `shrink-0` por `self-start`: `.card-body` es `flex flex-col` y por defecto estira a sus hijos a todo el ancho; `self-start` mantiene la píldora a su ancho natural.
- `&nbsp;` antes de la flecha para que "→" no salte sola a otra línea.

## Footer
### Prompt

"Maqueta el footer. Ahora mismo tiene una section de newsletter vacía.
- Al menos 4 bloques en escritorio: marca (logo + frase), Producto (enlaces
  ul), Recursos/Legal (enlaces ul) y Newsletter. En móvil, apilados; 2
  columnas en sm:, 4 en lg:. Dime si eliges grid o flex y por qué.
- Enlaces de redes con iconos SVG inline. El nombre de la red tiene que ser
  accesible (sr-only o aria-label), porque solo se ve el icono.
- Newsletter: form con un label asociado al input type="email" required, y un
  botón. Estilos focus:, user-invalid: (no invalid:, que pinta en rojo al
  cargar) y disabled:. Un mensaje de error que solo aparece si el email no es
  válido, con peer + peer-user-invalid:block. Explícame por qué el mensaje
  tiene que ir después del input en el HTML.
- Una línea final con el copyright separada por un border-t.
- Revisa que los títulos del footer no se salten niveles respecto al resto de
  la página."

### Qué me dio

- Rejilla `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`: grid porque son columnas fijas por breakpoint y en `sm:` queda un 2×2 alineado en dos dimensiones.
- Títulos del pie como `h2`: el footer es hermano de `main`; con `h3` colgarían del último `h2` (Preguntas frecuentes).
- El mensaje de error va después del input porque `peer-user-invalid:block` genera `.peer:user-invalid ~ *`, y `~` solo selecciona hermanos posteriores dentro del mismo padre.
- Visualmente correcto, pero el código era difícil de leer: input y botón con 10-14 utilidades en línea y los tres SVG repitiendo los mismos 6 atributos.

### Qué corregí y por qué

Refactor de legibilidad del código, sin cambios visuales:

- Clases nuevas en `@layer components`: `.footer-brand`, `.footer-input`, `.footer-button` y `.footer-error`, igual que `.btn-primary` o `.faq-summary` en otras secciones.
- `peer` y `peer-user-invalid:block` se quedan en el HTML a propósito, para que en el marcado se vea qué elemento depende de cuál:

```html
<input id="newsletter-email" type="email" required class="footer-input peer" />
<button type="submit" class="footer-button">Suscribirme</button>
<p class="footer-error peer-user-invalid:block">…</p>
```

- `.footer-error` lleva `hidden`. Funciona porque `peer-user-invalid:block` es una utilidad y la capa utilities gana a la capa components.
- `.footer-icon` sustituye `fill`, `stroke`, `stroke-width`, `stroke-linecap` y `stroke-linejoin` de cada SVG por `fill-none stroke-current stroke-2`. `stroke-linecap` y `stroke-linejoin` van en CSS normal porque Tailwind no tiene utilidad para ellos. En el `<svg>` solo quedan `viewBox`, `aria-hidden` y `focusable`.
- Un comentario HTML encima de cada bloque (Marca, Producto, Recursos y legal, Newsletter, Copyright) para ver dónde empieza y acaba cada columna.
- El logo de la cabecera no lo he tocado: es casi igual que `.footer-brand` pero con otros colores, y unificarlos sería modificar otra sección.
