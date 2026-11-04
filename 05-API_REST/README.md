# Lab 05 · API REST

Un cliente en TypeScript (sin framework, con Vite) que hace el CRUD de hoteles
con `fetch` contra el servidor del módulo (`hotels-server`), y se pelea con
CORS y con varias peticiones a la vez.

## Cómo arrancarlo

Necesita Node.js 22.12 o superior (lo pide Vite 8: `^20.19.0 || >=22.12.0`).
El DevContainer usa la imagen `javascript-node:24`.

### Con DevContainer (recomendado)

1. Abre la raíz del repo en VS Code → *Dev Containers: Reopen in Container*.
2. Al crear el contenedor, el `postCreateCommand` instala las dependencias de
   todos los laboratorios, y en este, las de `05-API_REST/hotels-server` y
   `05-API_REST/client` (cada una sólo si existe su `package.json`).
3. Si el contenedor es de antes del lab 5, no tiene ni esas dependencias ni el
   puerto 3000 reenviado. Haz *Dev Containers: Rebuild Container*, o instala
   a mano:
   ```bash
   (cd 05-API_REST/hotels-server && npm install)
   (cd 05-API_REST/client && npm install)
   ```
   (Para tener el puerto 3000 en la pestaña **Ports** hay que reconstruir de
   todas formas, o añadirlo a mano en esa pestaña).
4. Puertos que VS Code reenvía a `localhost` en Windows:

   | Puerto | Qué es |
   | --- | --- |
   | 3000 | `hotels-server`: la API en `/api` y el cliente construido en `/` |
   | 5173 | `npm run dev` del cliente (Vite) |
   | 4173 | `npm run preview` del cliente |

   Los puertos 3000 y 5173 llevan `requireLocalPort: true`. Si alguno ya está
   ocupado en Windows (otro servidor, otro contenedor), VS Code **no** lo
   reenvía a otro puerto en silencio (3001, 5174…): avisa de que no puede.
   Es lo que queremos, porque la URL de la API
   (`http://localhost:3000/api`) y el origen del cliente
   (`http://localhost:5173`, que importa para CORS) tienen que ser
   exactamente esos. Si pasa, cierra lo que esté usando el puerto en Windows
   y vuelve a reenviarlo desde la pestaña **Ports**.

### Servidor

```bash
cd 05-API_REST/hotels-server
npm run dev
```

Escucha en http://localhost:3000 (`tsx watch ./src/index.ts`).

⚠️ Los datos viven en memoria. Cada vez que el servidor se reinicia, los
hoteles vuelven a ser los 10 iniciales. También se reinicia cuando guardas
cualquier fichero suyo, porque `tsx watch` lo vuelve a arrancar. Si rompes
algo, basta con reiniciar.

La carpeta `hotels-server/front/` (la que sirve en `/`) no se sube a git: es
el resultado de `npm run build` en `client`, igual que un `dist`.

### Cliente construido (O2)

Con el servidor arrancado (sin `USE_CORS`), en otra terminal:

```bash
cd 05-API_REST/client
npm run build
```

`build` es `tsc && vite build`: si hay un error de tipos, no se construye.
Después, el `postbuild` borra `hotels-server/front/` y copia ahí `dist/`
(`rm -rf ../hotels-server/front && cp -r dist ../hotels-server/front`).
No hace falta reiniciar el servidor: `express.static` lee los ficheros en
cada petición. Basta con recargar.

Abre http://localhost:3000 (sirve el cliente y la API en el mismo origen) y
F12. El botón **Probar CRUD** hace el recorrido del enunciado (listar, crear
"Hotel Tueste", leerlo, cambiarle el `lowRate` a 95, borrarlo, volver a
leerlo y listar) y escribe cada paso en **Console** (`1 10` … `6 10`). Si
algo falla, el error sale en Console con `console.error`. Como el hotel se
crea y se borra, el botón se puede pulsar varias veces y la cuenta vuelve a
10.

> El `postbuild` de `.start-code` era `cp -r dist/ ../hotels-server/front`.
> Sólo funciona la primera vez: si `front/` ya existe, `cp` copia la carpeta
> **dentro** (`front/dist/…`) y el servidor sigue sirviendo el `index.html`
> viejo. Se vio en el segundo build de O2, y por eso ahora se borra antes de
> copiar.

## Estructura

```
05-API_REST/
├── lab.md              enunciado del laboratorio
├── prompts.md          prompts usados con Claude Code, en orden
├── README.md           este fichero
├── bitacora.md         bitácora de IA
├── smoke-api-test.sh   ejemplos de curl del módulo (POST y PUT)
├── docs/               capturas (.png) y salidas de curl (.txt)
├── hotels-server/      servidor del módulo (Express), sin modificar
│   ├── src/            index.ts (rutas y middlewares), middleware.ts, data-layer/
│   ├── public/         miniaturas de los hoteles (estáticos con USE_CORS=yes)
│   └── front/          build del cliente (estáticos sin CORS), ignorado en git
└── client/             cliente TypeScript + Vite
    ├── src/            main.ts (botones), hotels.api.ts (request<T> y el CRUD)
    └── public/         favicon e iconos
```

## O1 · Explorar la API

Las 9 peticiones se lanzaron con `curl -s -i`, en este orden y con el servidor
recién arrancado (sin `USE_CORS`). La salida completa, con el comando y las
cabeceras de cada respuesta, está en [docs/o1-curl.txt](docs/o1-curl.txt).
La tabla recoge lo que salió, no lo que dice la teoría.

| Petición | Código de estado | ¿Qué devuelve en el cuerpo? |
| --- | --- | --- |
| GET /api/hotels sin cabecera Accept | **406** Not Acceptable | `{"error":"Not Acceptable"}` (un string, no el objeto de error con `code` y `message` que devuelven los 500) |
| GET /api/hotels con Accept: application/json | 200 OK | `{ data: [...] }`: array con los 10 hoteles, cada uno con los ~30 campos del servidor |
| GET /api/hotels/1 | 200 OK | `{ data: {...} }`: el hotel "Motif Seattle" (`lowRate` 259, `highRate` 289) |
| GET /api/hotels/999 | **200** OK | `{}`: un objeto vacío, **sin** la clave `data` |
| GET /api/cities | 200 OK | `{ data: [...] }`: 5 ciudades `{ id, name }` (Seattle, Chicago, New York, California, Burlingame) |
| POST /api/hotels con un hotel en JSON | 201 Created | `{ data: {...} }`: el hotel enviado más `id` (UUID generado por el servidor), `created` y `modified` |
| PUT /api/hotels/1 cambiando lowRate | 200 OK | `{ data: {...} }`: el hotel 1 completo con `lowRate` 199 y `modified` actualizado |
| DELETE /api/hotels/1 | 204 No Content | Sin cuerpo (ni `Content-Type` ni `Content-Length` en la respuesta) |
| GET /api/hotels/1 después de borrarlo | **200** OK | `{}`, igual que el 999 |

En negrita, los códigos que no son los que dice la teoría (ver abajo).

Para repetirlo (con el servidor recién arrancado; el DELETE borra el hotel 1
hasta que se reinicia):

```bash
B=http://localhost:3000/api

curl -i "$B/hotels"                                            # sin Accept → 406
curl -i -H "Accept: application/json" "$B/hotels"
curl -i -H "Accept: application/json" "$B/hotels/1"
curl -i -H "Accept: application/json" "$B/hotels/999"
curl -i -H "Accept: application/json" "$B/cities"

curl -i -X POST "$B/hotels" \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  -d '{"name":"Grand Hyatt Seattle","city":"Seattle","lowRate":210,"highRate":320}'

curl -i -X PUT "$B/hotels/1" \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  -d '{"lowRate":199}'

curl -i -X DELETE -H "Accept: application/json" "$B/hotels/1"
curl -i -H "Accept: application/json" "$B/hotels/1"            # después del DELETE
```

(Añadid `-s` si lo redirigís a un fichero: sin él, curl mezcla su barra de
progreso con la respuesta.)

⚠️ Los ejemplos de [smoke-api-test.sh](smoke-api-test.sh) no llevan
`Accept: application/json`, así que contra este servidor devuelven todos 406.
Además, sus comentarios dicen que el POST y el PUT devuelven 204; en realidad
devuelven 201 y 200 con el hotel en `{ data: ... }`.

### 🔎 Comprobaciones

**Sin `Accept: application/json` fallan todas las peticiones a `/api`.**
[hotels-server/src/index.ts:18](hotels-server/src/index.ts#L18) monta
`checkContentTypeJSON` con `app.use('/api', …)`, antes de cualquier ruta, así
que se ejecuta en todas las peticiones a `/api` (cualquier método).
En [hotels-server/src/middleware.ts:8](hotels-server/src/middleware.ts#L8) lee
la cabecera `Accept` y en la
[línea 10](hotels-server/src/middleware.ts#L10) la compara con `!==` contra el
texto exacto `"application/json"`; si no coincide, la
[línea 11](hotels-server/src/middleware.ts#L11) responde
`406 {"error":"Not Acceptable"}` y no llama a `next()`, así que la ruta nunca
llega a ejecutarse. Sin la cabecera, `req.get("Accept")` es `undefined` y
falla. Pero también falla con un `Accept` válido que no sea exactamente ese
texto: `Accept: application/json, text/plain, */*` (el que envía axios por
defecto) también recibe 406 (petición E1 de
[docs/o1-curl.txt](docs/o1-curl.txt)). Por eso el cliente tendrá que enviar
siempre `Accept: application/json`, tal cual.

**Los datos vienen dentro de `{ "data": ... }`.** Todas las respuestas con
éxito y cuerpo hacen `res.json({ data })`:
[index.ts:31](hotels-server/src/index.ts#L31) (lista de hoteles),
[:48](hotels-server/src/index.ts#L48) (POST, con `status(201)`),
[:63](hotels-server/src/index.ts#L63) (ciudades),
[:79](hotels-server/src/index.ts#L79) (un hotel) y
[:96](hotels-server/src/index.ts#L96) (PUT). En las respuestas reales se ve
`{"data":[{"id":"1",…` y `{"data":{"id":"1",…`. Los errores, en cambio, van
en `error` (`{"error":"Not Acceptable"}` en el 406). En el front, `request<T>`
tendrá que devolver `body.data`, no el cuerpo entero.

**Respuestas que no son las que dice la teoría** (concepto 01, "Common HTTP
Response Status Codes"):

| Petición | Debería devolver | Devuelve |
| --- | --- | --- |
| GET /api/hotels/999 | 404 Not Found: el recurso no existe | 200 OK con `{}` |
| GET /api/hotels/1 después del DELETE | 404 Not Found | 200 OK con `{}` |
| GET /api/hotels sin Accept, o con `Accept: application/json, text/plain, */*` | 200: sin `Accept` el cliente acepta cualquier tipo, y `*/*` lo incluye. 406 es sólo para cuando el servidor no puede producir **ningún** tipo de los que se piden | 406 Not Acceptable |
| PUT /api/hotels/999 (extra, E2) | 404 Not Found | 200 OK con `{"data":null}` |
| DELETE /api/hotels/999 (extra, E3) | 404 Not Found | 204 No Content, como si lo hubiera borrado |

El origen de los cuatro casos "no existe" es el mismo: ninguna ruta mira lo
que devuelve el repositorio. `findById` devuelve `undefined`
([hotel.repo.ts:90](hotels-server/src/data-layer/hotel.repo.ts#L90)),
`update` devuelve `null`
([hotel.repo.ts:100](hotels-server/src/data-layer/hotel.repo.ts#L100)) y
`delete` devuelve `false`
([hotel.repo.ts:117](hotels-server/src/data-layer/hotel.repo.ts#L117), y
[index.ts:111](hotels-server/src/index.ts#L111) ni lo guarda), y las rutas
responden con éxito igualmente. Arreglarlo es el desafío D1; en los
obligatorios el servidor no se toca.

**Cómo se detecta que un hotel no existe** (lo necesita `getHotel` en O2).
Por el código, no se puede: el GET de un hotel que no existe es un 200, igual
que el de uno que sí, así que `response.ok` es `true`. La diferencia está en
el cuerpo: `findById` devuelve `undefined`
([hotel.repo.ts:90](hotels-server/src/data-layer/hotel.repo.ts#L90)),
[index.ts:79](hotels-server/src/index.ts#L79) hace `res.json({ data: undefined })`,
y `JSON.stringify` quita las claves con valor `undefined`, así que lo que
llega es `{}`, sin la clave `data`. Comprobado con el `fetch` de Node: en el
999, `status` 200, `ok` `true`, el cuerpo `{}` y `body.data` `undefined`.
Así que, para este servidor: **si el cuerpo no trae `data`, el hotel no
existe** y `getHotel` devolverá `null`. Ojo, el PUT de un hotel que no existe
es distinto: devuelve `{"data":null}` (el `null` sí sobrevive al JSON).

## O2 · Cliente con fetch

### Qué hay en `client/src/hotels.api.ts`

- **`Hotel`** (`id`, `name`, `city`, `lowRate`, `highRate`) y
  **`NewHotel = Omit<Hotel, "id">`**: sólo los campos que usa el front, no
  los ~30 del servidor.
- **`API_BASE = "/api"`**: URL relativa, porque el cliente construido lo
  sirve el mismo servidor (mismo origen). En O3 pasa a `VITE_API_BASE`.
- **`Envelope<T> = { data?: T }`**: la forma de las respuestas. `data` es
  opcional porque a veces falta (el `{}` del 999).
- **`request<T>(path, options)`**: la única función que llama a `fetch`.
  Devuelve `Promise<T | undefined>`.
- **`requireData(data, what)`**: para las llamadas que siempre tienen que
  traer `data`. Si llega `undefined`, lanza un `Error` en vez de dejar pasar
  un `undefined` silencioso.
- Las cinco funciones, con el tipo de retorno anotado:

  | Función | Petición | Éxito | Devuelve |
  | --- | --- | --- | --- |
  | `getHotels()` | `GET /api/hotels` | 200 | `Promise<Hotel[]>` (con `requireData`) |
  | `getHotel(id)` | `GET /api/hotels/:id` | 200 (también si no existe) | `Promise<Hotel \| null>`: `null` si el cuerpo no trae `data` |
  | `createHotel(hotel: NewHotel)` | `POST /api/hotels` con el hotel en JSON | 201 | `Promise<Hotel>`: el hotel con el `id` del servidor |
  | `updateHotel(id, changes: Partial<NewHotel>)` | `PUT /api/hotels/:id` con los cambios en JSON | 200 | `Promise<Hotel>`: el hotel completo ya cambiado |
  | `deleteHotel(id)` | `DELETE /api/hotels/:id` | 204 | `Promise<void>` |

**Cabeceras.** `request` parte de las que lleguen en `options.headers` (con
`new Headers(...)`, que acepta objeto, array o `Headers`) y sólo añade las
que falten, para no pisarlas: `Accept: application/json` siempre, y
`Content-Type: application/json` sólo si hay `body` (POST y PUT). Un GET o
un DELETE no llevan `Content-Type`, porque no envían nada que describir.

**El tipo de la respuesta.** `response.json()` devuelve `any`. Se guarda en
una variable anotada, `const body: Envelope<T> = await response.json()`.
TypeScript lo acepta porque `any` se puede asignar a cualquier tipo, sin
`as` ni `any` explícito. Pero **ahí TypeScript se fía del servidor sin
comprobar nada** (lo dice un comentario en el código): si el servidor
mandase `lowRate: "barato"`, el tipo seguiría diciendo `number`. Validarlo
en ejecución es P5 (Zod). La otra opción era leerlo como `unknown` y
pasarlo por una guarda `body is { data: T }`. Se descartó porque esa guarda
sólo puede mirar que exista `data`, no que sea un `T`: dice más de lo que
comprueba, igual que un `as`.

**Por qué `T | undefined`.** En un 204 hay que devolver algo sin leer el
cuerpo, y `undefined` no se puede asignar a un `T` genérico sin `as`. En
lugar de esconderlo, el tipo lo dice: `request` devuelve `undefined` en un
204 **y** cuando el cuerpo no trae `data`, que es justo el caso del hotel que
no existe. Así `getHotel` se queda en `(await request<Hotel>(…)) ?? null`, y
las demás pasan por `requireData`.

### Qué hace `request<T>` en cada caso

Comprobado con el `hotels.api.ts` real ejecutado en Node (Node 22 quita los
tipos al importar un `.ts`). Para que la URL relativa funcione fuera del
navegador, la prueba envuelve `fetch` para que anteponga
`http://localhost:3000`.

| Caso | Qué pasa en `fetch` | Qué hace `request<T>` | Qué ve quien llama |
| --- | --- | --- | --- |
| **200 / 201 con `data`** | resuelve, `ok` `true` | `response.json()` y devuelve `body.data` | el dato (`1 10`, `2 Hotel Tueste <uuid>`, `4 95`…) |
| **200 con `{}`** (hotel que no existe) | resuelve, `ok` `true` | devuelve `body.data`, que es `undefined` | `getHotel` → `null` (`5 null`) |
| **204** (DELETE) | resuelve, `ok` `true` | devuelve `undefined` **sin** llamar a `response.json()` | `deleteHotel` → `void` |
| **404** (p. ej. `/api/nope`) | resuelve, `ok` `false` | lanza `Error: GET /api/nope → 404 Not Found` | el `await` rechaza → `catch` |
| **406** (sin `Accept`) | resuelve, `ok` `false` | lanza `Error: GET /api/hotels → 406 Not Acceptable` | el `await` rechaza → `catch` |
| **Error de red** (servidor parado) | **rechaza** con `TypeError` (Chrome: `Failed to fetch`; Node: `fetch failed`, `cause` `ECONNREFUSED`) | no llega a mirar `ok`: el `TypeError` sube tal cual | el `await` rechaza → `catch` |

En `main.ts`, el listener del botón llama a `testCrud().catch(error =>
console.error("Probar CRUD:", error))`. `addEventListener` no espera a la
promesa, así que sin ese `catch` cualquiera de estos errores acabaría como
`Uncaught (in promise)`.

### El recorrido, con curl

Con el servidor recién arrancado, la misma secuencia que hace el botón, con
las mismas cabeceras. Está completa en [docs/o2-curl.txt](docs/o2-curl.txt):

| # | Petición | Código | Salida en Console |
| --- | --- | --- | --- |
| 1 | `GET /api/hotels` | 200 | `1 10` |
| 2 | `POST /api/hotels` `{"name":"Hotel Tueste","city":"Seattle","lowRate":90,"highRate":120}` | **201** Created | `2 Hotel Tueste ed596e79-…` |
| 3 | `GET /api/hotels/<id>` | 200 | `3 Hotel Tueste` |
| 4 | `PUT /api/hotels/<id>` `{"lowRate":95}` | 200 | `4 95` |
| 5 | `DELETE /api/hotels/<id>` | **204** No Content | (nada) |
| 6 | `GET /api/hotels/<id>` | 200 con `{}` | `5 null` |
| 7 | `GET /api/hotels` | 200 | `6 10` |

Después se reinició el servidor y se lanzó el recorrido con el
`hotels.api.ts` real (en Node). Sacó lo mismo: `1 10`,
`2 Hotel Tueste 2e1a26f5-…`, `3 Hotel Tueste`, `4 95`, `5 null`, `6 10`. El
log del servidor (`morgan`) registró `200, 201, 200, 200, 204, 200, 200`.
Las cabeceras que envió cada petición: `Accept: application/json` en las 7, y
`Content-Type: application/json` sólo en el POST y el PUT.

### Lo que se ve en Network

En http://localhost:3000, F12 → Network, filtro **Fetch/XHR**, al pulsar
**Probar CRUD**:

- **7 peticiones**: `hotels` GET 200, `hotels` POST **201**, `<uuid>` GET 200,
  `<uuid>` PUT 200, `<uuid>` DELETE **204**, `<uuid>` GET 200 y `hotels` GET
  200. No hay ninguna OPTIONS: es el mismo origen y no hay CORS (eso es O3).
- **Payload del POST**: *Request Payload*
  `{"name":"Hotel Tueste","city":"Seattle","lowRate":90,"highRate":120}`,
  sin `id`. En *Headers* → *Request Headers*: `Accept: application/json` y
  `Content-Type: application/json`. En *Response*:
  `{"data":{…,"id":"<uuid>","created":…,"modified":…}}`.
- **DELETE**: en *Response* no hay nada ("This request has no response
  data available"), y en *Response Headers* no hay `Content-Type`.
- **El GET después del DELETE**: 200, y en *Response* sólo `{}`. Network
  no lo marca en rojo, aunque el hotel ya no existe.
- **Sin `Accept`**: se probó quitando de `request` el bloque que lo pone y
  recompilando. Sin esa cabecera, `fetch` (y curl) mandan `Accept: */*`, y el
  servidor responde **406** `{"error":"Not Acceptable"}`. El recorrido se para
  en el primer paso: en Network sólo sale un GET `hotels` **406** (en rojo), y
  en Console, `Probar CRUD: Error: GET /api/hotels → 406 Not Acceptable`. Ni
  un `undefined` ni un `1 undefined`. Después se volvió a poner el bloque y
  se recompiló: el fichero quedó idéntico (`cmp`) y el JS construido vuelve a
  llevar el `Accept`.

## Respuestas

### O1

> ¿Qué código debería devolver `GET /api/hotels/999` según el concepto 01
> ("Common HTTP Response Status Codes")? ¿Qué devuelve este servidor? ¿Qué
> problema le causa eso al front?

Debería devolver **404 Not Found**, porque el recurso `/api/hotels/999` no
existe. Este servidor devuelve **200 OK** con el cuerpo `{}`. Para el front es
un problema porque un 200 no cae en `!response.ok`: el `fetch` no lanza, el
`if (!response.ok)` no salta, y si se devuelve `body.data` sin mirar nada más,
llega `undefined` (o, si se usase el cuerpo tal cual, un objeto vacío que se
pintaría como un hotel sin nombre, ciudad ni precio) en vez de un mensaje de
"no encontrado". Por eso `getHotel` tiene que comprobar a mano que el cuerpo
trae `data` y devolver `null` si no.

> ¿Por qué el DELETE no devuelve cuerpo? ¿Qué código lo indica?

Porque después de borrar no queda ningún recurso que devolver: la operación ha
ido bien y no hay nada más que contar. Lo indica el **204 No Content**
([index.ts:112](hotels-server/src/index.ts#L112), `res.status(204).send()`):
en la respuesta real no hay ni `Content-Type` ni `Content-Length`. Para el
front significa que no se puede llamar a `response.json()`: comprobado con el
`fetch` de Node, en un 204 lanza `SyntaxError: Unexpected end of JSON input`.
Por eso `request<T>` no lee JSON cuando el estado es 204.

> El concepto 02 recomienda envolver las respuestas en un objeto
> (`{ "data": ... }`). ¿Qué ventaja tiene frente a devolver el array
> directamente?

Que la respuesta puede crecer sin romper a los clientes: junto a `data` se
pueden añadir después `meta` (total, página, enlaces de paginación) y quien
lee `body.data` sigue funcionando; con un array suelto, añadir el total
obligaría a cambiar la forma de la respuesta. Además da una forma fija a todas
las respuestas: aquí lo correcto viene en `data` (`{"data":[…]}`,
`{"data":{…}}`) y lo que falla en `error` (`{"error":"Not Acceptable"}`), así
que una sola función (`request<T>`) puede tratar todas las llamadas igual.
Hasta el 999 se detecta gracias a eso: la clave `data` falta.

### O2

> `fetch` no lanza un error con un 404 o un 500. ¿Cuándo sí lanza? ¿Qué
> pasaría en vuestra aplicación si no comprobaseis `response.ok`?

`fetch` sólo rechaza cuando **no hay respuesta HTTP que entregar**. Para
`fetch`, un 404 o un 500 son respuestas válidas: el servidor ha contestado, y
qué significa ese código lo decide la aplicación. Rechaza en estos casos:

- **Error de red**: servidor parado, DNS que no resuelve, sin conexión.
  Rechaza con `TypeError`. Comprobado contra un puerto sin nadie escuchando:
  `TypeError: fetch failed` con `cause` `ECONNREFUSED` (en Chrome el mensaje
  es `Failed to fetch`).
- **Respuesta bloqueada por CORS**: también `TypeError`, y el código no ve
  ni el estado (es O3).
- **Petición cancelada** con un `AbortController`: `AbortError` (es O4).
- **Petición mal formada** antes de enviarla, p. ej. un GET con `body` o una
  URL inválida: `TypeError`.

Si no se comprobase `response.ok`, los errores del servidor se leerían como
datos. Con el 406, `response.json()` da `{"error":"Not Acceptable"}` y
`body.data` es `undefined`. `getHotel` devolvería entonces `null`, es decir,
"ese hotel no existe", cuando en realidad la petición ha fallado (pasaría lo
mismo con un 500, que trae `{"error":{…}}`). En `getHotels`, `requireData`
lanzaría `GET /api/hotels: la respuesta no trae data`, que apunta a otra
cosa y no dice el código. Sin `requireData` sería peor: llegaría
`undefined`, y `(await getHotels()).length` reventaría con `TypeError:
Cannot read properties of undefined`, lejos de la causa. Y con un 404 de
Express, que responde HTML (`Content-Type: text/html`, `Cannot GET
/api/nope`), `response.json()` lanzaría `SyntaxError`. Comprobando `ok`, el error sale
donde se produce y con lo que hace falta para entenderlo:
`GET /api/hotels → 406 Not Acceptable`.

> ¿Por qué `createHotel` no envía el `id`? ¿Quién lo decide?

Porque el `id` lo decide el **servidor**: lo crea en el POST, y el cliente
no tiene forma de saber qué ids están libres (otro cliente podría haber
usado el mismo). En
[hotel.repo.ts:66-72](hotels-server/src/data-layer/hotel.repo.ts#L66-L72),
`create` recibe un `CreateHotelDTO = Omit<Hotel, 'id' | 'created' | 'modified'>`
y construye `{ ...data, id: crypto.randomUUID(), created, modified }`. Como
el `id` va después del spread, aunque el cliente mandase uno, el servidor lo
pisaría. Por eso `createHotel` recibe un `NewHotel` (`Omit<Hotel, "id">`):
TypeScript ni deja pasarlo. El `id` llega en la respuesta del 201
(`{"data":{…,"id":"ed596e79-…"}}`), y por eso el recorrido usa
`created.id` en los pasos siguientes. Es lo que dice REST: con
`POST /api/hotels` se crea un recurso dentro de la colección, y es el
servidor quien le da su URL (`/api/hotels/<uuid>`).

## Capturas

| Captura | Qué se ve |
| --- | --- |
| *(Opcional)* [docs/o2-network-crud.png](docs/o2-network-crud.png) | Network filtrado por Fetch/XHR tras pulsar Probar CRUD: GET, POST 201, GET, PUT, DELETE 204, GET y GET |

![Network filtrado por Fetch/XHR tras pulsar Probar CRUD: GET, POST 201, GET, PUT, DELETE 204, GET y GET](docs/o2-network-crud.png)

## Checklist

### Obligatorios
- [x] O1 · Explorar la API antes de programar
- [x] O2 · Un cliente con fetch
- [ ] O3 · Llamar desde otro origen: CORS
- [ ] O4 · Gestionar varias peticiones
- [ ] O5 · README + bitácora de IA

### Opcionales
- [ ] P1 · Lo mismo con axios
- [ ] P2 · El proxy de Vite
- [ ] P3 · El ejercicio del módulo: client-cors
- [ ] P4 · Tueste, con API de verdad
- [ ] P5 · Validar lo que llega

### Desafíos
- [ ] D1 · Arreglad el servidor
- [ ] D2 · Tiempo máximo y reintentos
- [ ] D3 · Diseñad la API de Tueste

## Cómo hacer las capturas

El repo vive en un volumen de Docker, no en una carpeta de Windows, así que
una captura hay que meterla a mano en el contenedor:

1. Abre la aplicación en Chrome o Edge en Windows, con la URL que diga cada
   captura.
2. F12, con las DevTools acopladas abajo (⋮ → *Dock side* → abajo), para que
   se vean a la vez la página y el panel.
3. **Win + Shift + S** → *Rectangular*, encuadrando el navegador entero con la
   barra de direcciones (para que se vea el puerto). En la Herramienta
   Recortes, *Guardar como* PNG en Windows con el nombre exacto de la
   captura.
4. Arrastra el PNG desde el Explorador de Windows a la carpeta
   `05-API_REST/docs/` del Explorer de VS Code (se copia al contenedor).
5. Comprueba que está: `ls 05-API_REST/docs/`.
