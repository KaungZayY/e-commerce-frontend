// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["./app/assets/css/main.css"],
  ssr: false,
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_APP_API_URL // reads from .env
    }
  }
});
