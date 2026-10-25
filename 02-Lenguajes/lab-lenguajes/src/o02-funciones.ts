import type { Roast } from "./types";
import { coffees } from "./data";

export function formatPrice(price: number, currency = "€"): string {
  return `${price.toFixed(2)} ${currency}`;
}

export function stockStatus(stock: number): string {
  if (stock === 0) {
    return "Agotado";
  } else if (stock < 5) {
    return "Últimas unidades";
  } else {
    return "Disponible";
  }
}

export function roastLabel(roast: Roast): string {
  switch (roast) {
    case "light":
      return "Tueste claro";
    case "medium":
      return "Tueste medio";
    case "dark":
      return "Tueste oscuro";
  }
}
// 🔍 Si quitamos el `case "dark"`, `npx tsc` responde:
// → error TS2366: Function lacks ending return statement and return type does not include 'undefined'.
// TypeScript estrecha `roast` en cada case: tras "light" y "medium" aún queda
// "dark" sin cubrir, así que con roast === "dark" la función llegaría al final
// sin `return` y devolvería undefined, que no cabe en `string`.
// Con los tres cases, después del switch `roast` es `never` y ese final es
// inalcanzable: por eso no hace falta `default`.

console.log(formatPrice(14.9));
// → "14.90 €"
console.log(formatPrice(14.9, "$"));
// → "14.90 $"
console.log(formatPrice(10));
// → "10.00 €"

for (const coffee of coffees) {
  console.log(`${coffee.name} · ${roastLabel(coffee.roast)} · ${stockStatus(coffee.stock)}`);
}
// → Etiopía Yirgacheffe · Tueste claro · Disponible
// → Colombia Huila · Tueste medio · Últimas unidades
// → Kenia AA · Tueste claro · Agotado
// → Brasil Cerrado · Tueste oscuro · Disponible
// → Guatemala Antigua · Tueste medio · Disponible
// → Sumatra Mandheling · Tueste oscuro · Agotado
