import React, { Component } from "react";

class Icon extends Component {
  state = { loaded: true };
  render() {
    if (this.state.loaded) {
      return (
        <img
          src={
            process.env.REACT_APP_API_GENERAL_URL +
            "/items/" +
            this.props.name +
            " icon.png"
          }
          onError={() => this.setState({ loaded: false })}
          className="mr-2"
          width={this.props.width ? this.props.width : "16"}
          alt=""
        />
      );
    } else {
      return "";
    }
  }
}

export default Icon;
