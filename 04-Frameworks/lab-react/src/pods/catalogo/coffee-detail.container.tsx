import { useCoffee } from "../../core/coffees/hooks";
import { ErrorMessage, LoadingMessage, NotFoundMessage } from "../../common/components";
import { CoffeeDetail } from "./coffee-detail.component";
import { BackToCatalogLink } from "./components/back-to-catalog-link";

export interface CoffeeDetailContainerProps {
  // Ya convertido a número por la ruta (NaN si el parámetro no era un id).
  coffeeId: number;
}

export function CoffeeDetailContainer({ coffeeId }: CoffeeDetailContainerProps) {
  const { coffee, loading, error } = useCoffee(coffeeId);

  if (loading) {
    return <LoadingMessage />;
  }

  if (error !== null) {
    return (
      <>
        <h1>Detalle del café</h1>
        <ErrorMessage message={error} />
        <BackToCatalogLink />
      </>
    );
  }

  if (coffee === undefined) {
    return (
      <NotFoundMessage title="Café no encontrado">
        <BackToCatalogLink />
      </NotFoundMessage>
    );
  }

  return <CoffeeDetail coffee={coffee} />;
}
