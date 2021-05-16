import React, { Component } from "react";
import "../css/LoadingScreen.css";

class LoadingScreen extends Component {
  render() {
    return (
      <div id="preloader">
        <div id="loader"></div>
      </div>
    );
  }
}

export default LoadingScreen;
