import React from "react";
import { render } from "react-dom";
import CrafterApp from "./CrafterApp";
import "./css/normalize.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./css/darkly.min.css";
import "./css/style.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { BrowserRouter as Router } from "react-router-dom";

render(
  <I18nextProvider i18n={i18n}>
    <Router>
      <CrafterApp />
    </Router>
  </I18nextProvider>,
  document.getElementById("root"),
);
