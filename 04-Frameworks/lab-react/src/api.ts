import type { Coffee } from "./model";
import { isCoffeeList } from "./model";

export async function getCoffees(signal: AbortSignal): Promise<Coffee[]> {
  const response = await fetch("/coffees.json", { signal });
  if (!response.ok) throw new Error(`El servidor respondió ${response.status}`);
  const data: unknown = await response.json();
  if (!isCoffeeList(data)) throw new Error("La respuesta no es una lista de cafés");
  return data;
}

export async function getCoffee(id: number, signal: AbortSignal): Promise<Coffee | undefined> {
  // Un id que no es un entero positivo no puede existir: ni siquiera pedimos el JSON.
  if (!Number.isSafeInteger(id) || id < 1) return undefined;
  const coffees = await getCoffees(signal);
  return coffees.find((coffee) => coffee.id === id);
}
