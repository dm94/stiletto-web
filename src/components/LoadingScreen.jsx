import React, { Component } from "react";
import "../css/LoadingScreen.css";

class LoadingScreen extends Component {
  render() {
    return (
      <div className="preloader">
        <div className="loader" />
      </div>
    );
  }
}

export default LoadingScreen;
