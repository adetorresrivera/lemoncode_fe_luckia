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
    ├── src/            main.ts y el código del cliente
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

## Checklist

### Obligatorios
- [x] O1 · Explorar la API antes de programar
- [ ] O2 · Un cliente con fetch
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
