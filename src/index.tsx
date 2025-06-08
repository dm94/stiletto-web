import { createRoot } from "react-dom/client";
import CrafterApp from "./CrafterApp";
import "./styles/normalize.css";
import "./styles/style.css";
import "./styles/tribal-ui.css";
import "./styles/desert-theme.css";
import "./i18n";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree"; // Import routeTree
import { UserProvider } from "./store/userStore";
import { Suspense } from "react";
import LoadingScreen from "@components/LoadingScreen";
import VanillaCookieConsent from "@components/VanillaCookieConsent";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <Suspense fallback={<LoadingScreen />}>
      <UserProvider> {/* UserProvider should wrap RouterProvider */}
        <RouterProvider router={router} />
      </UserProvider>
      <VanillaCookieConsent />
    </Suspense>,
  );
}
