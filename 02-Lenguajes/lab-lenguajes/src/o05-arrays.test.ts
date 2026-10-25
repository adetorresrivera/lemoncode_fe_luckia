import { describe, expect, it } from "vitest";
import { coffees } from "./data";
import { formatPrice } from "./o02-funciones";
import { availableCoffees, catalogLabels, stockValue } from "./o05-arrays";

describe("availableCoffees", () => {
  it("deja solo los cafés con stock", () => {
    expect(availableCoffees(coffees).map((coffee) => coffee.name)).toEqual([
      "Etiopía Yirgacheffe",
      "Colombia Huila",
      "Brasil Cerrado",
      "Guatemala Antigua",
    ]);
  });
});

describe("catalogLabels", () => {
  it("devuelve las etiquetas de los cafés con stock, de más barato a más caro", () => {
    expect(catalogLabels(coffees)).toEqual([
      "Brasil Cerrado (Brasil) · 10.50 €",
      "Colombia Huila (Colombia) · 12.90 €",
      "Guatemala Antigua (Guatemala) · 13.20 €",
      "Etiopía Yirgacheffe (Etiopía) · 14.90 €",
    ]);
  });

  it("no reordena el catálogo original", () => {
    catalogLabels(coffees);
    expect(coffees.map((coffee) => coffee.name)).toEqual([
      "Etiopía Yirgacheffe",
      "Colombia Huila",
      "Kenia AA",
      "Brasil Cerrado",
      "Guatemala Antigua",
      "Sumatra Mandheling",
    ]);
  });
});

describe("stockValue", () => {
  it("suma precio × stock de todo el catálogo", () => {
    expect(formatPrice(stockValue(coffees))).toBe("585.60 €");
  });
});

describe("some, every y find sobre el catálogo", () => {
  it("hay algún café agotado", () => {
    expect(coffees.some((coffee) => coffee.stock === 0)).toBe(true);
  });

  it("todos los cafés tienen notas de cata", () => {
    expect(coffees.every((coffee) => coffee.notes.length > 0)).toBe(true);
  });

  it("encuentra un café por id", () => {
    expect(coffees.find((coffee) => coffee.id === 4)?.name ?? "No existe").toBe("Brasil Cerrado");
  });

  it("devuelve el texto por defecto si el id no existe", () => {
    expect(coffees.find((coffee) => coffee.id === 99)?.name ?? "No existe").toBe("No existe");
  });
});
