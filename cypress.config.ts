const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
  },
  fixturesFolder: "cypress/fixtures",
  video: false,
  viewportWidth: 1280,
  viewportHeight: 720,
});
