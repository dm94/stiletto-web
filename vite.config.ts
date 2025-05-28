import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*.css"],
      serverModuleFormat: "cjs",
    }),
    tsconfigPaths(),
  ],
  ssr: {
    noExternal: ["i18next-fs-backend", "remix-i18next", "i18next"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
