import type { Coffee, CoffeeInput } from "./model";
import { isCoffeeList } from "./model";

// Clave propia en localStorage: guarda la lista completa (los 6 iniciales + los nuevos).
const STORAGE_KEY = "tueste.coffees";
// Retraso simulado al guardar, para que se vea el botón desactivado.
const SAVE_DELAY_MS = 600;

// undefined = no hay nada guardado (o lo guardado no es una lista de cafés válida).
function readStoredCoffees(): Coffee[] | undefined {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return undefined;
  try {
    const data: unknown = JSON.parse(raw);
    return isCoffeeList(data) ? data : undefined;
  } catch {
    return undefined;
  }
}

async function fetchInitialCoffees(signal?: AbortSignal): Promise<Coffee[]> {
  const response = await fetch("/coffees.json", { signal });
  if (!response.ok) throw new Error(`El servidor respondió ${response.status}`);
  const data: unknown = await response.json();
  if (!isCoffeeList(data)) throw new Error("La respuesta no es una lista de cafés");
  return data;
}

export async function getCoffees(signal?: AbortSignal): Promise<Coffee[]> {
  return readStoredCoffees() ?? fetchInitialCoffees(signal);
}

export async function getCoffee(id: number, signal: AbortSignal): Promise<Coffee | undefined> {
  // Un id que no es un entero positivo no puede existir: ni siquiera pedimos el JSON.
  if (!Number.isSafeInteger(id) || id < 1) return undefined;
  // getCoffees ya mira primero en localStorage: encuentra también los cafés nuevos.
  const coffees = await getCoffees(signal);
  return coffees.find((coffee) => coffee.id === id);
}

export async function saveCoffee(input: CoffeeInput): Promise<Coffee> {
  await new Promise<void>((resolve) => setTimeout(resolve, SAVE_DELAY_MS));
  const coffees = await getCoffees();
  const id = Math.max(0, ...coffees.map((coffee) => coffee.id)) + 1;
  const coffee: Coffee = { ...input, id };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...coffees, coffee]));
  return coffee;
}
