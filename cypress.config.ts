import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      // Configuración de eventos
    },
    baseUrl: "http://localhost:5173",
  },
});
