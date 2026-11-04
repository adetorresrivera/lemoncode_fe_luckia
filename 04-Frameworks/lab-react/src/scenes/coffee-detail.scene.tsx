import { CoffeeDetailContainer } from "../pods/catalogo";

interface CoffeeDetailSceneProps {
  coffeeId: number;
}

export function CoffeeDetailScene({ coffeeId }: CoffeeDetailSceneProps) {
  return <CoffeeDetailContainer coffeeId={coffeeId} />;
}
