import { defineConfig } from "vitest/config";
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitest.dev/config/
export default defineConfig({
  test: {
    globalSetup: ["./test/globalSetup.ts"],
    setupFiles: ["./test/setup.ts"],
  },
  plugins: [tsconfigPaths()],
});
