import { useEffect, useState } from "react";
import type { Coffee } from "./model";
import { isCoffeeList } from "./model";

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

  return { coffees, loading, error };
}
