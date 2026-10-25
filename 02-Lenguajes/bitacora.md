## O7 · ¿Pura o impura?

### Prompt

"Kata O7 en src/o07-pureza.ts. Copia las seis funciones de lab.md, y encima
de cada una un comentario: pura o impura y qué condición rompe. Después
escribe la versión pura de cada impura con el sufijo Pure. En la 1 y la 5 hay
dos formas de hacerla pura (pasar el valor como parámetro o...). Antes de
elegir, dime las opciones."

### Qué me dio

Opciones para la 1 (parámetro, `const` o fábrica con closure) y para la 5
(parámetro o inyectar el reloj). En las dos **recomendaba el parámetro**: para
la 5, `createOrderIdPure(timestamp: number)`, con el `Date.now()` movido a
quien la llama.

### Qué corregí y por qué

- En la 1 acepté el parámetro (`totalWithShippingPure(amount, shippingCost)`).
- En la 5 elegí **inyectar el reloj**: `createOrderIdPure(now: () => number)`.
  La firma deja claro que la función depende de un reloj y en los tests se le
  pasa uno fijo (`() => 1700000000000`).
- El precio, que tengo que saber defender: solo es pura si `now` también lo
  es. Con `Date.now` vuelve a ser impura, pero eso lo decide quien la llama,
  no la función.

## P4 · Ordenar por cualquier propiedad

### Prompt

"Opcional P4 en src/p04-sortby.ts: sortBy<T, K extends keyof T>(items, key)
sin mutar, con localeCompare para textos y resta para números. [...]
Problema: T[K] puede ser cualquier cosa (un array como notes, un objeto
opcional como address). Dime qué opciones hay para tratarlo antes de elegir."

### Qué me dio

Dos opciones comprobadas con `npx tsc`: restringir `K` a las claves cuyo valor
es `string | number` (con un tipo `KeysOfType`) o restringir `T` con
`Record<K, string | number>`.

### Qué corregí y por qué

- La firma que da el enunciado (`K extends keyof T`) no basta: deja pasar
  `notes` o `address`, y dentro `T[K]` es opaco, así que no deja usar
  `localeCompare` ni restar sin `as`.
- Elegí la opción A (`KeysOfType`): el error de `"color"` señala la clave
  (`Argument of type '"color"' is not assignable…`). Con la B el error cae
  sobre el array de cafés y no menciona la clave.
- Precio: dentro siguen haciendo falta guardas `typeof`, porque TypeScript no
  relaciona `T[K]` con `string | number`. Y `discount` queda fuera por ser
  opcional (`number | undefined`).

## P7 · Modelo de datos del TFM

### Prompt

"Opcional P7: el modelo de datos de mi TFM (Postula) en src/tfm-types.ts.
[...] Tres funciones puras en src/p07-tfm.ts que saquen lo que muestra el
panel: countByStatus, interviewRateByCv y nextSteps (las candidaturas con la
próxima acción más cercana, ordenadas sin mutar)."

### Qué me dio

Un `nextSteps` que **descartaba con un `filter` las acciones vencidas** y
dejaba la duda abierta: «¿una acción vencida y no hecha debería salir en
próximos pasos?».

### Qué corregí y por qué

- Le dije que sí: en el panel, una acción atrasada es justo lo más urgente.
  Ocultarla es el peor resultado posible.
- Ahora salen primero (se ordena por fecha) y llevan `overdue: boolean`. Para
  añadir ese campo sin tocar los datos, cada candidatura se copia con
  `{ ...application, overdue }`: el objeto es nuevo, pero su `nextAction` se
  sigue compartiendo con los datos (copia superficial).
