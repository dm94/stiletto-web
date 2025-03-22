import { createRoot } from "react-dom/client";

import CrafterApp from "./CrafterApp";
import "./css/normalize.css";
import "./css/style.css";
import { BrowserRouter } from "react-router";
import './i18n';

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <BrowserRouter>
    <CrafterApp />
  </BrowserRouter>
);
