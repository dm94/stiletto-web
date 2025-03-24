import { createRoot } from "react-dom/client";

import CrafterApp from "./CrafterApp";
import "./styles/normalize.css";
import "./styles/style.css";
import { BrowserRouter } from "react-router";
import "./i18n";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <BrowserRouter>
    <CrafterApp />
  </BrowserRouter>,
);
