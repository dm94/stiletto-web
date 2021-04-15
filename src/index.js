import React from "react";
import { render } from "react-dom";
import CrafterApp from "./CrafterApp";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import * as serviceWorker from "./serviceWorkerRegistration";

let showUpdate = false;

serviceWorker.register({
  onUpdate: () => {
    showUpdate = true;
  },
});

render(
  <I18nextProvider i18n={i18n}>
    <CrafterApp showUpdate={showUpdate} />
  </I18nextProvider>,
  document.getElementById("root")
);
