/// <reference types="vitest/config" />
/// <reference types="@vitest/browser/matchers" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { internalIpV4 } from "internal-ip";
import svgr from "vite-plugin-svgr";
import path from "path";

const mobile = !!/android|ios/.exec(process.env.TAURI_ENV_PLATFORM);

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), svgr()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: mobile ? "0.0.0.0" : false,
    hmr: mobile
      ? {
          protocol: "ws",
          host: await internalIpV4(),
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, '.'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: [ 'text', 'json', 'html' ]
    },
    testTimeout: 10000,
    setupFiles: "./vitest-setup.ts",
    exclude: ['**/node_modules/**', '**/src-tauri/**'],
  }
}));
