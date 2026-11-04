import type { Coffee, CoffeeInput } from "./model";
import { isCoffeeList } from "./model";

// Clave propia en localStorage: guarda la lista completa (los 6 iniciales + los nuevos).
const STORAGE_KEY = "tueste.coffees";
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

// Retraso simulado: así se ve el botón "Guardando…" desactivado.
function wait(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function storeCoffees(coffees: Coffee[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(coffees));
}

// Alta: id nuevo = máximo + 1 (el 0 cubre una lista vacía) y se añade al final.
export async function createCoffee(input: CoffeeInput): Promise<Coffee> {
  await wait(SAVE_DELAY_MS);
  const coffees = await getCoffees();
  const id = Math.max(0, ...coffees.map((coffee) => coffee.id)) + 1;
  const coffee: Coffee = { ...input, id };
  storeCoffees([...coffees, coffee]);
  return coffee;
}

// Edición: el café conserva su id y ocupa el mismo sitio en la lista.
// map devuelve una lista nueva; los demás cafés son las mismas referencias.
export async function updateCoffee(id: number, input: CoffeeInput): Promise<Coffee> {
  await wait(SAVE_DELAY_MS);
  const coffees = await getCoffees();
  // Si el café ya no existe (lo borraron en otra pestaña), no creamos uno nuevo
  // sin avisar: el formulario enseña su mensaje de "No se ha podido guardar".
  if (!coffees.some((coffee) => coffee.id === id)) {
    throw new Error(`No existe el café ${id}`);
  }
  const updated: Coffee = { ...input, id };
  storeCoffees(coffees.map((coffee) => (coffee.id === id ? updated : coffee)));
  return updated;
}
