import React from "react";
import { hydrate, render } from "react-dom";
import CrafterApp from "./CrafterApp";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import Popper from "popper.js";
import "bootstrap/dist/js/bootstrap.bundle.min";

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(<CrafterApp />, rootElement);
} else {
  render(<CrafterApp />, rootElement);
}
