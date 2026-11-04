import { useEffect, useState } from "react";
import type { Coffee } from "./model";
import { getCoffee, getCoffees } from "./api";

interface UseCoffeesResult {
  coffees: Coffee[];
  loading: boolean;
  error: string | null;
}

export function useCoffees(): UseCoffeesResult {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCoffees(): Promise<void> {
      try {
        setCoffees(await getCoffees(controller.signal));
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

  return { coffees, loading, error };
}

interface UseCoffeeResult {
  coffee: Coffee | undefined;
  loading: boolean;
  error: string | null;
}

// Sin id (el formulario en modo alta) no hay nada que cargar: el hook se llama
// igual, porque los hooks no pueden ir dentro de un if, y devuelve loading false.
export function useCoffee(id: number | undefined): UseCoffeeResult {
  const [coffee, setCoffee] = useState<Coffee | undefined>(undefined);
  const [loading, setLoading] = useState(id !== undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si cambia el id con el componente montado, no enseñamos el café anterior.
    setCoffee(undefined);
    setError(null);
    setLoading(id !== undefined);
    if (id === undefined) return;

    const controller = new AbortController();

    async function loadCoffee(coffeeId: number): Promise<void> {
      try {
        setCoffee(await getCoffee(coffeeId, controller.signal));
      } catch (caught) {
        if (controller.signal.aborted) return;
        const detail = caught instanceof Error ? caught.message : "error desconocido";
        setError(`No se ha podido cargar el café (${detail}).`);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadCoffee(id);
    return () => controller.abort();
  }, [id]);

  return { coffee, loading, error };
}
