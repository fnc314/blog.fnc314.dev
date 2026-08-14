import { defineConfig } from "vite";

export default defineConfig(
  async ({ command, mode, isSsrBuild, isPreview }) => {
    return {
      base: "/",
      build: {
        copyPublicDir: true,
        emptyOutDir: true,
      },
      publicDir: "assets",
      root: process.cwd(),
    };
  }
);