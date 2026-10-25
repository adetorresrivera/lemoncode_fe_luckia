// Una regla de precio: recibe un precio y devuelve otro.
type PriceRule = (price: number) => number;

// `rate` queda capturado: la función devuelta lo recuerda aunque
// `createDiscount` ya haya terminado.
export const createDiscount = (rate: number): PriceRule =>
  (price) => price * (1 - rate);

// Cada llamada crea su propio `count`. La función devuelta es la única que
// puede leerlo y cambiarlo; desde fuera no hay forma de tocarlo.
export const createOrderIdGenerator = (prefix: string): (() => string) => {
  let count = 0;
  return () => {
    count += 1;
    return `${prefix}-${count}`;
  };
};

const blackFriday = createDiscount(0.2);
const members = createDiscount(0.1);

console.log(blackFriday(10));
// → 8
console.log(members(10));
// → 9
console.log([10, 20, 15].map(blackFriday));
// → [8, 16, 12]

const nextOrderId = createOrderIdGenerator("TUE");
const nextGiftId = createOrderIdGenerator("REGALO");

console.log(nextOrderId());
// → "TUE-1"
console.log(nextOrderId());
// → "TUE-2"
console.log(nextGiftId());
// → "REGALO-1"
console.log(nextOrderId());
// → "TUE-3"

// 📝 ¿Por qué `.map(blackFriday)` va sin paréntesis?
// Porque a `map` le pasamos la función, no su resultado. `blackFriday` es un
// valor de tipo PriceRule y `map` se encarga de llamarla con cada elemento.
// `blackFriday()` la ejecutaría ya, sin precio (TypeScript da error: falta un
// argumento) y le pasaría a `map` un número en vez de una función.
// Ojo: `map` llama con (elemento, índice, array); aquí da igual porque
// PriceRule solo usa el primero.

// 📝 ¿`blackFriday` es pura?
// Sí. Solo usa su parámetro `price` y `rate`, que está capturado pero nunca
// cambia (es un parámetro que nadie reasigna). Misma entrada, misma salida
// siempre, y no modifica nada de fuera.

// 📝 ¿Y `nextOrderId`?
// No. Llamada dos veces sin argumentos devuelve "TUE-1" y luego "TUE-2": no
// es determinista. Y tiene un efecto secundario: cada llamada modifica
// `count`, que vive fuera de ella (en el closure).
