# 🧪 Laboratorio · Módulo 01 · Layout + Tailwind CSS

> ⏱️ Dedicación estimada: **6-10 h** para los obligatorios; los opcionales y desafíos, lo que queráis estirar. 📦 Formato: enlace a un **repositorio de GitHub**

## La idea

En el módulo hemos visto cómo se construye una página **por dentro**: HTML semántico, modelo de caja, cascada, especificidad, posicionamiento, flexbox, grid y media queries. Después hemos visto **Tailwind**, **PostCSS** y cómo trabajar con **herramientas de IA**.

En este laboratorio vais a juntarlo todo: maquetar una **landing page** (y, si queréis, alguna pantalla más) **usando Tailwind**, que se vea bien en móvil y en escritorio.

La regla del juego:

- ✅ **La IA está permitida y recomendada**. Es como vamos a trabajar en el mundo real.
- ⚠️ Pero **tenéis que entender cada clase que entregáis**. Si en la revisión os preguntamos "¿por qué este `md:grid-cols-3`?" o "¿qué hace este `min-h-dvh`?", tenéis que saber responder. Tailwind es CSS con otro nombre: todo lo del módulo sigue aplicando.

## Elige tu tema

Tenéis dos caminos. **Los dos valen lo mismo.**

### 🅰️ Tema propuesto: _Tueste_, tostadero de café de especialidad

Seguimos con el café de los ejemplos del módulo (Etiopía, Colombia, Kenia…). _Tueste_ es un pequeño tostadero ficticio que vende café online por suscripción.

Necesita una landing con:

- Cabecera con logo y menú.
- **Hero**: titular potente, subtítulo, botón de "Suscríbete" y una imagen.
- **Cafés del mes**: tarjetas con origen, notas de cata y precio.
- **Cómo funciona**: 3 pasos (eliges → tostamos → te llega a casa).
- **Planes de suscripción**: 2-3 planes con uno destacado.
- **Preguntas frecuentes**.
- **Pie** con enlaces, redes y newsletter.

Boceto orientativo (escritorio):

```
┌──────────────────────────────────────────────────────┐
│ ☕ Tueste          Cafés  Planes  FAQ   [Suscríbete]  │
├──────────────────────────────────────────────────────┤
│  Café recién tostado,          ┌──────────────────┐  │
│  en tu puerta cada mes.        │                  │  │
│  Lorem ipsum dolor sit...      │     (imagen)     │  │
│  [Suscríbete]  [Ver cafés]     │                  │  │
│                                └──────────────────┘  │
├──────────────────────────────────────────────────────┤
│  Cafés del mes                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │ Etiopía  │ │ Colombia │ │ Kenia    │              │
│  │ floral…  │ │ caramelo…│ │ frutos r…│              │
│  │ 14,90 €  │ │ 12,90 €  │ │ 15,50 €  │              │
│  └──────────┘ └──────────┘ └──────────┘              │
├──────────────────────────────────────────────────────┤
│  ①Eliges ──── ②Tostamos ──── ③Te llega             │
├──────────────────────────────────────────────────────┤
│  ┌────────┐ ┌════════════┐ ┌────────┐                │
│  │ Básico │ ║ ⭐ Popular  ║ │ Pro    │                │
│  └────────┘ └════════════┘ └────────┘                │
├──────────────────────────────────────────────────────┤
│  FAQ  ▸ ¿Puedo cancelar?  ▸ ¿Molido o en grano? ...  │
├──────────────────────────────────────────────────────┤
│  Footer · enlaces · redes · newsletter [email][OK]   │
└──────────────────────────────────────────────────────┘
```

> 💡 Imágenes: [Unsplash](https://unsplash.com/s/photos/coffee) o [Pexels](https://www.pexels.com/search/coffee/). Iconos: [Heroicons](https://heroicons.com/) o iconos: [Lucide](https://lucide.dev/) (son de los mismos creadores de Tailwind / muy usados con él). Textos: podéis pedírselos a la IA.

### 🅱️ La UI de tu TFM

Si ya tenéis en mente el TFM, **aprovechad este laboratorio para empezar a maquetarlo**. Así sacáis trabajo adelantado y os corregimos el enfoque pronto.

Vale cualquier cosa: la landing del producto, el dashboard, la pantalla de listado + detalle, el perfil de usuario…

Condición: **tiene que cubrir las mismas piezas técnicas** que el tema propuesto. Usad esta tabla como checklist de equivalencias:

|Pieza del tema propuesto|Equivalente en vuestro TFM (ejemplos)|
|---|---|
|Cabecera + menú|Barra superior de la app, barra lateral de navegación|
|Hero|Portada de la landing, cabecera de un perfil, _empty state_ grande|
|Tarjetas de cafés|Listado de productos, proyectos, tareas, publicaciones…|
|Cómo funciona (3 pasos)|Onboarding, pasos de un proceso, línea de tiempo|
|Planes con destacado|Tarjetas de estadísticas con una resaltada, comparativa de opciones|
|FAQ|Ayuda, ajustes plegables, detalle expandible|
|Pie + newsletter|Pie de la app, formulario de contacto / alta / búsqueda con filtros|

> 📝 Si vais por esta vía, poned en el README **dos o tres líneas explicando de qué va el TFM** y qué pantalla(s) habéis maquetado. Solo **maquetación**: datos inventados, nada de backend ni lógica.

## Punto de partida: el proyecto

Usamos **Vite** (arranca en un segundo y recarga solo). Nada de frameworks: HTML + Tailwind. Si alguien quiere usar React o similar, adelante, pero **no suma nota**: aquí se evalúa el layout.

```bash
npm create vite@latest lab-tailwind -- --template vanilla
cd lab-tailwind
npm install
```

Ahora tenéis **dos formas** de conectar Tailwind. Elegid **una** y explicad en el README cuál y por qué.

### Opción 1: plugin de Vite (la más sencilla)

```bash
npm install tailwindcss @tailwindcss/vite
```

_./vite.config.js_

```js
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

### Opción 2: vía PostCSS (lo que hay por debajo)

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

_./postcss.config.mjs_

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

Vite detecta el `postcss.config.mjs` solo, no hay que tocar nada más.

### En los dos casos

_./src/style.css_

```css
@import "tailwindcss";
```

Aseguraos de que el `index.html` enlaza ese CSS (o lo importa `main.js`) y arrancad:

```bash
npm run dev
```

Poned un `<h1 class="text-4xl font-bold text-amber-700">Hola</h1>`: si se ve grande y marrón, estáis dentro. 🎉

> ⚠️ **Ojo con la IA y las versiones.** Estamos usando **Tailwind v4**. Muchas IAs (y muchos tutoriales) todavía generan configuración de la **v3**: `tailwind.config.js`, `@tailwind base; @tailwind components; @tailwind utilities;`, `npx tailwindcss init`… **Eso ya no es así.** En v4 la configuración se hace **en el propio CSS** con `@theme`. Si la IA os propone lo antiguo, corregidla (y contadlo en la bitácora 😉).

### Extensiones recomendadas (VS Code)

- **Tailwind CSS IntelliSense**: autocompletado y, al pasar el ratón por una clase, **os enseña el CSS que genera**. Usadlo muchísimo.
    
- **Prettier** + `prettier-plugin-tailwindcss`: ordena las clases siempre igual. Se leen mucho mejor.
    

---

## ✅ Parte 1 · Obligatorios

Todos son necesarios para aprobar. Ninguno es difícil si vais paso a paso.

### O1 · Estructura semántica

Nada de un mar de `<div>`. Usad lo que vimos en el tema 01:

- `<html lang="es">`, `<meta name="viewport">` y un `<title>` con sentido (tema 00).
- `<header>`, `<nav>`, `<main>`, `<section>` (cada una con su título), `<footer>`.
- **Un solo `<h1>`** y títulos sin saltarse niveles (`h1` → `h2` → `h3`).
- Las tarjetas, `<article>`. Las listas de enlaces, `<ul>`.
- Todas las imágenes con `alt` (vacío `alt=""` si son decorativas).

### O2 · Tu tema visual con `@theme`

No vamos a usar la paleta por defecto tal cual. Definid **vuestra identidad** con variables (tema 05) dentro de `@theme`:

_./src/style.css_

```css
@import "tailwindcss";

@theme {
  --color-tueste-50: #fbf7f3;
  --color-tueste-500: #9a5b33;
  --color-tueste-900: #2e1a10;

  --font-display: "Fraunces", serif;
  --font-sans: "Inter", system-ui, sans-serif;
}
```

Con esto Tailwind **genera solo** clases como `bg-tueste-50`, `text-tueste-900` o `font-display`.

Requisitos:

- Al menos **un color de marca con 3 tonos** y un color de acento.
    
- **Una tipografía** propia (Google Fonts o [Fontsource](https://fontsource.org/)) para los títulos.
    
- **Usadlos en toda la página.** No uséis colores "a pelo" como `bg-[#9a5b33]` repartidos por el HTML: si un color se repite, va al `@theme`.
    

> 💡 ¿Os cuesta elegir paleta? Pedídsela a la IA o usad [uicolors.app](https://uicolors.app/) / [Realtime Colors](https://www.realtimecolors.com/). Y comprobad el **contraste** (O8).

### O3 · Cabecera con flexbox

- Logo a la izquierda, menú a la derecha (`flex`, `justify-between`, `items-center`, `gap-*`).
- En móvil, que **no se rompa**: basta con que el menú pase debajo del logo o se simplifique (el menú hamburguesa es un desafío, no obligatorio).
- Enlaces del menú con estado `hover:` y `focus-visible:` (tema 12, pseudo-clases).

### O4 · Hero

- Titular + texto + **dos botones** (uno principal, uno secundario) + imagen.
- En móvil: todo **en una columna**. A partir de `md:`: **texto e imagen lado a lado** (flex o grid, a vuestra elección, pero sabed justificarlo).
- El texto no debe hacerse ilegible de ancho: `max-w-prose` o `max-w-xl` (el truco del `ch` del tema 05).

### O5 · Rejilla de tarjetas con grid

- Sección con **al menos 6 tarjetas**.
- **Mobile first** (tema 21): 1 columna en móvil, 2 en tablet, 3 (o más) en escritorio → `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`.
- Cada tarjeta: imagen, título, texto, precio / dato destacado y botón. Trabajad el **modelo de caja** (tema 06): `p-*`, `rounded-*`, `border`, `shadow-*`.
- Estado `hover:` en las tarjetas (una sombra más grande, un pequeño `-translate-y-1`… con `transition`).
- Las imágenes, todas del mismo alto sin deformarse: `aspect-video` / `aspect-square` + `object-cover`.

### O6 · Sección de pasos o destacados con flexbox

- 3 pasos (o 3 datos/ventajas) que en móvil van **en columna** y en escritorio **en fila**: `flex flex-col md:flex-row`.
- Centrad el contenido de cada bloque (el famoso centrado de 3 líneas del tema 19).

### O7 · Pie de página

- Al menos **3 columnas** de contenido en escritorio (enlaces, contacto, redes…) que se apilan en móvil.
- Una línea final con el copyright separada con un borde.

### O8 · Accesibilidad mínima

- Todo lo interactivo se puede usar **con teclado** (probadlo con Tab) y tiene un `focus-visible:` **que se ve**.
- **Contraste** suficiente: pasad [Lighthouse](https://developer.chrome.com/docs/lighthouse) (DevTools → Lighthouse → Accesibilidad) y apuntad la nota en el README. Objetivo: **≥ 90**.
- Nada de texto metido en imágenes.

### O9 · README + bitácora de IA

El `README.md` del repo tiene que incluir:

1. **Tema elegido** (A o TFM, y en ese caso de qué va el TFM).
2. **Cómo arrancarlo** (`npm install` + `npm run dev`).
3. **Opción de integración** de Tailwind (Vite o PostCSS) y por qué.
4. **Capturas** en móvil y escritorio.
5. **Checklist** de obligatorios / opcionales / desafíos que habéis hecho.
6. 🤖 **Bitácora de IA**: qué herramienta(s) habéis usado y **al menos 3 ejemplos** con este formato:

```md
### Prompt

"Hazme la sección de planes con 3 tarjetas, la del medio destacada..."

### Qué me dio

Me generó un tailwind.config.js (sintaxis v3) y colores a pelo tipo bg-[#c2410c].

### Qué corregí y por qué

Pasé los colores a @theme y quité el config: en v4 la configuración va en el CSS.
```

> 💡 Lo interesante de la bitácora **no** es que la IA lo hiciera bien, sino **lo que tuvisteis que arreglar**. Eso es lo que demuestra que entendéis lo que hay.

---

## ⭐ Parte 2 · Opcionales

Suben nota. Haced los que más os apetezcan (recomendamos **al menos 3**).

### P1 · Modo oscuro 🌙

- Básico: que siga la preferencia del sistema con la variante `dark:` (usa `prefers-color-scheme`, tema 21).
    
- Mejor: con un **botón** para cambiarlo. En v4 se hace redefiniendo la variante:
    

```css
@custom-variant dark (&:where(.dark, .dark *));
```

…y un poquito de JS que ponga/quite la clase `dark` en `<html>`.

### P2 · Cabecera fija con efecto cristal

`sticky top-0 z-50 backdrop-blur bg-white/70`. Explicad en el README por qué `sticky` y no `fixed`, y por qué hace falta el `z-index` (temas 17 y 18).

### P3 · Planes con tarjeta destacada

La del centro más grande o con un borde de color y una etiqueta "⭐ Más popular" colocada con `absolute` sobre la tarjeta (`relative` en el padre, tema 17).

### P4 · FAQ plegable sin JavaScript

Con `<details>` y `<summary>`. Girad la flechita al abrir usando las variantes `group` + `group-open:rotate-180`. HTML nativo, accesible y sin una línea de JS.

### P5 · Formulario con estados

El de la newsletter (o uno de contacto / login en vuestro TFM):

- `<label>` asociado a cada campo.
- Estilos `focus:`, `invalid:` / `user-invalid:` y `disabled:`.
- Un mensaje de error que solo aparece cuando el campo es inválido, usando `peer` + `peer-invalid:block` (tema 10: hermanos siguientes).

### P6 · Bento grid 🍱

Una sección tipo "bento" (esa rejilla de cajas de distintos tamaños que se ve en tantas webs modernas) con `col-span-2`, `row-span-2`, etc. (tema 20, paso 3).

- 👀 Inspiración: [BentoGrids](https://bentogrids.com/), una galería de diseños bento reales.
- 🛠️ Cómo se hace con Tailwind: [Creating Bento Grid Layouts with CSS (Tailwind CSS)](https://dev.to/ibelick/creating-bento-grid-layouts-with-css-tailwind-css-26mo).

### P7 · Animaciones con cabeza

Alguna animación suave (entrada del hero, hover de botones, tarjetas…) **siempre** con `motion-safe:` para respetar a quien ha pedido menos movimiento (`prefers-reduced-motion`, tema 21).

En Tailwind hay **tres niveles**, de más fácil a más currado:

#### 1. Transiciones: el hover de toda la vida

Una transición anima el cambio entre dos estados (normal → `hover:`). Necesitáis tres piezas: **qué** se anima, **cuánto** dura y **cómo** acelera.

```html

  href="#"
  class="rounded-lg bg-tueste-500 px-6 py-3 text-white
         transition duration-200 ease-out
         hover:bg-tueste-900 hover:-translate-y-0.5 hover:shadow-lg"
>
  Suscríbete
</a>
```

|Clase|Qué hace|
|---|---|
|`transition`|Anima los cambios de color, sombra, opacidad y `transform`|
|`transition-colors`|Solo los colores (más ligero si solo cambia el color)|
|`duration-150` … `duration-500`|Duración en ms. Para un hover, **150-300** va sobrado|
|`ease-out` / `ease-in-out`|La curva de aceleración. `ease-out` es la más natural para un hover|
|`hover:-translate-y-1`|Sube el elemento 0.25rem|
|`hover:scale-105`|Lo agranda un 5 %|

> 💡 Truco para las tarjetas: poned `group` en la tarjeta y `group-hover:scale-105` en la imagen (dentro de un contenedor con `overflow-hidden`). Al pasar el ratón por **cualquier parte** de la tarjeta, se hace zoom en la foto.

#### 2. Animaciones de serie

Tailwind trae cuatro animaciones listas: `animate-spin` (cargando), `animate-ping` (notificación), `animate-pulse` (esqueleto de carga) y `animate-bounce` (flechita de "baja"):

```html
<a href="#cafes" aria-label="Ver los cafés" class="motion-safe:animate-bounce"
  >↓</a
>
```

#### 3. Vuestra propia animación (entrada del hero)

En v4 se define en el `@theme`, con sus `@keyframes` dentro:

```css
@theme {
  --animate-aparecer: aparecer 0.6s ease-out both;

  @keyframes aparecer {
    from {
      opacity: 0;
      transform: translateY(1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

Esto genera la clase `animate-aparecer`:

```html
<h1 class="motion-safe:animate-aparecer">Café recién tostado</h1>
<p class="motion-safe:animate-aparecer [animation-delay:150ms]">…</p>
<div class="motion-safe:animate-aparecer [animation-delay:300ms]">
  …botones…
</div>
```

El `[animation-delay:…]` retrasa cada elemento un poco para que entren **en cascada**.

#### ¿Por qué `motion-safe:`?

A algunas personas el movimiento en pantalla les provoca mareos o les distrae (y lo tienen desactivado en su sistema). `motion-safe:` aplica la clase **solo si no han pedido menos movimiento**. Probadlo en DevTools: `Ctrl/Cmd + Shift + P` → _"Emulate CSS prefers-reduced-motion: reduce"_.

👉 Regla: **todo lo que se mueve** (`animate-*`, `translate`, `scale`) lleva `motion-safe:`. Los cambios de color o sombra no hace falta.

#### Para saber más

- [Transiciones](https://tailwindcss.com/docs/transition-property), [duración](https://tailwindcss.com/docs/transition-duration) y [curvas](https://tailwindcss.com/docs/transition-timing-function)
- [Animaciones](https://tailwindcss.com/docs/animation) (incluye cómo crear las vuestras)
- [`translate`](https://tailwindcss.com/docs/translate) y [`scale`](https://tailwindcss.com/docs/scale)
- [`motion-safe` / `motion-reduce`](https://tailwindcss.com/docs/hover-focus-and-other-states#prefers-reduced-motion)

---

## 🔥 Parte 3 · Desafíos

Para quien quiera sufrir un poco (y aprender mucho). Cada uno cuenta como un plus importante.

### D1 · Menú hamburguesa sin JavaScript

En móvil, el menú se esconde tras un botón ☰ y se despliega al pulsarlo, **sin JS**: con un `<input type="checkbox">` + `peer` + `peer-checked:`, o con `<details>`. Tiene que ser usable con teclado. En el README, contad qué problemas de accesibilidad tiene cada técnica.

### D2 · Componentes con container queries

Una tarjeta que cambia de diseño (vertical ↔ horizontal) según **el ancho de su contenedor**, no el de la ventana: `@container` en el padre y `@md:flex-row` en la tarjeta. Demostradlo poniendo **la misma tarjeta** en una columna estrecha y en una ancha.

### D3 · Multitema

Además de claro / oscuro, **2-3 temas de color** (p. ej. "espresso", "matcha", "caramelo") que se cambian con un selector. Pista: variables CSS dentro de `[data-theme="matcha"] { … }` y que las clases de Tailwind apunten a esas variables. El HTML **no debe cambiar** al cambiar de tema, solo el atributo.

### D4 · Tus propias utilidades

Cread al menos **una utilidad propia** con `@utility` (p. ej. un `text-balance-title` o un `btn-primary`) y explicad en el README:

- Cuándo tiene sentido crear una utilidad/componente en CSS y cuándo es mejor repetir clases (o crear un componente de HTML/JS).
    
- Por qué abusar de `@apply` se considera mala práctica.
    

### D5 · Layout de aplicación (ideal para TFM)

Una pantalla tipo **dashboard**: cabecera, barra lateral, zona de contenido con tarjetas de estadísticas y una tabla o listado. En móvil la barra lateral desaparece o pasa arriba. Usad `grid` con áreas (tema 20, paso 4) mediante valores arbitrarios o una utilidad propia, y que **solo scrollee el contenido**, no toda la página.

### D6 · De captura a código (y mejorarlo)

Elegid una sección de una web que os guste ([Dribbble](https://dribbble.com/), la web de alguna startup…). Pasadle la captura a la IA para que la maquete en Tailwind y después **revisadla a mano**: semántica, accesibilidad, responsive, colores al `@theme`… Entregad el **antes** (lo que dio la IA, en un fichero aparte) y el **después**, con una lista de lo que cambiasteis.

### D7 · Lighthouse al 100

Accesibilidad, Buenas prácticas y SEO a **100** (y Rendimiento lo más alto posible: imágenes optimizadas, `loading="lazy"`, `width`/`height` en las `<img>`…).

---

## 🤖 Cómo sacarle partido a la IA (sin que os la cuele)

Algunas ideas para trabajar bien con ella en este laboratorio:

**Dadle contexto.** Un buen prompt incluye versión, tokens y restricciones:

```text
Estoy maquetando con Tailwind CSS v4 (sin tailwind.config.js, el tema está en
@theme dentro del CSS). Mis colores son tueste-50, tueste-500, tueste-900 y
acento-500; la fuente de títulos es font-display.

Hazme la sección "Cafés del mes": HTML semántico (section + h2 + article por
tarjeta), mobile first (1 columna → 2 en sm → 3 en lg), sin valores arbitrarios,
con estados hover y focus-visible. No uses JavaScript.
```

**Pedidle que os explique**, no solo que haga: _"explícame cada clase de este bloque y qué CSS genera"_, _"¿por qué has usado grid aquí y no flex?"_.

**Revisad siempre esta lista**, porque es lo que la IA suele hacer mal:

|❌ Lo que suele hacer|✅ Qué hacer|
|---|---|
|Sintaxis de Tailwind v3 (`tailwind.config.js`, `@tailwind base`)|`@import "tailwindcss"` + `@theme`|
|`<div>` para todo, `<div onclick>` como botón|`<header>`, `<section>`, `<article>`, `<button>`|
|Colores a pelo: `bg-[#c2410c]`, `text-[17px]`|Tokens del `@theme` y la escala de Tailwind|
|Se olvida del `focus-visible`|Añadidlo en todo lo interactivo|
|Diseña escritorio primero (`lg:` sin base móvil)|Base = móvil; `sm:`/`md:`/`lg:` añaden|
|Clases que se contradicen (`p-4 p-6`, `flex grid`)|Una sola; entended cuál gana y por qué|
|Imágenes sin `alt` o con `alt="image"`|`alt` que describa, o `alt=""` si es decorativa|
|Añade `autoprefixer` a PostCSS|En v4 no hace falta: Tailwind ya se encarga|

**Usad DevTools** como en el módulo: si algo no se ve como esperáis, inspeccionad el elemento, mirad qué regla gana (tema 15) y activad el overlay de grid/flex.

---

## 📬 Entrega

1. Repositorio **público** en GitHub (o privado dando acceso a los profesores).
2. En la raíz: el proyecto de Vite + el `README.md` del punto O9.
3. Capturas en una carpeta `docs/` o `screenshots/`.
4. En el portal academia.lemoncode.net id a los laboratorios del módulo 1 y pegáis el enlace a vuestro repo público.

> ✋ No subáis `node_modules` (Vite ya os crea el `.gitignore`).

## 📊 Evaluación

|Bloque|Peso|
|---|---|
|Obligatorios O1-O8 (maquetación y Tailwind)|50 %|
|README + bitácora de IA (O9)|10 %|
|Opcionales (P1-P7)|20 %|
|Desafíos (D1-D7)|15 %|
|Acabado general: que se vea **chulo** ✨|5 %|

- Para **aprobar**: todos los obligatorios hechos y funcionando en móvil y escritorio.
    
- En la revisión podemos pediros que **expliquéis una sección** o que hagáis un **cambio pequeño en directo** (p. ej. "que estas tarjetas sean 4 columnas en pantallas grandes"). Es la forma de comprobar que el código es vuestro, lo haya escrito quien lo haya escrito.
    
- Da igual el tema (A o TFM): se evalúan las mismas piezas.
    

## 📚 Recursos

- [Documentación de Tailwind CSS](https://tailwindcss.com/docs) (el buscador es excelente: buscad la propiedad CSS, p. ej. "justify-content").
- [Tailwind: instalación con Vite](https://tailwindcss.com/docs/installation/using-vite) y [con PostCSS](https://tailwindcss.com/docs/installation/using-postcss).
- [Tailwind: configurar el tema (`@theme`)](https://tailwindcss.com/docs/theme) y [modo oscuro](https://tailwindcss.com/docs/dark-mode).
- Los apuntes del módulo: [01-layout](https://github.com/Lemoncode/luckia-front-end-moderno-ia/tree/main/01-layout). Especialmente **19 · Flexbox**, **20 · CSS Grid** y **21 · Media queries**.
- Inspiración: [Tailwind UI / Plus](https://tailwindcss.com/plus) (mirar, no copiar), [Dribbble](https://dribbble.com/), [Land-book](https://land-book.com/).

¡A maquetar! ☕

# Solución

Bocetos: https://claude.ai/artifact/WezX1ZxFoGNAAxc2t4XxsK?sk=zMoUQ1Wr0ej0N3mnw29ZFA#page-dcb81aee8d8