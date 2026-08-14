import { defineConfig } from "vite";

export default defineConfig(
  async ({ command, mode, isSsrBuild, isPreview }) => {
    return {
      base: "/",
      build: {
        copyPublicDir: true,
        emptyOutDir: true,
      },
      input: "index.md",
      publicDir: "assets",
      root: process.cwd(),
    };
  }
);