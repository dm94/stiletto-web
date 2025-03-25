import { createRoot } from "react-dom/client";

import CrafterApp from "./CrafterApp";
import "./styles/normalize.css";
import "./styles/style.css";
import "./styles/tribal-ui.css";
import "./styles/desert-theme.css";
import { BrowserRouter } from "react-router";
import "./i18n";

createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <CrafterApp />
  </BrowserRouter>,
);
