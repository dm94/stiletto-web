"use client";

import "../../styles/normalize.css";
import "../../styles/style.css";
import "../../styles/tribal-ui.css";
import "../../styles/desert-theme.css";
import { BrowserRouter } from "react-router";
import "../../i18n";
import dynamic from "next/dynamic";

const App = dynamic(() => import("../../CrafterApp"), { ssr: false });

export default function ClientOnly() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
