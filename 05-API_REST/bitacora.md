# Bitácora de IA · Lab 05

Herramienta: Claude Code en VS Code (dentro del DevContainer), con los prompts
de [prompts.md](prompts.md).

## 1 · Un `npx --yes` colado para validar el devcontainer.json

### Prompt

"DevContainer (.devcontainer/devcontainer.json). Lee el fichero y respeta su
estilo […] NO ejecutes npm install todavía: dime qué comandos vas a lanzar
[…] y espera a que te lo confirme." (prompt 0 de `prompts.md`).

### Qué me dio

Para comprobar que el `devcontainer.json` seguía siendo válido después de
editarlo, lanzó `npx --yes -p jsonc-parser@3 true` seguido de un `node -e` que
quitaba los comentarios y hacía `JSON.parse`. El `npx --yes` se descargó
`jsonc-parser` en la caché de npm (`~/.npm/_npx/…`) sin preguntar.

### Qué corregí y por qué

El `npx` sobraba: la validación ya la hacía el `node -e`, que no necesita nada
instalado. Además, saltarse la confirmación iba en contra de la regla de no
instalar nada sin preguntar, y justo en el paso en el que el prompt pedía
esperar antes del `npm install`. Borré la entrada de la caché
(`rm -rf ~/.npm/_npx/<hash>`) y comprobé que en el repo no había cambiado nada
(`git status`). Para validar un JSON con comentarios basta con Node.

## 2 · Un curl sin `-s` que ensuciaba la prueba de O1

### Prompt

"Lanza con curl -i cada una de las 9 peticiones de la tabla del enunciado, en
ese orden y con el servidor recién arrancado […] Guarda la salida completa
(comando + respuesta, con cabeceras […]) en 05-API_REST/docs/o1-curl.txt"
(prompt 1 de `prompts.md`).

### Qué me dio

Lanzó las 9 peticiones con `curl -i …` redirigiendo la salida a un fichero.
Sin terminal, curl muestra su barra de progreso (`% Total % Received …
Dload Upload`) y la mezcló con la respuesta: en algunas peticiones la línea
`HTTP/1.1 200 OK` quedaba pegada al final de la barra.

### Qué corregí y por qué

La salida tenía que ser la prueba de la tabla, y así no se leía bien el código
de estado. Se repitió con `curl -s -i` (`-s` quita la barra; las cabeceras de
`-i` siguen saliendo). Pero no bastaba con volver a lanzar: el DELETE de la
primera tanda había borrado el hotel 1 y el PUT le había cambiado el
`lowRate`, así que la segunda tanda ya no empezaba con el servidor recién
arrancado, como pedía el prompt. Antes de repetir hubo que reiniciar el
servidor (los datos viven en memoria). En el README queda la nota de usar
`-s` al redirigir a un fichero.

## 3 · Un `pkill -f` que se mató a sí mismo

### Prompt

El mismo paso del prompt 1 de `prompts.md`: reiniciar el servidor para repetir
las peticiones con los 10 hoteles iniciales.

### Qué me dio

Paró el servidor con `pkill -f "tsx watch ./src/index.ts"` dentro del mismo
comando que luego lo volvía a arrancar y lanzaba los curl. `pkill -f` busca el
patrón en la línea de comandos completa de cada proceso, y el propio shell que
ejecutaba ese comando contenía el texto `tsx watch ./src/index.ts`: lo mató
también (código de salida 144) y no se lanzó ninguna petición.

### Qué corregí y por qué

Se comprobó con `ps` y `ss -ltnp` que el servidor sí había quedado parado y
que el puerto 3000 estaba libre, y se arrancó y se lanzaron las peticiones en
un comando aparte. Para parar un proceso concreto es mejor buscar su PID
(`ps`, o `ss -ltnp` por el puerto) y hacer `kill <pid>`, o usar un patrón que
no aparezca en el propio comando.

Al final del prompt el error se repitió con otra forma: para parar el servidor
filtró `ps` con `awk '/[t]sx watch|[n]pm run dev/'`. El truco de los corchetes
evita que `awk` se encuentre a sí mismo, pero el mismo script contenía, unas
líneas más abajo, `npm run dev` literal (para volver a arrancar el servidor),
así que el shell volvió a matarse. La solución definitiva fue sacar el PID del
puerto (`ss -ltnp | grep ':3000 '`), subir a sus padres con `ps -o ppid=` y
hacer `kill` de los tres procesos (`sh -c`, el `tsx watch` y el `node` que
escucha). Hay que matar también el `tsx watch`: si sólo se para el hijo, el
watcher lo puede volver a lanzar.

## 4 · Un script de curl que habría creado dos hoteles

### Prompt

"Comprueba el recorrido sin navegador: con el servidor recién arrancado,
reproduce con curl la misma secuencia (GET, POST, GET, PUT, DELETE, GET,
GET) y confirma los códigos […] Guárdalo en docs/o2-curl.txt" (prompt 2 de
`prompts.md`).

### Qué me dio

Un primer borrador del script que, para cada paso, lanzaba la petición una
vez para mostrar la respuesta con `-i` y otra vez para sacar el valor del
`console.log` (`1 10`, el `id`…). Con el POST y el DELETE, eso es crear dos
hoteles y borrar dos veces.

### Qué corregí y por qué

Se vio antes de ejecutarlo y se rehízo: cada petición se lanza **una sola
vez**, su respuesta se guarda en una variable y de ahí salen tanto lo que se
muestra como el valor (`b.data.length`, `b.data.id`…). Si no, el paso 6 no
habría dado `6 10` (habría quedado un "Hotel Tueste" de más) y la prueba no
habría reproducido lo que hace el botón. Con peticiones que cambian datos
(POST, PUT, DELETE), repetir una petición para "mirarla" no sale gratis.

## 5 · Una respuesta del README que no cuadraba con mi propio código

### Prompt

"'### O2' en Respuestas: responde tú las dos preguntas 📝 de O2" (prompt 2
de `prompts.md`).

### Qué me dio

En "¿qué pasaría si no comprobaseis `response.ok`?", escribió que
`getHotels` devolvería `undefined` y que `.length` reventaría con
`TypeError`. Es lo que pasa en un cliente genérico, pero no en este:
`getHotels` pasa por `requireData`, que lanza su propio error si falta
`data`.

### Qué corregí y por qué

Al repasar el README contra `hotels.api.ts`, se reescribió la respuesta: sin
la comprobación de `ok`, `requireData` lanzaría
`GET /api/hotels: la respuesta no trae data`, un error que no dice el código
y apunta a otra cosa, y sólo sin `requireData` se llegaría al `TypeError`.
De paso se comprobó con curl lo del 404 de Express (`Content-Type:
text/html`, `Cannot GET /api/nope`), que antes estaba sin comprobar. En la
revisión preguntan por *vuestro* código: una respuesta correcta en general
pero falsa para el código entregado no sirve.
