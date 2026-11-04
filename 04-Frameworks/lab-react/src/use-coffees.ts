import { useEffect, useState } from "react";
import type { Coffee } from "./model";
import { getCoffees } from "./api";

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
