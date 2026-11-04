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
