import { useEffect, useState } from "react";
import type { Coffee } from "./model";
import { getCoffee } from "./api";

interface UseCoffeeResult {
  coffee: Coffee | undefined;
  loading: boolean;
  error: string | null;
}

export function useCoffee(id: number): UseCoffeeResult {
  const [coffee, setCoffee] = useState<Coffee | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    // Si cambia el id con el componente montado, no enseñamos el café anterior.
    setCoffee(undefined);
    setError(null);
    setLoading(true);

    async function loadCoffee(): Promise<void> {
      try {
        setCoffee(await getCoffee(id, controller.signal));
      } catch (caught) {
        if (controller.signal.aborted) return;
        const detail = caught instanceof Error ? caught.message : "error desconocido";
        setError(`No se ha podido cargar el café (${detail}).`);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadCoffee();
    return () => controller.abort();
  }, [id]);

  return { coffee, loading, error };
}
