/**
 * Global configuration for Playwright tests
 * This file runs once before all tests
 */
import type { FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  // Here you can perform global configurations before tests are executed
  // For example, configure authentication state, prepare data, etc.
  console.log("Starting Playwright tests...");
}

export default globalSetup;
