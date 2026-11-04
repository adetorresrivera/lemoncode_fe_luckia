import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { Coffee } from "../../model";
import { CoffeeCard } from "../../coffee-card";
import { useCoffees } from "../../use-coffees";

export const Route = createFileRoute("/coffees/")({
  component: CoffeesPage,
});

function CoffeesPage() {
  const { coffees, loading, error } = useCoffees();
  const [cart, setCart] = useState<Coffee[]>([]);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const count = coffees.length;
  const summary = `${count} ${count === 1 ? "café" : "cafés"} este mes`;

  const bags = cart.length;
  const total = cart.reduce((sum, coffee) => sum + coffee.price, 0);
  const cartSummary = `${bags} ${bags === 1 ? "bolsa" : "bolsas"} · ${total.toFixed(2)} €`;

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

  function focusSearch(): void {
    searchRef.current?.focus();
  }

  if (loading) {
    return (
      <>
        <h1>Catálogo</h1>
        <p role="status">Cargando…</p>
      </>
    );
  }

  if (error !== null) {
    return (
      <>
        <h1>Catálogo</h1>
        <p role="alert">{error}</p>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1>Catálogo</h1>
        <button type="button" onClick={focusSearch}>
          Buscar
        </button>
      </div>
      <p>{summary}</p>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white p-4 shadow-sm">
        <p aria-live="polite" className="font-semibold">
          {cartSummary}
        </p>
        <button type="button" onClick={emptyCart} disabled={cart.length === 0}>
          Vaciar
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="search">Buscar por nombre</label>
        <input
          ref={searchRef}
          id="search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {visibleCoffees.length === 0 ? (
        <p>Sin resultados</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {visibleCoffees.map((coffee) => (
            <li key={coffee.id}>
              <CoffeeCard coffee={coffee} onAdd={addToCart} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
