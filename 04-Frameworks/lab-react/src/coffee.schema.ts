import { z } from "zod";
import type { CoffeeInput } from "./model";

// Tope de precio por bolsa: los cafés del catálogo están entre 10 y 16 €,
// así que 100 € deja margen y frena errores de tecleo (1290 en vez de 12.90).
export const MAX_PRICE = 100;

export const coffeeSchema = z.object({
  name: z.string().trim().min(2, "El nombre necesita al menos 2 caracteres"),
  origin: z.string().trim().min(2, "El origen necesita al menos 2 caracteres"),
  roast: z.enum(["light", "medium", "dark"], "Elige un tueste: claro, medio u oscuro"),
  // El mensaje del primer argumento sale cuando no llega un número: un campo
  // vacío da NaN con valueAsNumber y Zod 4 rechaza NaN como "invalid_type".
  price: z
    .number("Indica el precio")
    .gt(0, "El precio tiene que ser mayor que 0")
    .max(MAX_PRICE, `El precio no puede pasar de ${MAX_PRICE} €`),
  notes: z.string().trim().max(120, "Las notas pueden tener como mucho 120 caracteres"),
});

// Comprobación de tipos sin `as`: si el esquema y CoffeeInput dejan de
// coincidir (un campo de más, de menos o con otro tipo), `Expect` recibe
// `false` y tsc falla aquí. No genera código: sólo existe en compilación.
type Equals<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

// Lo que entra al esquema (los valores del formulario) y lo que sale (lo que se guarda).
export type CoffeeSchemaInputMatches = Expect<Equals<z.input<typeof coffeeSchema>, CoffeeInput>>;
export type CoffeeSchemaOutputMatches = Expect<Equals<z.output<typeof coffeeSchema>, CoffeeInput>>;
