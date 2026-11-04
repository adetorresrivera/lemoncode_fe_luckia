import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { coffeeSchema, MAX_PRICE } from "./coffee.schema";
import type { CoffeeInput, Roast } from "./model";
import { roastLabels } from "./model";

interface Props {
  initialValues?: CoffeeInput;
  onSave: (values: CoffeeInput) => Promise<void>;
}

// El precio arranca en NaN (campo vacío), no en 0: así "vacío" y "0" dan
// mensajes distintos y nadie guarda un 0 sin haberlo escrito.
const emptyValues: CoffeeInput = {
  name: "",
  origin: "",
  roast: "medium",
  price: Number.NaN,
  notes: "",
};

const roastOptions: readonly Roast[] = ["light", "medium", "dark"];

// Los errores del esquema son issues de Standard Schema: pintamos su message.
function errorText(errors: ReadonlyArray<{ message: string } | undefined>): string {
  return errors.map((error) => error?.message).join(" ");
}

export function CoffeeForm({ initialValues = emptyValues, onSave }: Props) {
  const [saveError, setSaveError] = useState("");

  const form = useForm({
    defaultValues: initialValues,
    validators: { onChange: coffeeSchema, onSubmit: coffeeSchema },
    onSubmit: async ({ value }) => {
      setSaveError("");
      try {
        // value son los datos tal cual se escribieron: el trim del esquema sólo
        // se aplica en la salida de parse. Guardamos esa salida.
        await onSave(coffeeSchema.parse(value));
      } catch {
        setSaveError("No se ha podido guardar. Los datos siguen en el formulario.");
      }
    },
  });

  return (
    <form
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.Field name="name">
        {(field) => {
          const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <div className="grid gap-1">
              <label htmlFor={field.name}>Nombre</label>
              <input
                id={field.name}
                name={field.name}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={invalid}
                aria-describedby={invalid ? `${field.name}-error` : undefined}
              />
              {invalid && (
                <p id={`${field.name}-error`} role="alert" className="text-red-700">
                  {errorText(field.state.meta.errors)}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      <form.Field name="origin">
        {(field) => {
          const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <div className="grid gap-1">
              <label htmlFor={field.name}>Origen</label>
              <input
                id={field.name}
                name={field.name}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={invalid}
                aria-describedby={invalid ? `${field.name}-error` : undefined}
              />
              {invalid && (
                <p id={`${field.name}-error`} role="alert" className="text-red-700">
                  {errorText(field.state.meta.errors)}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      <form.Field name="roast">
        {(field) => {
          const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <div className="grid gap-1">
              <label htmlFor={field.name}>Tueste</label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => {
                  // event.target.value es string: sólo aceptamos uno de los tres tuestes.
                  const roast = roastOptions.find((option) => option === event.target.value);
                  if (roast !== undefined) field.handleChange(roast);
                }}
                aria-invalid={invalid}
                aria-describedby={invalid ? `${field.name}-error` : undefined}
              >
                {roastOptions.map((roast) => (
                  <option key={roast} value={roast}>
                    {roastLabels[roast]}
                  </option>
                ))}
              </select>
              {invalid && (
                <p id={`${field.name}-error`} role="alert" className="text-red-700">
                  {errorText(field.state.meta.errors)}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      <form.Field name="price">
        {(field) => {
          const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <div className="grid gap-1">
              <label htmlFor={field.name}>Precio (€)</label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                step="0.01"
                min="0"
                max={MAX_PRICE}
                // NaN no es un value válido para React: el campo vacío se pinta como "".
                value={Number.isNaN(field.state.value) ? "" : field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.valueAsNumber)}
                aria-invalid={invalid}
                aria-describedby={invalid ? `${field.name}-error` : undefined}
              />
              {invalid && (
                <p id={`${field.name}-error`} role="alert" className="text-red-700">
                  {errorText(field.state.meta.errors)}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      <form.Field name="notes">
        {(field) => {
          const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <div className="grid gap-1">
              <label htmlFor={field.name}>Notas de cata (opcional)</label>
              <textarea
                id={field.name}
                name={field.name}
                rows={3}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={invalid}
                aria-describedby={invalid ? `${field.name}-error` : undefined}
              />
              {invalid && (
                <p id={`${field.name}-error`} role="alert" className="text-red-700">
                  {errorText(field.state.meta.errors)}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      {saveError && <p role="alert">{saveError}</p>}

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando…" : "Guardar café"}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}
