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