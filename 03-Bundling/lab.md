Laboratorio · Módulo 3 · Bundling con Vite
Formato: enlace a un repositorio de GitHub

La idea
En el módulo hemos montado un proyecto de Vite pieza a pieza: primero un HTML con un console.log y, al final, TypeScript, React y variables de entorno. Por el camino hemos visto qué hace Vite en desarrollo y qué hace en producción, y por qué son cosas distintas.

En este laboratorio vais a recorrer el mismo camino, pero con vuestro propio proyecto. Podéis elegir:

La tienda de Tueste, el tostadero de café de los laboratorios anteriores. Todos los ejemplos del enunciado están hechos con ella.
Lo que hayáis hecho en los laboratorios anteriores, por ejemplo vuestro portfolio. En ese caso, adaptad los ejemplos: los cafés de data.ts pasan a ser vuestros proyectos, el carrito puede ser una lista de favoritos, el banner de ofertas un aviso de "disponible para trabajar"… Lo que importa no es el contenido, sino que se cumplan las comprobaciones.
Cada obligatorio tiene tres partes:

Qué montar: los pasos (casi todos los tenéis en el apartado del módulo que se indica).
Qué comprobar: lo que tenéis que ver con vuestros ojos en DevTools, en la terminal o en la carpeta dist. Es el equivalente a la "salida esperada" del laboratorio anterior.
Qué responder: una o dos preguntas para el README. Con dos o tres frases basta.
La regla del juego (la de siempre):

La IA está permitida y recomendada.
Pero tenéis que entender cada línea de configuración que entregáis. Si en la revisión os preguntamos "¿para qué sirve este plugin?" o "¿por qué esta variable lleva VITE_ delante?", tenéis que saber responder.
En los obligatorios, nada de npm create vite: el proyecto se monta a mano, desde un package.json vacío. La plantilla automática es estupenda… cuando ya sabéis lo que hace por dentro.
Punto de partida
Node.js 20.19 o superior (node -v para comprobarlo). Es la mínima que pide Vite 8; si instaláis ahora, coged la 24, que es la LTS actual.
Una carpeta vacía con un nombre sin espacios ni mayúsculas, por ejemplo lab-bundling, y git init.
Recomendado: un commit por obligatorio (1 - proyecto desde cero, 2 - estilos con Sass…). Así, en la revisión, podemos ver cómo ha ido creciendo el proyecto, igual que en las carpetas del módulo.
Cómo vais a mirar las cosas
Casi todas las comprobaciones se hacen en DevTools → pestaña Network:

Dejad desmarcada la casilla Disable cache. Si está marcada, el navegador no usa la caché y no veréis ni los 304 ni las respuestas from disk cache.
Con F5 se recarga la página y se rellena la lista de peticiones.
Si pulsáis en una petición, veréis sus cabeceras (Headers) y su contenido (Response).
Y otras en la carpeta dist que genera npm run build: abrid los ficheros con el editor y usad su buscador.

Parte 1 · Obligatorios
Todos son necesarios para aprobar. Id en orden: cada uno parte del anterior.

1 - Proyecto desde cero (paso 1)
Qué montar

npm init -y y, en el package.json, "private": true y "type": "module".

Instalad Vite como dependencia de desarrollo: npm install vite --save-dev.

Tres scripts:

"scripts": {
  "start": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
Un index.html en la raíz, con lang="es", un <title> con sentido, una cabecera con el nombre de la tienda y <script type="module" src="/src/index.js"></script>.

Un src/index.js con un console.log de bienvenida.

Qué comprobar

npm run build crea dist/index.html y dist/assets/index-<hash>.js. Abrid el .js: está minificado. Abrid el index.html: apunta al fichero con hash.
npm run preview sirve esa carpeta dist en http://localhost:4173.
npm start arranca el servidor de desarrollo en http://localhost:5173. En Network aparecen index.js, client y env.mjs: los dos últimos los inyecta Vite.
Pulsad F5 varias veces: index.js responde 304 Not Modified.
Cambiad el texto del console.log y guardad: la petición pasa a ser index.js?t=<número> y responde 200. Pegad ese número en la consola con new Date(<número>) para ver qué es.
Qué responder

¿Para qué sirve el hash del nombre del fichero en producción? ¿Qué pasaría sin él cuando subís una versión nueva?
¿Qué diferencia hay entre npm start y npm run preview? ¿Cuál usaríais para comprobar que la versión de producción funciona?
2 - Estilos con Sass (pasos 2 y 3)
Qué montar

Un src/styles/_variables.scss con los colores de marca de Tueste (podéis reutilizar los del @theme del laboratorio 1):

$tueste-500: #9a5b33;
$tueste-900: #2e1a10;
Un src/styles/main.scss que los use para dar estilo a la cabecera del index.html (fondo oscuro, texto claro, logo y título en fila con display: flex…):

@use "variables" as *;

.brand-header {
  background-color: $tueste-900;
  /* ... */
}
Importadlo desde index.js: import "./styles/main.scss";

Arrancad antes de instalar nada. Leed el error que da Vite y haced lo que os dice (sass-embedded).

Qué comprobar

En desarrollo, en Network, main.scss aparece como una petición más… pero con icono de JavaScript. Abrid su contenido: contiene updateStyle y removeStyle.
Cambiad un color en _variables.scss y guardad: el color cambia sin recargar la página (el console.log de index.js no se vuelve a ejecutar). En Elements, mirad el <style> que Vite ha metido en el <head>.
npm run build genera un dist/assets/index-<hash>.css, ya en CSS normal (las variables de Sass se han sustituido por los colores), y dist/index.html lo enlaza con un <link>.
Qué responder

¿Por qué en desarrollo el CSS llega como un módulo de JavaScript y en producción como un fichero .css?
Ojo con la IA: en Sass, @import está obsoleto. Lo actual es @use. Si la IA os propone @import "variables";, corregidla.

3 - Imágenes (paso 5)
Qué montar

Dos imágenes en src/assets/:

Un logo pequeño en SVG (lo podéis dibujar a mano, pedírselo a la IA o sacarlo de Lucide, por ejemplo el icono coffee). Ponedlo en la cabecera del index.html con <img src="/src/assets/logo.svg" alt="Tueste" />.

Una foto de café en JPG, de varios cientos de KB (Unsplash o Pexels). Esta, importadla desde JavaScript y añadidla a la página:

import coffeePhoto from "./assets/coffee.jpg";

console.log(coffeePhoto);

const img = document.createElement("img");
img.src = coffeePhoto;
img.alt = "";
document.body.appendChild(img);
Qué comprobar

El console.log(coffeePhoto) muestra un texto: la URL de la imagen, no la imagen.
En desarrollo, en Network, la foto importada desde JS tiene como iniciador index.js y el logo, el propio HTML.
npm run build: la foto aparece en dist/assets/coffee-<hash>.jpg.
¿Y el logo? Buscadlo en dist/assets… no está. Abrid dist/index.html y mirad el src del <img>.
Qué responder

¿Dónde ha ido a parar el logo y por qué Vite lo trata distinto que la foto? Pista: buscad assetsInlineLimit en la documentación de Vite. ¿Qué ganamos y qué perdemos con eso?
4 - TypeScript con comprobación de tipos (paso 6)
Qué montar

npm install typescript --save-dev y un tsconfig.json. Podéis partir del del módulo:

{
  "compilerOptions": {
    "esModuleInterop": true,
    "isolatedModules": true,
    "lib": ["ESNext", "DOM"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmit": true,
    "noImplicitReturns": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "target": "ESNext",
    "useDefineForClassFields": true
  },
  "include": ["src"]
}
Renombrad src/index.js → src/index.ts y actualizad el <script> del index.html.

Mirad el editor: os van a salir errores que antes, en JavaScript, no veíais. Arregladlos así:

"Cannot find module './assets/coffee.jpg'…" y otro parecido en el import de main.scss: TypeScript no sabe qué es importar una imagen o un fichero de estilos; eso lo añade Vite. Cread src/vite-env.d.ts con /// <reference types="vite/client" /> y desaparecen los dos.
Si usáis getElementById: "Object is possibly 'null'" (modo estricto, laboratorio 2). Comprobad que existe antes de usarlo, o usad ! si estáis seguros.
Qué comprobar

Meted un error de tipos a propósito (const total: string = 3;). Con npm start, Vite no se queja: ni en la terminal ni en el navegador. Sólo el editor.
Instalad vite-plugin-checker y cread el vite.config.ts con checker({ typescript: true }) (como en el módulo). Volved a arrancar: ahora el error sale en la terminal y en una capa encima de la página.
Con el error todavía puesto, npm run build falla. Quitad el error y volved a construir.
Qué responder

¿Por qué Vite, por sí solo, no comprueba los tipos? ¿Qué gana con ello? (Introducción del módulo: oxc e isolatedModules).
5 - React (paso 7)
React todavía no lo hemos visto a fondo (llega en el siguiente módulo), así que os damos el código. Lo que importa aquí es cómo lo sirve Vite.

Qué montar

npm install react react-dom y npm install @types/react @types/react-dom --save-dev.
En el tsconfig.json, añadid "jsx": "react-jsx" y "verbatimModuleSyntax": true.
En el index.html, un <div id="root"></div> debajo de la cabecera, y el <script> apuntando a /src/index.tsx.
Renombrad index.ts → index.tsx y cread estos ficheros:
./src/data.ts

export interface Coffee {
  id: number;
  name: string;
  origin: string;
  price: number;
}

export const coffees: Coffee[] = [
  { id: 1, name: "Etiopía Yirgacheffe", origin: "Etiopía", price: 14.9 },
  { id: 2, name: "Colombia Huila", origin: "Colombia", price: 12.9 },
  { id: 3, name: "Brasil Cerrado", origin: "Brasil", price: 10.5 },
];
./src/app.tsx

import { useState } from "react";
import { coffees, type Coffee } from "./data";
import coffeePhoto from "./assets/coffee.jpg";

export const App = () => {
  const [cart, setCart] = useState<Coffee[]>([]);

  return (
    <main>
      <h2>Cafés del mes</h2>
      <img src={coffeePhoto} alt="" />
      <ul>
        {coffees.map((coffee) => (
          <li key={coffee.id}>
            <h3>{coffee.name}</h3>
            <p>{coffee.price.toFixed(2)} €</p>
            <button onClick={() => setCart((prev) => [...prev, coffee])}>Añadir</button>
          </li>
        ))}
      </ul>
      <p>Bolsas en el carrito: {cart.length}</p>
    </main>
  );
};
./src/index.tsx

import { createRoot } from "react-dom/client";
import { App } from "./app";
import "./styles/main.scss";

createRoot(document.getElementById("root")!).render(<App />);
¿Os suena [...prev, coffee]? Es el spread del laboratorio 2: React necesita que no mutéis el estado, sino que creéis uno nuevo.

Qué comprobar

La página muestra los tres cafés. No hemos instalado ningún plugin para el JSX: Vite lo transforma de serie.
En Network, react.js y react-dom_client.js vienen de /node_modules/.vite/deps/ con un ?v=<hash>. Mirad su cabecera Cache-Control: max-age=31536000, immutable (un año). Pulsad F5: ahora salen from disk cache, sin llegar a pedirlas al servidor. Comparadlo con app.tsx, que responde 304.
Añadid 3 bolsas al carrito, cambiad el texto del <h2> y guardad: el carrito vuelve a 0, se ha recargado la página entera.
Instalad @vitejs/plugin-react y añadidlo al vite.config.ts. Repetid la prueba: ahora el título cambia y el carrito conserva sus 3 bolsas.
Qué responder

¿Por qué Vite trata distinto a react (dependencia) y a app.tsx (vuestro código)? ¿Qué es el pre-bundling y qué problema resuelve?
¿Qué aporta exactamente @vitejs/plugin-react si el JSX ya funcionaba sin él?
6 - Variables de entorno (paso 8)
Qué montar

Un .env en la raíz. Empezad a propósito sin prefijo:

SHOP_NAME=Tueste (desarrollo)
Haced console.log(import.meta.env) en app.tsx y buscad SHOP_NAME… No está. Añadid el prefijo VITE_ y comprobad que aparece (desplegad el objeto en la consola: la vista previa sólo enseña las primeras propiedades).

El .env final, con tres variables:

VITE_SHOP_NAME=Tueste (desarrollo)
VITE_API_BASE=http://localhost:3000
VITE_SHOW_OFFERS=true
Declaradlas en src/vite-env.d.ts (ImportMetaEnv) y activad strictImportMetaEnv (como en el módulo).

Un src/env.constants.ts que las lea en un único sitio y convierta VITE_SHOW_OFFERS en un booleano de verdad.

En app.tsx: el nombre de la tienda como título, un banner "Envío gratis este mes" sólo si SHOW_OFFERS es true, y la API_BASE en un texto pequeño al final.

Un .env.production con otros valores: Tueste, https://api.tueste.example y false.

Qué comprobar

Con npm start: "Tueste (desarrollo)", el banner y localhost:3000.
Con npm run build + npm run preview: "Tueste", sin banner y la URL de producción.
Escribid mal el nombre de una variable en env.constants.ts (VITE_SHOP_NAM): TypeScript da error gracias a strictImportMetaEnv.
Buscad api.tueste.example en dist/assets/index-<hash>.js: el valor está escrito tal cual en el código.
Buscad ahora Envío gratis en ese mismo fichero. ¿Está, aunque en producción VITE_SHOW_OFFERS sea false?
Qué responder

¿Por qué Vite obliga a usar el prefijo VITE_?
Si mañana cambia la URL de la API de producción, ¿basta con editar .env.production en el servidor? ¿Por qué nunca debe ir una clave secreta en una variable VITE_?
Según la comprobación 5: ¿un feature flag desactivado sirve para "esconder" algo a los usuarios?
7 - README + bitácora de IA
El README.md del repo tiene que incluir:

Cómo arrancarlo: npm install y una tabla con los scripts (start, build, preview) y para qué sirve cada uno.
Las respuestas de los obligatorios 1 a 6 (y de los opcionales que hagáis).
Capturas: el 304 del 1, la cabecera Cache-Control del 5 y la página en preview con los valores de producción del 6.
La salida final de npm run build (la tabla con los ficheros y sus tamaños), pegada en un bloque de código.
Checklist de obligatorios y opcionales hechos.
Bitácora de IA: qué herramienta(s) habéis usado y al menos 3 ejemplos con este formato:
### Prompt

"¿Cómo leo una variable de entorno en mi proyecto de React?"

### Qué me dio

process.env.REACT_APP_API_URL, que es de Create React App (webpack), no de Vite.

### Qué corregí y por qué

En Vite es import.meta.env.VITE_API_URL: sólo expone las variables con prefijo VITE_.
Lo interesante de la bitácora no es que la IA lo hiciera bien, sino lo que tuvisteis que arreglar. Con las herramientas de build hay mucho material: la IA ha aprendido de años de webpack, Create React App y versiones antiguas de Vite.

Parte 2 · Opcionales
Opcional 1 - Tailwind (paso 9)
Qué montar

npm install tailwindcss y npm install @tailwindcss/vite --save-dev, y el plugin en el vite.config.ts.
Un src/styles.css con @import "tailwindcss";, importado en index.tsx antes de main.scss.
Dad estilo al catálogo con clases de Tailwind: las tarjetas en una rejilla (grid sm:grid-cols-3 gap-4), con borde, sombra y botón de color. La cabecera se queda con Sass: así comprobáis que las dos cosas conviven.
Recordad lo del laboratorio 1: estamos en Tailwind v4. Nada de tailwind.config.js ni de @tailwind base;.

Qué comprobar

En dist/assets/index-<hash>.css está el CSS de las clases que sí usáis (buscad una, por ejemplo grid-cols-3).
Buscad una clase que no uséis en ningún sitio (por ejemplo bg-pink-500): no está. Ojo: Tailwind también lee el README.md; si escribís ahí el nombre de la clase, acabará en el CSS.
Las reglas de .brand-header (Sass) están en el mismo fichero CSS.
Qué responder

Tailwind tiene miles de clases. ¿Cómo sabe cuáles meter en el CSS final?
Opcional 2 - Code splitting y análisis del bundle (pasos 10 y 11)
Carga bajo demanda
Qué montar

Dos módulos que sólo se necesitan cuando el usuario pulsa un botón:

./src/cart.ts

import type { Coffee } from "./data";

export const cartTotal = (items: Coffee[]): number =>
  items.reduce((sum, coffee) => sum + coffee.price, 0);
./src/shipping.ts

export const shippingCost = (total: number): number => (total >= 30 ? 0 : 3.9);
En app.tsx, un botón "Calcular total" que los cargue con import() dinámico y muestre el resultado:

const [message, setMessage] = useState("");

const calculateTotal = async () => {
  const { cartTotal } = await import("./cart");
  const { shippingCost } = await import("./shipping");
  const total = cartTotal(cart);
  setMessage(`Total: ${total.toFixed(2)} € + envío ${shippingCost(total).toFixed(2)} €`);
};
(y en el JSX: <button onClick={calculateTotal}>Calcular total</button> y <p>{message}</p>).

¿Habéis hecho el carrito inmutable del laboratorio 2? Podéis traeros vuestras funciones a cart.ts en lugar de la de ejemplo.

Qué comprobar

npm run build: además de index-<hash>.js, aparecen cart-<hash>.js y shipping-<hash>.js. Fijaos en el tamaño de cada uno en la salida de la terminal.
Con npm run preview y Network abierto: al cargar la página, cart y shipping no se descargan. Al pulsar el botón, sí. Al pulsarlo otra vez, no se vuelven a pedir.
Qué responder

Cambiad uno de los dos a un import normal al principio de app.tsx y volved a construir. ¿Qué pasa con su chunk? ¿Por qué? (Dejadlo después como estaba).
En un proyecto real, ¿qué partes de una tienda cargaríais así?
Análisis del bundle
Qué montar

npm install vite-bundle-analyzer --save-dev y el plugin en modo estático, para que genere un informe en HTML sin levantar un servidor:

analyzer({ analyzerMode: "static", openAnalyzer: false, fileName: "bundle-report" }),
npm install loglevel y usadlo en los dos módulos perezosos (cart.ts y shipping.ts), por ejemplo:

import log from "loglevel";

log.warn("*** Cargado el chunk del carrito");
Qué comprobar

npm run build genera dist/bundle-report.html (y, de paso, ficheros .map: con el analizador se activan los sourcemaps, no os asustéis por los tamaños de la terminal). Abridlo en el navegador: cada rectángulo es un módulo, de tamaño proporcional a lo que ocupa.
En la terminal aparece un chunk nuevo, loglevel-<hash>.js: Vite no lo ha duplicado dentro de cart y de shipping, lo ha sacado aparte para compartirlo.
Al pulsar "Calcular total" en preview, se descargan tres ficheros: cart, shipping y loglevel.
Qué responder

¿Qué es lo que más ocupa del chunk principal? Haced una captura del informe.
¿Por qué Vite saca loglevel a un fichero aparte en lugar de copiarlo dentro de cada chunk?
El informe se genera dentro de dist, así que se subiría a producción con el resto. En un proyecto real, el analizador se activa sólo cuando se necesita.

Cómo sacarle partido a la IA (sin que os la cuele)
Dadle contexto. Con las herramientas de build, la versión lo es todo:

Estoy con Vite 8 (usa Rolldown y Oxc, no esbuild ni Rollup), TypeScript 7,
React 19 y Tailwind CSS 4 con el plugin @tailwindcss/vite. El proyecto NO
está creado con create-vite: tengo mi propio vite.config.ts con estos plugins:
vite-plugin-checker, @vitejs/plugin-react y @tailwindcss/vite.

Quiero añadir variables de entorno distintas para desarrollo y producción,
tipadas y con strictImportMetaEnv. Explícame cada fichero que haya que crear.
Pedidle que os explique, no sólo que haga: "¿qué hace exactamente este plugin?", "¿esto se ejecuta en desarrollo, en el build o en los dos?", "¿esta opción existe en Vite 8 o es de una versión anterior?".

Revisad siempre esta lista, porque es lo que la IA suele hacer mal:

Lo que suele hacer	Qué hacer
process.env.REACT_APP_X (Create React App / webpack)	import.meta.env.VITE_X
Poner claves de API "secretas" en variables VITE_	Nada secreto en el front: todo VITE_ acaba en el JS descargable
Proponer webpack, react-scripts o Create React App	Estamos con Vite: CRA está abandonado
Opciones de esbuild o build.rollupOptions de Vite 7 o anterior	Comprobad en la documentación de Vite que siguen en Vite 8
/// <reference path="vite/client" />	/// <reference types="vite/client" />, y el fichero dentro de src
tailwind.config.js y @tailwind base; (Tailwind v3)	@import "tailwindcss"; + plugin @tailwindcss/vite
@import "variables"; en Sass	@use "variables" as *;
Instalar sass + node-sass + un loader	Sólo sass-embedded: Vite ya sabe usarlo
Añadir tsc && al script de build y vite-plugin-checker	Una de las dos: que no se compruebe lo mismo dos veces sin saber por qué
Enlazar CSS de node_modules con <link href="/node_modules/...">	Funciona, pero lo normal es importarlo desde JS/TS: import "bootstrap/dist/css/bootstrap.css";
Usad DevTools y la carpeta dist como en el módulo: si algo no se comporta como esperáis, mirad qué petición se hace, qué devuelve y qué hay de verdad en el fichero generado.

Entrega
Repositorio público en GitHub (o privado dando acceso a los profesores), con un commit por obligatorio si puede ser.
En la raíz: el proyecto + el README.md del obligatorio 7.
Capturas en una carpeta docs/ o screenshots/.
En el portal academia.lemoncode.net id a los laboratorios del módulo 3 y pegad el enlace a vuestro repo.
No subáis node_modules ni dist. Como esta vez no usáis la plantilla de Vite, el .gitignore lo tenéis que crear vosotros. Y pensad si los ficheros .env deben ir o no en el repositorio (pista: depende de lo que contengan; el .env.local, nunca).

Evaluación
Bloque	Peso
Obligatorios 1 a 6 (el proyecto funciona en start y en build)	60 %
README: respuestas, capturas y bitácora de IA (obligatorio 7)	20 %
Opcionales 1 y 2	15 %
Configuración limpia: sin dependencias ni opciones que sobren	5 %
Para aprobar: todos los obligatorios hechos, npm run build sin errores y las respuestas contestadas.

En la revisión podemos pediros que expliquéis una línea de vuestro vite.config.ts o que hagáis un cambio pequeño en directo (p. ej. "añade una variable de entorno nueva y úsala" o "quita el plugin de React y explica qué deja de funcionar"). Es la forma de comprobar que la configuración es vuestra, la haya escrito quien la haya escrito.

Recursos
Los apuntes del módulo: 03-bundling. Cada obligatorio indica en qué paso está.
Documentación de Vite, en especial Features, Static Asset Handling y Env Variables and Modes.
Por qué Vite: la misma idea que la introducción del módulo, contada por sus autores.
Awesome Vite: el catálogo de plugins.
Tailwind con Vite.
¡A empaquetar!