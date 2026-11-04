import { useEffect, useState } from "react";
import type { Coffee } from "./model";
import { isCoffeeList } from "./model";
import { CoffeeCard } from "./coffee-card";

export function App() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Coffee[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadCoffees(): Promise<void> {
      try {
        const response = await fetch("/coffees.json", { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`El servidor respondió ${response.status}`);
        }
        const data: unknown = await response.json();
        if (!isCoffeeList(data)) {
          throw new Error("La respuesta no es una lista de cafés");
        }
        setCoffees(data);
      } catch (caught) {
        // La limpieza abortó esta petición: no es un error que enseñar.
        if (controller.signal.aborted) return;
        const detail = caught instanceof Error ? caught.message : "error desconocido";
        setError(`No se han podido cargar los cafés (${detail}).`);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadCoffees();
    return () => controller.abort();
  }, []);

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

  if (loading) {
    return (
      <main>
        <h1>Tueste</h1>
        <p role="status">Cargando…</p>
      </main>
    );
  }

  if (error !== null) {
    return (
      <main>
        <h1>Tueste</h1>
        <p role="alert">{error}</p>
      </main>
    );
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
