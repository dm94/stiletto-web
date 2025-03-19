import React from "react";
import { createRoot } from "react-dom/client";

import CrafterApp from "./CrafterApp";
import "./css/normalize.css";
import "./css/style.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { BrowserRouter as Router } from "react-router";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <I18nextProvider i18n={i18n}>
    <Router>
      <CrafterApp />
    </Router>
  </I18nextProvider>,
);
