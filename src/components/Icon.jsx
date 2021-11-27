import React, { Component } from "react";

class Icon extends Component {
  state = { loaded: true };
  render() {
    let name = this.props.name;
    if (name.includes("Tier 1")) {
      name = "Walker Upgrade Wood";
    } else if (name.includes("Tier 2")) {
      name = "Walker Upgrade Bone";
    } else if (name.includes("Tier 3")) {
      name = "Walker Upgrade Ceramic";
    } else if (name.includes("Tier 4")) {
      name = "Walker Upgrade Iron";
    } else if (name.includes("Wings Small")) {
      name = "Walker Wings Small";
    } else if (name.includes("Wings Medium")) {
      name = "Walker Wings Medium";
    } else if (name.includes("Wings Large")) {
      name = "Walker Wings Large";
    } else if (name.includes("Wings Skirmish")) {
      name = "Walker Wings Skirmish";
    } else if (name.includes("Wings Raider")) {
      name = "Walker Wings Raider";
    } else if (name.includes("Wings Heavy")) {
      name = "Walker Wings Heavy";
    } else if (name.includes("Wings Rugged")) {
      name = "Walker Wings Rugged";
    } else if (name.includes(" Wings")) {
      name = "Walker Wings";
    } else if (name.includes("Legs Armored")) {
      name = "Walker Legs Armored";
    } else if (name.includes("Legs Heavy")) {
      name = "Walker Legs Heavy";
    } else if (name.includes("Legs")) {
      name = "Walker Legs";
    } else if (name.includes("Grappling Hook")) {
      name = "Grappling Hook";
    }
    name = name.replaceAll("Body", "");
    if (this.state.loaded) {
      return (
        <img
          src={
            process.env.REACT_APP_API_GENERAL_URL +
            "/items/" +
            name.trim() +
            " icon.png"
          }
          loading="lazy"
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
