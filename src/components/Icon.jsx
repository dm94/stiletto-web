import React, { Component } from "react";

class Icon extends Component {
  state = {};
  render() {
    var img = new Image();
    img.src =
      process.env.REACT_APP_API_GENERAL_URL +
      "/items/" +
      this.props.name +
      " icon.png";

    if (img.complete) {
      return <img src={img.src} width="2%" />;
    } else {
      return "";
    }
  }
}

export default Icon;
