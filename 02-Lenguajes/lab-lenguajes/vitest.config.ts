import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Las katas hacen console.log al importarlas. Se ocultan si los tests
    // pasan y se muestran si alguno falla, para poder depurar.
    silent: "passed-only",
  },
});
