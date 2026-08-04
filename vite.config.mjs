import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "dist",
    // EdgeOne Pages / 静态托管：资源使用相对路径，兼容子路径部署
    base: "./",
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-vue": ["vue", "vue-router", "pinia"],
          "vendor-element": ["element-plus"],
          "vendor-icons": ["@phosphor-icons/vue"],
        },
      },
    },
  },
  server: {
    port: 4173,
    host: true,
  },
});
