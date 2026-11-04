import { useState } from "react";
import type { Coffee } from "./model";
import { CoffeeCard } from "./coffee-card";

const coffees: Coffee[] = [
  {
    id: 1,
    name: "Etiopía Yirgacheffe",
    origin: "Etiopía",
    roast: "light",
    price: 14.9,
    notes: "Floral, bergamota y té negro.",
  },
  {
    id: 2,
    name: "Colombia Huila",
    origin: "Colombia",
    roast: "medium",
    price: 12.9,
    notes: "Caramelo y manzana roja.",
  },
  {
    id: 3,
    name: "Kenia AA",
    origin: "Kenia",
    roast: "light",
    price: 15.5,
    notes: "Frutos rojos y pomelo.",
  },
  {
    "id": 4,
    "name": "Brasil Cerrado",
    "origin": "Brasil",
    "roast": "dark",
    "price": 10.5,
    "notes": "Chocolate y avellana."
  },
];

export function App() {
  const [cart, setCart] = useState<Coffee[]>([]);
  const [query, setQuery] = useState("");

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

  return (
    <main>
      <h1>Tueste</h1>
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
    </main>
  );
}
