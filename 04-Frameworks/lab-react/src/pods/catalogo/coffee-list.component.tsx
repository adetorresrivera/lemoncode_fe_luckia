import { useRef } from "react";
import type { Coffee } from "../../core/coffees/model";
import { CoffeeCard } from "./components/coffee-card";

export interface CoffeeListProps {
  totalCount: number;
  visibleCoffees: Coffee[];
  bags: number;
  total: number;
  query: string;
  onQueryChange: (query: string) => void;
  onAdd: (coffee: Coffee) => void;
  onEmptyCart: () => void;
}

// Sólo pinta lo que recibe. El único hook es el ref del buscador: no es un
// dato de la aplicación, es un asa al <input> para moverle el foco.
export function CoffeeList({
  totalCount,
  visibleCoffees,
  bags,
  total,
  query,
  onQueryChange,
  onAdd,
  onEmptyCart,
}: CoffeeListProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  const summary = `${totalCount} ${totalCount === 1 ? "café" : "cafés"} este mes`;
  const cartSummary = `${bags} ${bags === 1 ? "bolsa" : "bolsas"} · ${total.toFixed(2)} €`;

  function focusSearch(): void {
    searchRef.current?.focus();
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
        <button type="button" onClick={onEmptyCart} disabled={bags === 0}>
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
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>

      {visibleCoffees.length === 0 ? (
        <p>Sin resultados</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {visibleCoffees.map((coffee) => (
            <li key={coffee.id}>
              <CoffeeCard coffee={coffee} onAdd={onAdd} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
