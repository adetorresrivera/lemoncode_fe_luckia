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

// Cómo se nombra cada tueste en pantalla (detalle y formulario).
export const roastLabels: Record<Roast, string> = {
  light: "claro",
  medium: "medio",
  dark: "oscuro",
};

const roasts: readonly Roast[] = ["light", "medium", "dark"];

function isRoast(value: unknown): value is Roast {
  return roasts.some((roast) => roast === value);
}

export function isCoffee(value: unknown): value is Coffee {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number" &&
    "name" in value &&
    typeof value.name === "string" &&
    "origin" in value &&
    typeof value.origin === "string" &&
    "roast" in value &&
    isRoast(value.roast) &&
    "price" in value &&
    typeof value.price === "number" &&
    "notes" in value &&
    typeof value.notes === "string"
  );
}

export function isCoffeeList(value: unknown): value is Coffee[] {
  return Array.isArray(value) && value.every(isCoffee);
}

// El parámetro de la URL siempre es un string: sólo "1", "2"… son ids válidos.
// Con Number() a secas, "" daría 0, " 4" daría 4 y "0x4" también 4.
// NaN = id imposible: getCoffee lo trata como "no encontrado".
export function parseCoffeeId(value: string): number {
  return /^[1-9]\d*$/.test(value) ? Number(value) : Number.NaN;
}

// Los valores que edita el formulario: todo menos el id, que no se toca.
export function toCoffeeInput(coffee: Coffee): CoffeeInput {
  return {
    name: coffee.name,
    origin: coffee.origin,
    roast: coffee.roast,
    price: coffee.price,
    notes: coffee.notes,
  };
}
