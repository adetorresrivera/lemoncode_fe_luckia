import { createFileRoute } from "@tanstack/react-router";
import { NewCoffeeScene } from "../../scenes/new-coffee.scene";

export const Route = createFileRoute("/coffees/new")({
  component: NewCoffeeScene,
});
