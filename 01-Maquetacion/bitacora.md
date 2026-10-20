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