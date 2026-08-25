import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  root: path.resolve(import.meta.dirname),
  // plugins: [tsconfigPaths()],
  resolve: {
    tsconfigPaths: true,
  },

  test: {
    setupFiles: "./tests/setup/vitest.setup.ts",
    passWithNoTests: true,
    environment: "node",
    restoreMocks: true,
    clearMocks: true,
    globals: true,
    include: ["tests/**/*.test.ts"],
  },
});
