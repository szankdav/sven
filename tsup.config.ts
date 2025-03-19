import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"],
  format: ["esm"],
  target: "esnext",
  clean: true,
  outDir: "dist",
  splitting: false,
  shims: true,
  bundle: false,
  minify: false,
  keepNames: true,
});
