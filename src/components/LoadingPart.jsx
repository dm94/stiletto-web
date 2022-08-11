import React, { Component } from "react";
import "../css/LoadingScreen.css";

class LoadingPart extends Component {
  render() {
    return (
      <div className="preloader-part">
        <div className="loader"></div>
      </div>
    );
  }
}

export default LoadingPart;
