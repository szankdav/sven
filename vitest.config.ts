/// <reference types="vitest" />
import {
  configDefaults,
  coverageConfigDefaults,
  defineConfig,
} from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "istanbul",
      exclude: [
        "**/src/index.ts**",
        "**playwright.config.ts",
        "**/public**",
        "**/src/config.ts**",
        ...coverageConfigDefaults.exclude,
      ],
    },
    exclude: [...configDefaults.exclude, "./tests/*"],
  },
});
