import { defineConfig } from "vite";
const path = require("path");
import { ViteAliases } from "vite-aliases";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false, // TODO maybe?
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "@gliff-ai/gliff-ts",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        "react",
        "react-dom",
        "react-router-dom",
        "@mui/material",
        "@mui/icons-material",
        "@mui/styles",
        "@mui/system",
        "@emotion/react",
        "@emotion/styled",
        "@gliff-ai/style",
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {},
      },
    },
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  plugins: [ViteAliases()],
});