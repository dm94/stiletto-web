import React from "react";
import { render } from "react-dom";
import CrafterApp from "./CrafterApp";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const rootElement = document.getElementById("root");
render(<CrafterApp />, rootElement);
