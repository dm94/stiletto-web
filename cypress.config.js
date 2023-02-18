const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "6a74ez",
  e2e: {
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    baseUrl: "http://localhost:3000",
    experimentalRunAllSpecs: true,
  },
});
