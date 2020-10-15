import React, { Component } from "react";
import "./LoadingScreen.css";

class LoadingScreen extends Component {
  state = {};
  render() {
    return (
      <div id="preloader">
        <div id="loader"></div>
      </div>
    );
  }
}

export default LoadingScreen;
