import type { Coffee } from "./model";

interface CoffeeCardProps {
  coffee: Coffee;
  onAdd: (coffee: Coffee) => void;
}

export function CoffeeCard({ coffee, onAdd }: CoffeeCardProps) {
  return (
    <article className="flex h-full flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2>{coffee.name}</h2>
      <p className="text-slate-600">{coffee.origin}</p>
      <p className="font-semibold">{coffee.price.toFixed(2) + " €"}</p>
      <button type="button" className="mt-auto self-start" onClick={() => onAdd(coffee)}>
        Añadir al carrito
      </button>
    </article>
  );
}
