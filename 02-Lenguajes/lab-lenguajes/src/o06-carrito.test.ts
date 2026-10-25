import { describe, expect, it } from "vitest";
import { coffees } from "./data";
import { formatPrice } from "./o02-funciones";
import type { Cart } from "./o06-carrito";
import { addToCart, cartTotal, changeQuantity, removeFromCart } from "./o06-carrito";

// La misma secuencia que en la kata: cada paso parte del carrito anterior.
const empty: Cart = [];
const cart1 = addToCart(empty, 1);
const cart2 = addToCart(cart1, 4);
const cart3 = addToCart(cart2, 1);
const cart4 = changeQuantity(cart3, 4, 3);
const cart5 = removeFromCart(cart4, 1);
const cart6 = changeQuantity(cart5, 4, 0);

describe("addToCart", () => {
  it("añade un café nuevo con cantidad 1", () => {
    expect(cart1).toEqual([{ coffeeId: 1, quantity: 1 }]);
  });

  it("suma 1 si el café ya está en el carrito", () => {
    expect(cart3).toEqual([
      { coffeeId: 1, quantity: 2 },
      { coffeeId: 4, quantity: 1 },
    ]);
  });
});

describe("changeQuantity", () => {
  it("cambia la cantidad de un café", () => {
    expect(cart4).toEqual([
      { coffeeId: 1, quantity: 2 },
      { coffeeId: 4, quantity: 3 },
    ]);
  });

  it("quita el café si la cantidad es 0", () => {
    expect(cart6).toEqual([]);
  });
});

describe("removeFromCart", () => {
  it("quita el café del carrito", () => {
    expect(cart5).toEqual([{ coffeeId: 4, quantity: 3 }]);
  });
});

describe("cartTotal", () => {
  it("suma el precio con descuento por cantidad", () => {
    expect(formatPrice(cartTotal(cart4, coffees))).toBe("58.32 €");
  });

  it("ignora los cafés que no existen", () => {
    expect(formatPrice(cartTotal([{ coffeeId: 99, quantity: 1 }], coffees))).toBe("0.00 €");
  });
});

describe("no modifica el carrito original", () => {
  it("los carritos anteriores siguen como estaban", () => {
    expect(empty).toEqual([]);
    expect(cart1).toEqual([{ coffeeId: 1, quantity: 1 }]);
    expect(cart2).toEqual([
      { coffeeId: 1, quantity: 1 },
      { coffeeId: 4, quantity: 1 },
    ]);
  });
});

describe("sólo se copia lo que cambia", () => {
  it("cada operación devuelve un carrito nuevo", () => {
    expect(cart3).not.toBe(cart2);
  });

  it("el café que cambia es un objeto nuevo", () => {
    expect(cart3[0]).not.toBe(cart2[0]);
  });

  it("el café que no cambia se comparte", () => {
    expect(cart3[1]).toBe(cart2[1]);
  });
});
