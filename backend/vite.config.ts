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
    testTimeout: 0,
    hookTimeout: 0,
    environment: "node",
    restoreMocks: true,
    clearMocks: true,
    globals: true,
    include: ["tests/**/*.test.ts"],
    testNamePattern: "magic.chess",
    reporters: "verbose",
    hideSkippedTests: true,
  },
});
