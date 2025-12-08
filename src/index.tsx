import { createRoot } from "react-dom/client";

import CrafterApp from "./CrafterApp";
import "./styles/style.css";
import "./styles/desert-theme.css";
import { BrowserRouter } from "react-router";
import "./i18n";
import LanguageRouter from "@components/LanguageRouter";

createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <LanguageRouter>
      <CrafterApp />
    </LanguageRouter>
  </BrowserRouter>,
);
