import { useState } from "react";
import type { Coffee } from "../../core/coffees/model";
import { useCoffees } from "../../core/coffees/hooks";
import { ErrorMessage, LoadingMessage } from "../../common/components";
import { CoffeeList } from "./coffee-list.component";

// Dueño de los datos del catálogo: la lista (del hook), el carrito y la búsqueda.
// Calcula lo derivado (bolsas, total, lista filtrada) y decide qué se pinta.
export function CoffeeListContainer() {
  const { coffees, loading, error } = useCoffees();
  const [cart, setCart] = useState<Coffee[]>([]);
  const [query, setQuery] = useState("");

  const bags = cart.length;
  const total = cart.reduce((sum, coffee) => sum + coffee.price, 0);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleCoffees = coffees.filter((coffee) =>
    coffee.name.toLowerCase().includes(normalizedQuery),
  );

  function addToCart(coffee: Coffee): void {
    setCart((previous) => [...previous, coffee]);
  }

  function emptyCart(): void {
    setCart([]);
  }

  if (loading) {
    return (
      <>
        <h1>Catálogo</h1>
        <LoadingMessage />
      </>
    );
  }

  if (error !== null) {
    return (
      <>
        <h1>Catálogo</h1>
        <ErrorMessage message={error} />
      </>
    );
  }

  return (
    <CoffeeList
      totalCount={coffees.length}
      visibleCoffees={visibleCoffees}
      bags={bags}
      total={total}
      query={query}
      onQueryChange={setQuery}
      onAdd={addToCart}
      onEmptyCart={emptyCart}
    />
  );
}
