// Unión discriminada: todos los miembros comparten `type`, y cada uno tiene un
// literal distinto. Ese literal es lo que TypeScript usa para estrechar.
export type PaymentMethod =
  | { type: "card"; last4: string }
  | { type: "bizum"; phone: string }
  | { type: "transfer"; iban: string };
// | { type: "paypal"; email: string };

// `value: never` solo acepta algo que TypeScript ya ha descartado del todo.
// Devuelve `never` porque nunca termina con normalidad: siempre lanza. El
// `throw` cubre el caso en tiempo de ejecución (datos que no pasaron por tsc).
const assertNever = (value: never): never => {
  throw new Error(`Método de pago no contemplado: ${JSON.stringify(value)}`);
};

export const describePayment = (method: PaymentMethod): string => {
  switch (method.type) {
    case "card":
      // Aquí `method` es `{ type: "card"; last4: string }`.
      return `Tarjeta acabada en ${method.last4}`;
    case "bizum":
      return `Bizum al ${method.phone}`;
    case "transfer":
      return `Transferencia a ${method.iban}`;
    default:
      // Ya se han descartado los tres miembros: `method` es `never`.
      return assertNever(method);
  }
};

// 🔍 Con `paypal` en la unión y sin su `case`:
// error TS2345 en `assertNever(method)`: Argument of type '{ type: "paypal";
// email: string; }' is not assignable to parameter of type 'never'.

console.log(describePayment({ type: "card", last4: "4242" }));
// → "Tarjeta acabada en 4242"
console.log(describePayment({ type: "bizum", phone: "600123456" }));
// → "Bizum al 600123456"
console.log(describePayment({ type: "transfer", iban: "ES91 2100 0418 4502 0005 1332" }));
// → "Transferencia a ES91 2100 0418 4502 0005 1332"
