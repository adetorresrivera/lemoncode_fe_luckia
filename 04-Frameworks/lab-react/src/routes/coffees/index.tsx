import { createFileRoute } from "@tanstack/react-router";
import { CatalogScene } from "../../scenes/catalog.scene";

export const Route = createFileRoute("/coffees/")({
  component: CatalogScene,
});
