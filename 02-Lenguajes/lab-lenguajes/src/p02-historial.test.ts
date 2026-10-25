import { describe, expect, it } from "vitest";
import { createCartHistory } from "./p02-historial";

describe("createCartHistory", () => {
  it("empieza con el carrito vacío", () => {
    expect(createCartHistory().current()).toEqual([]);
  });

  it("deshace el último cambio (ejemplo de lab.md)", () => {
    const history = createCartHistory();
    history.add(1);
    history.add(4);
    history.undo();
    expect(history.current()).toEqual([{ coffeeId: 1, quantity: 1 }]);
  });

  it("deshace varios cambios seguidos, también remove", () => {
    const history = createCartHistory();
    history.add(1);
    history.add(1);
    history.add(4);
    history.remove(1);
    history.undo();
    expect(history.current()).toEqual([
      { coffeeId: 1, quantity: 2 },
      { coffeeId: 4, quantity: 1 },
    ]);
    history.undo();
    history.undo();
    expect(history.current()).toEqual([{ coffeeId: 1, quantity: 1 }]);
  });

  it("undo de más no rompe: se queda en el carrito vacío", () => {
    const history = createCartHistory();
    history.add(1);
    history.undo();
    history.undo();
    history.undo();
    expect(history.current()).toEqual([]);
    history.add(4);
    expect(history.current()).toEqual([{ coffeeId: 4, quantity: 1 }]);
  });

  it("undo devuelve el mismo carrito que había, no una copia", () => {
    const history = createCartHistory();
    history.add(1);
    const before = history.current();
    history.add(4);
    history.undo();
    expect(history.current()).toBe(before);
  });

  it("los carritos guardados comparten los cafés que no cambian", () => {
    const history = createCartHistory();
    history.add(1);
    const before = history.current();
    history.add(4);
    expect(history.current()).not.toBe(before);
    expect(history.current()[0]).toBe(before[0]);
  });

  it("cada historial es independiente", () => {
    const a = createCartHistory();
    const b = createCartHistory();
    a.add(1);
    expect(b.current()).toEqual([]);
  });
});
