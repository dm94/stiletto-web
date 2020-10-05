import React from "react";
import { render } from "react-snapshot";
import CrafterApp from "./CrafterApp";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import Popper from "popper.js";
import "bootstrap/dist/js/bootstrap.bundle.min";

render(
  //<React.StrictMode>
  <CrafterApp />,
  //</React.StrictMode>
  document.getElementById("root")
);
