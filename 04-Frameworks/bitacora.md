## 1 · El select y el textarea del formulario, sin borde ni foco propio

### Prompt

"Obligatorio O6 […] Cada campo con `<label htmlFor>`, aria-invalid y
aria-describedby apuntando a su mensaje de error. […] Tueste: `<select>` con
las tres opciones en español. […]" (prompt 6 de `prompts.md`).

### Qué me dio

Un formulario correcto en accesibilidad ARIA (label, `aria-invalid`,
`aria-describedby` y `role="alert"` en cada campo), con un `<select>` para el
tueste y un `<textarea>` para las notas. Pero no tocó `src/styles.css`, que
venía de la demo y sólo daba estilo a `button`, `input` y `a`:

```css
input { @apply rounded border border-slate-400 bg-white p-2; }
button, input, a { @apply focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700; }
```

Como el preflight de Tailwind deja todos los bordes a 0, el `<select>` y el
`<textarea>` salían sin borde (se ve en `docs/03-formulario-errores.png`: el
campo de notas no se distingue del fondo) y, al recibir el foco, enseñaban el
anillo por defecto del navegador en vez del índigo del resto. No lo detectó
hasta la revisión final de O8, al mirar la captura.

### Qué corregí y por qué

Añadí `select` y `textarea` a los dos selectores:

```css
input, select, textarea { @apply rounded border border-slate-400 bg-white p-2; }
button, input, select, textarea, a { @apply focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700; }
```

Un campo sin borde no parece un campo, y un foco distinto en dos controles
rompe la consistencia al recorrer el formulario con el teclado (el "acabado"
del enunciado: labels, foco y errores). Lección: cuando la IA añade un tipo
de control nuevo, hay que revisar también los estilos base, no sólo el JSX.

## 2 · Una respuesta de O6 atribuía a Zod algo que no hace

### Prompt

"Responde tú en el README ("## Respuestas" → "### O6") las dos preguntas 📝
de O6: cita cada una y contéstala en 2-3 frases (tipos en compilación
frente a validación en ejecución; […])" (prompt 6 de `prompts.md`).

### Qué me dio

Una respuesta a "¿para qué hace falta además un esquema de Zod?" que decía
que la interfaz `Coffee` "no puede revisar lo que teclea el usuario ni lo que
hay guardado en `localStorage`. El esquema de `src/coffee.schema.ts` sí se
ejecuta: […]". Así se daba a entender que Zod valida lo guardado en
`localStorage`, y no es así: el esquema sólo se usa en el formulario
(`validators` de `useForm` y `coffeeSchema.parse` al guardar). Lo que se lee de
`localStorage` lo comprueba la guarda `isCoffeeList` de `model.ts`. Además, la
respuesta sólo citaba la comprobación de tipos `z.output` y el fichero tenía
también la de `z.input`.

### Qué corregí y por qué

En la revisión de O8 separé las dos cosas: Zod valida (y transforma con el
`trim`) lo que se escribe en el formulario, e `isCoffeeList` valida lo que hay
en `localStorage`. Añadí también la comprobación `z.input`. La frase original
sonaba bien y con mucha seguridad, pero era falsa: si en la revisión me piden
"enséñame dónde valida Zod el localStorage", no hay nada que enseñar.

## 3 · El detalle de un café no tenía `<h1>` mientras cargaba

### Prompt

"Obligatorio O5 […] El detalle muestra todos los datos del café (también el
tueste y las notas de cata) y un enlace para volver. […]" (prompt 5 de
`prompts.md`; en O7 el código pasó a `CoffeeDetailContainer`).

### Qué me dio

Un detalle con sus estados de carga, error y "no encontrado". El de error
llevaba su `<h1>Detalle del café</h1>`, pero el de carga devolvía sólo el
mensaje:

```tsx
if (loading) {
  return <LoadingMessage />;
}
```

Mientras llegaba el café, la pantalla no tenía ningún `<h1>`. En el catálogo y
en la edición el estado de carga sí lo tenía, así que era un despiste en una
sola rama. Se vio en la revisión de accesibilidad de O8 ("un solo h1 por
pantalla").

### Qué corregí y por qué

Le puse el mismo título que a la rama de error:

```tsx
if (loading) {
  return (
    <>
      <h1>Detalle del café</h1>
      <LoadingMessage />
    </>
  );
}
```

Cada pantalla tiene que tener su `<h1>`, también mientras carga: los lectores
de pantalla lo usan para anunciar dónde estás y para saltar al contenido. Con
una conexión lenta (la 🔎 de O3) ese estado dura segundos. Lección: cuando un
componente tiene varios `return`, hay que revisar cada rama, no sólo la
principal.
