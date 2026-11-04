🧪 Laboratorio · Módulo 05 · API REST
⏱️ Dedicación estimada: 3-4 h para los obligatorios; los opcionales y desafíos, lo que queráis estirar. 📦 Formato: enlace a un repositorio de GitHub

La idea
En el módulo hemos visto cómo habla el front con un servidor: qué es una API REST, cómo se diseñan sus endpoints, cómo se hacen las peticiones (de XMLHttpRequest a axios y fetch), qué es CORS y cómo se gestionan varias peticiones a la vez o se cancelan.

En este laboratorio vais a trabajar contra el mismo servidor de hoteles del módulo (hotels-server). Es un laboratorio corto, con cuatro pasos:

Explorar la API antes de escribir una línea de código del cliente.
Escribir un cliente con fetch que haga el CRUD completo.
Llamar a la API desde otro origen y pelearse con CORS.
Gestionar varias peticiones: en paralelo, con fallos y canceladas.
Cada obligatorio sigue el esquema de los laboratorios anteriores: 🛠️ qué hacer, 🔎 qué comprobar y 📝 qué responder en el README.

La regla del juego (la de siempre):

✅ La IA está permitida y recomendada.
⚠️ Pero tenéis que entender cada petición que hacéis. Si en la revisión os preguntamos "¿por qué aquí sale un OPTIONS?" o "¿por qué este fetch no ha saltado al catch con un 404?", tenéis que saber responder.
Punto de partida
Copiad a vuestro repositorio las carpetas hotels-server y client de 05-api-rest/.start-code.

Arrancad el servidor en una terminal:

cd hotels-server
npm install
npm run dev
⚠️ Los datos viven en memoria. Cada vez que el servidor se reinicia (también cuando guardáis un fichero suyo, porque usa tsx watch), los hoteles vuelven a ser los 10 iniciales. Para los laboratorios es una ventaja: si rompéis algo, reiniciad.

✅ Parte 1 · Obligatorios
Todos son necesarios para aprobar.

O1 · Explorar la API antes de programar (conceptos 01 y 02)
Antes de escribir el cliente, hay que saber cómo responde de verdad el servidor. Usad curl desde la terminal (o, si lo preferís, una herramienta como Bruno o la extensión Thunder Client de VS Code). Para los POST y PUT, el script .start-code/smoke-api-test.sh del módulo tiene ejemplos.

🛠️ Qué hacer

Rellenad esta tabla en el README, probando cada fila:

Petición	Código de estado	¿Qué devuelve en el cuerpo?
GET /api/hotels sin cabecera Accept		
GET /api/hotels con Accept: application/json		
GET /api/hotels/1		
GET /api/hotels/999		
GET /api/cities		
POST /api/hotels con un hotel en JSON		
PUT /api/hotels/1 cambiando lowRate		
DELETE /api/hotels/1		
GET /api/hotels/1 después de borrarlo		
Por ejemplo:

curl -i -H "Accept: application/json" http://localhost:3000/api/hotels/1
(-i muestra el código de estado y las cabeceras de la respuesta).

🔎 Qué comprobar

Sin Accept: application/json, todas las peticiones a /api fallan. Mirad en hotels-server/src/middleware.ts por qué.
Los datos no vienen sueltos: vienen dentro de { "data": ... }.
Hay al menos dos respuestas que no son las que dice la teoría del módulo. Encontradlas.
📝 Qué responder

¿Qué código debería devolver GET /api/hotels/999 según el concepto 01 ("Common HTTP Response Status Codes")? ¿Qué devuelve este servidor? ¿Qué problema le causa eso al front?
¿Por qué el DELETE no devuelve cuerpo? ¿Qué código lo indica?
El concepto 02 recomienda envolver las respuestas en un objeto ({ "data": ... }). ¿Qué ventaja tiene frente a devolver el array directamente?
O2 · Un cliente con fetch (demo 03)
🛠️ Qué hacer

En client/src, un fichero hotels.api.ts con:

Un modelo con sólo los campos que vais a usar (no hace falta copiar los 30):

export interface Hotel {
  id: string;
  name: string;
  city: string;
  lowRate: number;
  highRate: number;
}

export type NewHotel = Omit<Hotel, "id">;
Una función genérica request<T>(path, options) que concentre lo que se repite en todas las llamadas (la demo 03 lo repetía en cada función):

Añade siempre Accept: application/json, y Content-Type: application/json cuando hay cuerpo.
Si response.ok es false, lanza un error con el método, la URL y el código de estado.
Si la respuesta es un 204, no intenta leer JSON.
Si no, devuelve el data de la respuesta.
Cinco funciones que la usen: getHotels(), getHotel(id), createHotel(hotel), updateHotel(id, changes) y deleteHotel(id).

getHotel devuelve Promise<Hotel | null>: null cuando el hotel no existe (os toca decidir cómo detectarlo, viendo lo que descubristeis en O1).

Para probarlo, en main.ts, un botón "Probar CRUD" que ejecute este recorrido y muestre cada paso con console.log:

console.log("1", (await getHotels()).length);
const created = await createHotel({ name: "Hotel Tueste", city: "Seattle", lowRate: 90, highRate: 120 });
console.log("2", created.name, created.id);
console.log("3", (await getHotel(created.id))?.name);
console.log("4", (await updateHotel(created.id, { lowRate: 95 })).lowRate);
await deleteHotel(created.id);
console.log("5", await getHotel(created.id));
console.log("6", (await getHotels()).length);
Como en las demos, el cliente se construye y lo sirve el propio servidor: npm run build en client y abrid http://localhost:3000.

🔎 Qué comprobar

Con el servidor recién arrancado, la consola muestra:

1 10
2 Hotel Tueste <un identificador largo, generado por el servidor>
3 Hotel Tueste
4 95
5 null
6 10
Y en Network (filtrad por Fetch/XHR):

Hay un GET, un POST (201), otro GET, un PUT, un DELETE (204) y dos GET más.
En el POST, mirad la pestaña Payload: es el JSON que habéis enviado.
Quitad un momento el Accept de request: todas las peticiones fallan con 406 y vuestro error aparece en consola, no un undefined silencioso. Volved a ponerlo.
📝 Qué responder

fetch no lanza un error con un 404 o un 500. ¿Cuándo sí lanza? ¿Qué pasaría en vuestra aplicación si no comprobaseis response.ok?
¿Por qué createHotel no envía el id? ¿Quién lo decide?
O3 · Llamar desde otro origen: CORS (demo 04)
Hasta ahora el cliente y la API estaban en el mismo origen (localhost:3000). En un proyecto real casi nunca es así: el front se desarrolla con Vite en otro puerto, o se publica en otro dominio.

🛠️ Qué hacer

Que la URL base de la API salga de una variable de entorno (laboratorio 3): VITE_API_BASE=http://localhost:3000/api en un .env, leída en hotels.api.ts.

Arrancad el cliente en modo desarrollo: npm run dev en client (puerto 5173). Pulsad "Probar CRUD".

Parad el servidor y volved a arrancarlo con CORS activado:

# macOS / Linux
USE_CORS=yes npm run dev

# Windows (PowerShell)
$env:USE_CORS="yes"; npm run dev
Volved a pulsar "Probar CRUD".

🔎 Qué comprobar

Sin CORS (paso 2): la consola muestra un error que empieza por "Access to fetch … has been blocked by CORS policy". En Network, la petición sí ha llegado al servidor (miradlo también en la terminal del servidor, que registra cada petición).
Con CORS (paso 4): el primer GET funciona. En sus cabeceras de respuesta aparece Access-Control-Allow-Origin: *.
🤔 Pero el POST falla. En Network aparece antes una petición OPTIONS al mismo endpoint, y responde 406.
📝 Qué responder

¿Quién bloquea la respuesta en la comprobación 1: el servidor o el navegador? ¿Por qué curl no tenía este problema en O1?
¿Por qué el GET no necesita esa petición OPTIONS y el POST sí? Pista: fijaos en el Content-Type y buscad "preflight" en la demo 04.
Usad la tabla "Read the Specific Console Error" de la demo 04 para explicar el error del POST. Leed hotels-server/src/index.ts y middleware.ts: ¿por qué responde 406 a la petición OPTIONS? No hace falta que lo arregléis (es el desafío D1); sólo que lo expliquéis.
O4 · Gestionar varias peticiones (demo 05)
Volved al modo de O2 (servidor sin CORS, cliente construido y servido desde localhost:3000), o seguid en O3 si sólo hacéis GET.

🛠️ Qué hacer

Tres botones nuevos en main.ts:

"Cargar todo": pide hoteles y ciudades en paralelo con Promise.all y muestra cuántos hay de cada uno. Medid con performance.now() cuánto tarda, y comparadlo con hacer las dos peticiones una detrás de otra con await.
"Cargar con fallo": lo mismo, pero añadiendo una tercera petición a una ruta que no existe (/api/nope). Hacedlo primero con Promise.all y después con Promise.allSettled, y mostrad cuáles han ido bien y cuáles no.
"Recargar": pide los hoteles, pero si se pulsa otra vez antes de que termine, cancela la petición anterior con un AbortController (demo 05, "Cancelling Previous Requests"). Un AbortError no se muestra como error: es algo que habéis provocado vosotros.
🔎 Qué comprobar

En Network, con "Cargar todo", las dos peticiones empiezan a la vez (mirad la columna Waterfall). En la versión secuencial, la segunda empieza cuando acaba la primera.
Con Promise.all y la ruta que no existe, no se muestra ningún resultado: se va directamente al catch. Con Promise.allSettled, se ven los hoteles y las ciudades y el error.
Poned una conexión lenta en Network (Slow 4G o 3G) y pulsad "Recargar" cinco veces seguidas: las cuatro primeras peticiones aparecen como (canceled) y sólo se pinta el resultado de la última.
📝 Qué responder

En una pantalla que necesita hoteles y ciudades para funcionar, ¿usaríais Promise.all o Promise.allSettled? ¿Y en un panel con varios bloques independientes (el tiempo, las noticias, la bolsa)?
¿Dónde habéis usado ya un AbortController en este curso? (Laboratorio 4, O3). ¿Para qué servía allí?
O5 · README + bitácora de IA
El README.md del repo tiene que incluir:

Cómo arrancarlo: el servidor, el cliente, y cómo activar CORS.
La tabla de O1 completa.
Las respuestas 📝 de O1 a O4.
Capturas: el error de CORS en consola, la petición OPTIONS con su 406 y las peticiones (canceled) de O4.
Checklist de obligatorios / opcionales / desafíos hechos.
🤖 Bitácora de IA: qué herramienta(s) habéis usado y al menos 3 ejemplos con este formato:
### Prompt

"Tengo un error de CORS al hacer un POST desde localhost:5173 a localhost:3000"

### Qué me dio

Que añadiese mode: "no-cors" al fetch.

### Qué corregí y por qué

Con "no-cors" el error desaparece, pero la respuesta llega "opaca": no se puede leer
ni el estado ni el cuerpo. CORS se arregla en el servidor, no en el cliente.
💡 Con CORS, la IA tiende a proponer "atajos" que esconden el error en lugar de arreglarlo. Es un buen sitio para pillarla.

⭐ Parte 2 · Opcionales
Suben nota. Haced los que más os apetezcan (recomendamos al menos 2).

P1 · Lo mismo con axios (demo 02)
Cread hotels.axios.ts con las mismas cinco funciones usando axios. Primero, sin tocar nada: va a fallar con 406. Averiguad por qué (pista: mirad en Network qué Accept envía axios por defecto) y arregladlo una sola vez creando una instancia con axios.create({ baseURL, headers }). Comparad en el README las dos versiones: qué os ahorra axios y qué hace distinto con los errores HTTP.

P2 · El proxy de Vite
Otra forma de evitar CORS en desarrollo: configurad server.proxy en un vite.config.ts del cliente para que /api se redirija a localhost:3000. Comprobad que, sin USE_CORS, el CRUD completo funciona desde localhost:5173. Explicad en el README por qué esto no sirve para producción.

P3 · El ejercicio del módulo: client-cors
Haced el ejercicio de la demo 04: en la aplicación React de .start-code/client-cors, sustituid los datos de prueba (*.mock-data.ts) por llamadas reales al servidor. Ojo: la API devuelve { data: ... } y exige el Accept, igual que en O2.

P4 · Tueste, con API de verdad ☕
En el laboratorio 4, los cafés se guardaban en localStorage. Levantad una API REST para ellos con json-server (npx json-server coffees.json) y cambiad sólo core/coffees/api.ts para que lea, cree y edite contra ella. Si la arquitectura de pods estaba bien hecha, ningún componente debería cambiar. Contadlo en el README.

P5 · Validar lo que llega
TypeScript no comprueba en ejecución que el servidor devuelva lo que dice el tipo Hotel (laboratorio 4, O6). Escribid un esquema de Zod para Hotel y usadlo en getHotels y getHotel. Probad a "romper" un hotel con un PUT que ponga lowRate a un texto y comprobad que el cliente lo detecta.

🔥 Parte 3 · Desafíos
Para quien quiera sufrir un poco (y aprender mucho). Cada uno cuenta como un plus importante.

D1 · Arreglad el servidor
Modificad hotels-server para que se porte como dice la teoría:

Que funcione la petición OPTIONS de O3 (pensad en el orden de los middlewares).
404 cuando un hotel no existe (en GET, PUT y DELETE).
400 cuando en un POST falta el nombre o los precios no son números, con un cuerpo de error como el del concepto 02, sección 6 ({ "error": { "code", "message", "field" } }).
Después, adaptad vuestro getHotel a la nueva respuesta y mostrad en el cliente el message del error.

D2 · Tiempo máximo y reintentos
Añadid a request un tiempo máximo con AbortSignal.timeout() y reintentos: si falla por red o con un 5xx, se reintenta hasta 3 veces, esperando cada vez el doble (500 ms, 1 s, 2 s). Con un 4xx no se reintenta. Explicad por qué un POST es más delicado de reintentar que un GET (concepto 01: idempotencia).

D3 · Diseñad la API de Tueste
Sin programar nada: diseñad en el README los endpoints de la tienda de Tueste siguiendo el concepto 02. Tiene que haber cafés, clientes, suscripciones y pedidos, con filtros (por tueste, por precio), paginación, un recurso anidado y, al menos, una acción que no sea CRUD (cancelar una suscripción, por ejemplo). Para cada endpoint: método, URL, cuerpo, código de éxito y códigos de error posibles.

🤖 Cómo sacarle partido a la IA (sin que os la cuele)
Dadle contexto. Pegadle lo que habéis descubierto en O1:

Estoy escribiendo un cliente con fetch en TypeScript para esta API:
- Todas las rutas exigen la cabecera Accept: application/json (si no, 406).
- Las respuestas vienen envueltas: { "data": ... }.
- DELETE devuelve 204 sin cuerpo.
- GET /api/hotels/:id devuelve 200 con {} si el hotel no existe.

Escríbeme una función genérica request<T> que lance un error cuando la
respuesta no sea ok y que no intente leer JSON en un 204.
Pedidle que os explique, no sólo que haga: "¿esta petición va a necesitar preflight?", "¿qué pasa si el servidor devuelve un 500 aquí?", "¿este código distingue una cancelación de un error de red?".

Revisad siempre esta lista, porque es lo que la IA suele hacer mal:

❌ Lo que suele hacer	✅ Qué hacer
await response.json() sin mirar response.ok	Comprobar response.ok y lanzar un error con el estado
response.json() en un 204	No leer cuerpo cuando no lo hay
mode: "no-cors" para "arreglar" CORS	CORS se configura en el servidor (o con el proxy de Vite en desarrollo)
Extensiones del navegador que "desactivan CORS"	Lo mismo: esconden el problema, en producción seguirá ahí
Mostrar un AbortError como si fuese un fallo	Distinguir la cancelación (provocada) de los errores reales
forEach(async …) para hacer peticiones en orden	for...of con await (demo 05, "Critical Pitfalls")
[fetch(a), fetch(b)] "para lanzarlas luego"	Ya se han lanzado: [() => fetch(a), () => fetch(b)]
Copiar el modelo completo de 30 campos del servidor	Tipar sólo lo que usa el front
as Hotel sobre cualquier respuesta	Un as no valida nada: si importa, Zod (P5)
Usad la pestaña Network como en todo el curso: el código de estado, las cabeceras de la petición y de la respuesta, el Payload y el Waterfall os cuentan casi todo lo que necesitáis saber.

📬 Entrega
Repositorio público en GitHub (o privado dando acceso a los profesores).
En la raíz: las carpetas hotels-server y client + el README.md de O5.
Capturas en una carpeta docs/ o screenshots/.
En el portal academia.lemoncode.net id a los laboratorios del módulo 5 y pegad el enlace a vuestro repo.
✋ No subáis node_modules ni dist. Ojo: hotels-server no trae .gitignore, así que cread uno antes del primer commit.

📊 Evaluación
Bloque	Peso
Obligatorios O1-O4 (el cliente funciona y las comprobaciones se cumplen)	50 %
README: tabla de O1, respuestas, capturas y bitácora (O5)	20 %
Opcionales (P1-P5)	15 %
Desafíos (D1-D3)	15 %
Para aprobar: todos los obligatorios hechos y las preguntas 📝 respondidas.

En la revisión podemos pediros que expliquéis una petición en Network o que hagáis un cambio pequeño en directo (p. ej. "añade getCities al cliente" o "haz que deleteHotel devuelva si existía"). Es la forma de comprobar que el código es vuestro, lo haya escrito quien lo haya escrito.

📚 Recursos
Los apuntes del módulo: 05-api-rest, en especial concepts/ y las demos 03, 04 y 05.
MDN: Usar Fetch, CORS, códigos de estado HTTP y AbortController.
Promise.all y Promise.allSettled.
¡A servir peticiones! ☕🌐