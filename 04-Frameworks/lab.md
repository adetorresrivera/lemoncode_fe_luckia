🧪 Laboratorio · Módulo 04 · React
⏱️ Dedicación estimada: 8-12 h para los obligatorios; los opcionales y desafíos, lo que queráis estirar. 📦 Formato: enlace a un repositorio de GitHub

La idea
En el módulo hemos pasado de actualizar el DOM a mano a describir la interfaz con componentes y estado. Después hemos visto los hooks, hemos montado una aplicación con rutas y un formulario validado y, por último, la hemos organizado en escenas y pods.

En este laboratorio vais a recorrer el mismo camino con un ejemplo distinto: el catálogo de Tueste, el tostadero de café de los laboratorios anteriores ☕. En lugar de personas, cafés: una lista con buscador y carrito, el detalle de cada café, un formulario para dar de alta cafés nuevos y otro para editarlos.

Cada obligatorio sigue el mismo esquema que en el laboratorio de bundling:

🛠️ Qué hacer: lo que hay que construir. Indica en qué sesión y paso del módulo tenéis el ejemplo equivalente.
🔎 Qué comprobar: lo que tiene que pasar en el navegador. Si pasa, el obligatorio está hecho.
📝 Qué responder: una o dos preguntas para el README. Con dos o tres frases basta.
La regla del juego (la de siempre):

✅ La IA está permitida y recomendada.
⚠️ Pero tenéis que entender cada componente y cada hook que entregáis. Si en la revisión os preguntamos "¿por qué este dato no es un estado?" o "¿qué limpia este efecto?", tenéis que saber responder.
Punto de partida
Necesitáis Node.js 22.12 o superior.

Partid de una copia de la demo 01-de-javascript-a-react/demos/02-react del módulo: ya trae Vite, TypeScript, React y Tailwind configurados (lo que montasteis a mano en el laboratorio 3).

# Copiad la carpeta 02-react a vuestro repositorio, con el nombre que queráis
cd lab-react
npm install
npm start
Cambiad el name del package.json y el <title> del index.html.
Vaciad src/app.tsx: empezáis vosotros.
Recomendado: un commit por obligatorio, como en el laboratorio 3.
💡 La demo trae <StrictMode> en main.tsx. Dejadlo: en desarrollo hace que React ejecute dos veces algunas cosas a propósito (tema 02, "Montaje, actualización y desmontaje"). Si veis un console.log repetido, no es un error vuestro.

Los datos de partida
A partir de O3 los cafés se leen de un JSON. Creadlo ya:

./public/coffees.json

[
  {
    "id": 1,
    "name": "Etiopía Yirgacheffe",
    "origin": "Etiopía",
    "roast": "light",
    "price": 14.9,
    "notes": "Floral, bergamota y té negro."
  },
  {
    "id": 2,
    "name": "Colombia Huila",
    "origin": "Colombia",
    "roast": "medium",
    "price": 12.9,
    "notes": "Caramelo y manzana roja."
  },
  {
    "id": 3,
    "name": "Kenia AA",
    "origin": "Kenia",
    "roast": "light",
    "price": 15.5,
    "notes": "Frutos rojos y pomelo."
  },
  {
    "id": 4,
    "name": "Brasil Cerrado",
    "origin": "Brasil",
    "roast": "dark",
    "price": 10.5,
    "notes": "Chocolate y avellana."
  },
  {
    "id": 5,
    "name": "Guatemala Antigua",
    "origin": "Guatemala",
    "roast": "medium",
    "price": 13.2,
    "notes": "Cacao y especias."
  },
  {
    "id": 6,
    "name": "Sumatra Mandheling",
    "origin": "Indonesia",
    "roast": "dark",
    "price": 13.9,
    "notes": "Tierra, cedro y chocolate negro."
  }
]
Y el modelo (lo vais a usar desde el primer obligatorio):

./src/model.ts

export type Roast = "light" | "medium" | "dark";

export interface Coffee {
  id: number;
  name: string;
  origin: string;
  roast: Roast;
  price: number;
  notes: string;
}

export type CoffeeInput = Omit<Coffee, "id">;
Reglas para todo el laboratorio
✅ Componentes como funciones, con las props tipadas.
✅ El estado nunca se muta: nada de push, splice ni cafe.price = …. Spread, map y filter (laboratorio 2).
✅ Lo que se puede calcular no es estado: el total del carrito o la lista filtrada se calculan durante el render.
✅ Cada .map que pinte una lista lleva su key.
✅ npm run build sin errores (el script ya comprueba los tipos con tsc).
✅ Parte 1 · Obligatorios
Todos son necesarios para aprobar. Id en orden: cada uno parte del anterior.

Bloque 1 · Componentes, props y estado (sesión 01)
O1 · El catálogo con componentes
🛠️ Qué hacer

En app.tsx, un array coffees: Coffee[] con tres cafés escritos a mano (copiadlos del JSON).
Un componente CoffeeCard que reciba un café por props y muestre su nombre, su origen y su precio con dos decimales.
App pinta un título, una frase con el número de cafés ("3 cafés este mes") y la lista de tarjetas con map.
Dadle estilo con Tailwind: las tarjetas en una rejilla (grid sm:grid-cols-2 gap-4), con fondo, borde o sombra.
🔎 Qué comprobar

Se ven las tres tarjetas y la frase dice "3 cafés".
Añadid un cuarto café al array y guardad: aparece la tarjeta y cambia el número. Ese número no lo habéis tocado.
Quitad la key del map y mirad la consola del navegador. Volved a ponerla.
📝 Qué responder

¿Qué aviso da React sin key y para qué la necesita? ¿Por qué usáis coffee.id y no el índice del map?
O2 · Un carrito con estado y eventos
🛠️ Qué hacer

Un estado cart con los cafés añadidos: useState<Coffee[]>([]).
Cada CoffeeCard tiene un botón "Añadir al carrito". El estado vive en App, así que la tarjeta recibe una función por props (onAdd) y la llama con su café (tema 01, "Vamos a añadir también Eliminar").
Un resumen del carrito: "N bolsas · total €" y un botón "Vaciar" que se desactiva cuando el carrito está vacío.
Un buscador: un input controlado (value + onChange) que filtra las tarjetas por nombre. Si no hay coincidencias, "Sin resultados".
🔎 Qué comprobar

Añadid tres bolsas: el contador y el total cambian. Vaciad: vuelven a 0 y el botón se desactiva.
Escribid "ken" en el buscador: sólo queda Kenia. Escribid "zzz": "Sin resultados".
Revisad vuestro código: tenéis dos estados (cart y el texto del buscador). Ni el total, ni el número de bolsas, ni la lista filtrada son estados.
📝 Qué responder

¿Por qué escribís onAdd={addToCart} y no onAdd={addToCart()}?
¿Por qué el total del carrito no necesita su propio useState? ¿Qué problema podríais tener si lo fuera?
Bloque 2 · Hooks (sesión 02)
O3 · Cargar los cafés con useEffect
🛠️ Qué hacer

Quitad el array escrito a mano. Ahora los cafés se piden a /coffees.json con fetch dentro de un useEffect.
Tres estados para la petición: coffees, loading y error.
Comprobad response.ok: un error HTTP no hace fallar a fetch por sí solo.
La pantalla muestra "Cargando…", el error o la lista, según toque.
🔎 Qué comprobar

Con Network abierto, desactivad la caché y elegid una conexión lenta (Slow 4G o 3G): se ve "Cargando…" antes de la lista.
Bloquead coffees.json en Network (botón derecho → Block request URL) y recargad: sale vuestro mensaje de error. Desbloqueadlo.
Buscad "zzz": "Sin resultados". Vacío no es lo mismo que error.
📝 Qué responder

¿Por qué la petición va dentro de un useEffect y no directamente en el cuerpo del componente? ¿Qué significa el [] del final?
O4 · Un custom hook y una ref
🛠️ Qué hacer

Moved los tres estados y el efecto a src/use-coffees.ts, en un hook useCoffees() que devuelva { coffees, loading, error } (tema 02, paso 5).
En el componente sólo queda: const { coffees, loading, error } = useCoffees();
Un botón "Buscar" junto al título que lleve el foco al input del buscador con useRef (tema 02, paso 6).
🔎 Qué comprobar

Todo sigue funcionando igual que en O3: el componente es más corto y no ha cambiado su comportamiento.
Pulsad "Buscar" y escribid directamente: el foco está en el campo.
📝 Qué responder

Si dos componentes distintos llaman a useCoffees(), ¿comparten los mismos datos o cada uno tiene los suyos? ¿Cuántas peticiones se hacen?
¿Por qué el foco se hace con una ref y no con un estado?
Bloque 3 · Una aplicación con rutas y formularios (sesión 03)
O5 · Lista y detalle con TanStack Router
🛠️ Qué hacer

Seguid los pasos 0-4 de la sesión 03:

Instalad @tanstack/react-router y, para desarrollo, @tanstack/router-plugin. Añadid el plugin a vite.config.ts antes del de React.

Las rutas, con archivos:

src/routes/
  __root.tsx           marco común: nombre de la tienda, navegación y <Outlet />
  index.tsx            "/" redirige a "/coffees"
  coffees/
    index.tsx          "/coffees": el catálogo de O4
    $coffeeId.tsx      "/coffees/1", "/coffees/2"…: el detalle de un café
Registrad el router con declare module ... Register (paso 2) y montadlo en main.tsx.

El nombre de cada tarjeta pasa a ser un <Link to="/coffees/$coffeeId" params={…}>.

El detalle muestra todos los datos del café (también el tueste y las notas de cata) y un enlace para volver. Para leerlo, un segundo hook useCoffee(id), igual que useCoffees pero que depende de [id].

Una ruta desconocida muestra "Página no encontrada", y un café que no existe, "Café no encontrado".

Cambiad el script de build a "vite build && tsc --noEmit": el plugin genera routeTree.gen.ts al construir, y tsc lo necesita (tema 03, "Cerramos el recorrido").

💡 Cread src/api.ts con getCoffees y getCoffee adaptando el api.ts de la demo 03-aplicacion/demos/01-rutas (cambiad personas por cafés y /members.json por /coffees.json), y que vuestros hooks lo usen.

🔎 Qué comprobar

Pulsad un café: la URL cambia a /coffees/3 y se ve su detalle. Atrás y Adelante del navegador funcionan.
Escribid directamente /coffees/4 en la barra y recargad: se abre ese café.
/coffees/999 → "Café no encontrado". /teteras → "Página no encontrada".
En el Link, escribid mal el parámetro (coffeeID): TypeScript da error. Corregidlo.
Añadid dos bolsas al carrito, entrad en un detalle y volved al catálogo. 🤔 ¿Qué ha pasado con el carrito?
📝 Qué responder

¿Qué ganamos con una URL por pantalla frente a mostrar el detalle con un booleano en el estado?
Según la comprobación 5: ¿por qué se ha vaciado el carrito? (tema 02, "Montaje, actualización y desmontaje"). ¿Dónde tendría que vivir ese estado para no perderse? (Arreglarlo es el opcional P1).
O6 · Alta de cafés con TanStack Form y Zod
🛠️ Qué hacer

Seguid los pasos 5-8 de la sesión 03:

Una ruta nueva coffees/new.tsx y un enlace "Añadir café" en la navegación.

Instalad @tanstack/react-form y zod. Un src/coffee.schema.ts con estas reglas:

Campo	Regla
name	Texto, sin espacios a los lados, al menos 2 caracteres
origin	Texto, sin espacios a los lados, al menos 2 caracteres
roast	Sólo "light", "medium" o "dark" (z.enum)
price	Número mayor que 0 (y, si queréis, un máximo razonable)
notes	Texto, como mucho 120 caracteres (puede ir vacío)
Un componente CoffeeForm con useForm, validado con el esquema en onChange y onSubmit. Partid del member-form.tsx de la demo 03-formulario. Cada campo con su <label> y su mensaje de error.

Dos campos son distintos de los de la demo:

El tueste es un <select> con las tres opciones.
El precio es un <input type="number">. Su valor en el formulario tiene que ser un número, no un texto: usad event.target.valueAsNumber en el onChange.
Al guardar, se navega al detalle del café nuevo.

Para guardar, ampliad vuestro api.ts con el saveCoffee de la demo (guarda en localStorage).

🔎 Qué comprobar

Enviad el formulario vacío: salen los errores y no se navega.
Un nombre con sólo espacios no vale. Un precio de 0 o negativo, tampoco.
Con datos válidos, se abre el detalle del café nuevo y el café aparece en el catálogo.
Recargad la página: el café sigue ahí. En DevTools → Application → Local Storage veréis vuestra clave. Borradla y recargad: vuelven los 6 cafés iniciales.
Mientras se guarda, el botón está desactivado.
📝 Qué responder

Ya teníais la interfaz Coffee en TypeScript. ¿Para qué hace falta además un esquema de Zod?
¿Por qué el precio necesita valueAsNumber? ¿Qué pasaría con el esquema si llegase como texto?
Bloque 4 · Arquitectura (sesión 04)
O7 · Edición y organización en pods
🛠️ Qué hacer

Dos cosas a la vez, como en la sesión 04:

1. Editar un café. Una ruta /coffees/$coffeeId/edit y un enlace "Editar café" en el detalle. Se reutiliza el mismo formulario de O6, que ahora recibe unos valores iniciales opcionales. Al guardar se conserva el id: editar no crea un café nuevo.

2. Reorganizar el código siguiendo el mapa de la demo 04-arquitectura/demos/01-pods:

src/
  routes/                  sólo navegación: leen parámetros y pintan una escena
    coffees/
      index.tsx
      new.tsx
      $coffeeId/
        index.tsx          (antes era $coffeeId.tsx)
        edit.tsx
  core/
    router/router.ts       crear y registrar el router
    coffees/               lo que comparten los dos pods
      model.ts
      coffee.schema.ts
      api.ts
      hooks.ts
  layouts/app-layout.tsx   navegación + <Outlet />
  scenes/                  componen una pantalla y deciden adónde navegar
  pods/
    catalogo/              lista, buscador, carrito y detalle
    edicion/               formulario de alta y edición
  common/components/       mensajes de carga y error
Las reglas:

Cada pod tiene container (pide los datos y decide qué mostrar) y component (recibe props y pinta).
Cada pod tiene un index.ts con lo que exporta. Las escenas importan sólo de ahí.
Ningún pod importa al otro. El catálogo enlaza a la edición con un Link, no importando su formulario.
El formulario no sabe adónde ir después de guardar: recibe un onSaved de la escena.
🔎 Qué comprobar

Entrad en un café, pulsad "Editar": los campos ya tienen sus valores.
Cambiad el precio, guardad: volvéis al detalle con el precio nuevo. En el catálogo el café aparece una sola vez.
Recargad: el cambio se conserva.
/coffees/999/edit → "Café no encontrado".
Cambiad la regla del nombre en coffee.schema.ts (por ejemplo, mínimo 4 caracteres): el alta y la edición la aplican a la vez. Dejadla como estaba.
Buscad en pods/catalogo algún import de pods/edicion: no tiene que haber ninguno.
📝 Qué responder

Imaginad estos tres cambios: el diseño de la tarjeta de café, la regla de validación del precio y adónde se va después de guardar. ¿En qué fichero haríais cada uno?
¿Qué ventaja tiene separar el container del component? ¿Lo haríais en todos los componentes?
O8 · README + bitácora de IA
El README.md del repo tiene que incluir:

Cómo arrancarlo: npm install, npm start y npm run build.
Un mapa de la aplicación: las rutas que hay y qué muestra cada una.
Las respuestas 📝 de O1 a O7.
Capturas: el catálogo con el carrito, el detalle, el formulario mostrando errores y la pantalla de "Cargando…" o de error.
Checklist de obligatorios / opcionales / desafíos hechos.
🤖 Bitácora de IA: qué herramienta(s) habéis usado y al menos 3 ejemplos con este formato:
### Prompt

"Añade un total del carrito que se actualice cuando añado cafés"

### Qué me dio

Un useState para el total y un useEffect que lo recalculaba cada vez que cambiaba el carrito.

### Qué corregí y por qué

Lo quité: el total se calcula durante el render con reduce. Con el efecto se pintaba
primero el total antiguo y había dos estados que podían no coincidir.
💡 Lo interesante de la bitácora no es que la IA lo hiciera bien, sino lo que tuvisteis que arreglar. En React hay mucho material: la IA ha aprendido de años de componentes de clase, Create React App y React Router.

⭐ Parte 2 · Opcionales
Suben nota. Haced los que más os apetezcan (recomendamos al menos 3).

P1 · Un carrito que no se pierde
Arreglad lo que visteis en O5: que el carrito sobreviva al navegar. Subid el estado a un sitio que no se desmonte (el layout) y hacedlo llegar a quien lo necesite con Context (createContext + un hook useCart()). Mostrad el número de bolsas en la navegación, visible desde cualquier pantalla. Explicad en el README por qué el módulo no usaba Context y vosotros sí. (Documentación de React).

P2 · Y que sobreviva también a recargar
Guardad el carrito en localStorage: leedlo al iniciar el estado (useState(() => …)) y guardadlo con un useEffect cuando cambie. Explicad por qué la lectura va en la inicialización y la escritura en un efecto.

P3 · Una cuenta atrás para la oferta ⏱️
Un banner "🎉 Envío gratis: quedan MM:SS" con un setInterval dentro de un useEffect que se limpie (tema 02, paso 2). Un botón "Ocultar oferta" lo desmonta. Comprobad que, al montarlo y desmontarlo varias veces, la cuenta no va cada vez más rápido. Explicad qué pasaría sin la limpieza.

P4 · Filtros que viven en la URL
Además del buscador, un filtro por tueste (claro / medio / oscuro). Guardad los dos en la URL como search params (/coffees?roast=dark&q=bra) con la validación de búsqueda de TanStack Router. Así un enlace compartido abre el catálogo ya filtrado. (Documentación).

P5 · Memorizar… con cabeza
Generad un catálogo de prueba de 2.000 cafés y repetid la experiencia de la demo 02-memorizacion: console.count en el filtrado, un cambio de estado que no tenga nada que ver y useMemo. Contad en el README qué medisteis, si mejoró algo y por qué no hay que memorizarlo todo.

P6 · CSS Modules
Rehaced la tarjeta de café con un coffee-card.module.css en lugar de Tailwind (tema 03, "Solo si hay tiempo"). Mirad en DevTools el nombre de clase que genera Vite. Comparad en el README los dos enfoques: dónde editáis el aspecto en cada caso.

P7 · Eliminar un café
Un botón "Eliminar" en el detalle que pida confirmación y lo quite del catálogo. Pensad dónde va cada pieza: ¿en qué pod? ¿quién decide adónde navegar después? ¿cómo lo guardáis en localStorage si el café venía del JSON inicial?

🔥 Parte 3 · Desafíos
Para quien quiera sufrir un poco (y aprender mucho). Cada uno cuenta como un plus importante.

D1 · Una búsqueda con debounce
Haced que el buscador pida los datos al servidor en cada búsqueda (como en el paso 3 de la sesión 02), pero esperando 300 ms desde la última tecla. Tenéis que limpiar dos cosas: el temporizador y la petición anterior. Comprobadlo en Network con una conexión lenta: sólo debe quedar la última petición.

D2 · React Compiler
Activad React Compiler en el proyecto (tema 02, "¿Y React Compiler?": oxc-transform-react y react({ compiler: true })). Repetid la medición de P5 con y sin él y contad qué cambia. Explicad qué no arregla el Compiler.

D3 · Un contrato de API distinto
Simulad que el servidor cambia: el JSON pasa a enviar coffee_name y price_cents (el precio en céntimos, entero). Escribid un modelo de API y un mapper en core/coffees (tema 04, "Si queda tiempo") para que nada fuera de core tenga que cambiar. Demostradlo: ningún componente modificado.

D4 · Tests de componentes
Instalad Vitest y Testing Library y probad, como mínimo:

Que CoffeeCard muestra el nombre y el precio con dos decimales.
Que el formulario muestra un error con un nombre de un carácter y no llama a onSave.
Buscad los elementos como lo haría una persona (getByRole, getByLabelText), no por clases.

D5 · Hacia TanStack Start
La siguiente sesión del curso es TanStack Start. Leed su documentación y, en el README, explicad qué partes de vuestra aplicación cambiarían: ¿qué pasaría con useCoffees y el useEffect si los datos se cargasen con un loader de la ruta? Si os atrevéis, migrad la carga del detalle a un loader de TanStack Router.

🤖 Cómo sacarle partido a la IA (sin que os la cuele)
Dadle contexto. React ha cambiado mucho y la IA mezcla épocas:

Estoy con React 19, TypeScript 7 en modo estricto, Vite 8 y Tailwind 4.
Uso TanStack Router con rutas por archivos (plugin de Vite) y TanStack Form
con Zod 4 (Standard Schema, sin adaptador). Componentes como funciones.

Tengo este modelo: [pegad model.ts]. Hazme el campo de precio del formulario:
input type="number", el valor en el formulario tiene que ser un número,
con su label y sus errores enlazados con aria-describedby.
Pedidle que os explique, no sólo que haga: "¿por qué esto es un estado y no un cálculo?", "¿cuándo se ejecuta este efecto y qué limpia?", "¿esto se vuelve a ejecutar en cada render?".

Revisad siempre esta lista, porque es lo que la IA suele hacer mal:

❌ Lo que suele hacer	✅ Qué hacer
Componentes de clase (class extends React.Component, this.setState)	Componentes función y hooks
React Router (react-router-dom, <BrowserRouter>, useParams())	TanStack Router: createFileRoute, Route.useParams(), Link tipado
Escribir o "arreglar" routeTree.gen.ts a mano	Lo genera el plugin: no se toca
Un useState + useEffect para datos derivados (total, lista filtrada)	Calcularlos durante el render
cart.push(coffee); setCart(cart)	setCart(previous => [...previous, coffee])
key={index} en listas que cambian	key={coffee.id}
useEffect sin limpieza para intervalos o peticiones	Devolver la función que limpia: clearInterval, controller.abort()
Llamar a un hook dentro de un if o después de un return	Hooks siempre arriba, antes de los returns condicionales
useMemo y useCallback en todas partes "por rendimiento"	Sólo cuando se ha medido un problema y hay alguien que lo aprovecha
@hookform/resolvers o zodValidator para conectar Zod	TanStack Form acepta el esquema de Zod 4 directamente
onClick={addToCart(coffee)}	onClick={() => addToCart(coffee)}
Usad las React DevTools (extensión del navegador): la pestaña Components muestra el árbol, las props y el estado de cada componente. Es la forma más rápida de ver dónde vive cada dato.

📬 Entrega
Repositorio público en GitHub (o privado dando acceso a los profesores), con un commit por obligatorio si puede ser.
En la raíz: el proyecto + el README.md de O8.
Capturas en una carpeta docs/ o screenshots/.
En el portal academia.lemoncode.net id a los laboratorios del módulo 4 y pegad el enlace a vuestro repo.
✋ No subáis node_modules ni dist (el .gitignore de la demo ya los excluye).

📊 Evaluación
Bloque	Peso
Obligatorios O1-O7 (la aplicación funciona y build sin errores)	50 %
README: respuestas, capturas y bitácora de IA (O8)	10 %
Opcionales (P1-P7)	20 %
Desafíos (D1-D5)	15 %
Acabado: que se vea bien y sea accesible (labels, foco, errores) ✨	5 %
Para aprobar: todos los obligatorios hechos, las comprobaciones 🔎 funcionando y npm run build sin errores.

En la revisión podemos pediros que expliquéis un componente o que hagáis un cambio pequeño en directo (p. ej. "añade el campo de tueste a la tarjeta", "que el carrito no deje añadir un café agotado" o "añade una regla al esquema"). Es la forma de comprobar que el código es vuestro, lo haya escrito quien lo haya escrito.

📚 Recursos
Los apuntes del módulo: 04-framework-react. Cada obligatorio indica la sesión y el paso.
React en español: sobre todo Pensar en React, Elegir la estructura del estado y Quizás no necesites un Effect.
TanStack Router y rutas por archivos.
TanStack Form: validación y Zod.
React DevTools.
Material complementario: React en el máster de Lemoncode.
¡A tostar componentes! ☕⚛️