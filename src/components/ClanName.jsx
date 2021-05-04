import React, { Component, Fragment } from "react";
class ClanName extends Component {
  render() {
    if (this.props.clan.symbol != null) {
      return (
        <Fragment>
          <img
            width="48"
            height="48"
            src={
              process.env.REACT_APP_API_GENERAL_URL +
              "/symbols/" +
              this.props.clan.symbol +
              ".png"
            }
            style={{ backgroundColor: this.props.clan.flagcolor }}
            alt={this.props.clan.symbol}
            id={"symbol-img-" + this.props.clan.name}
          />
          <span className="pb-3 mb-0 ml-2">{this.props.clan.name}</span>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <svg
            className="bd-placeholder-img mr-2"
            width="32"
            height="32"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
            role="img"
          >
            <rect
              width="90%"
              height="90%"
              fill={this.props.clan.flagcolor}
            ></rect>
          </svg>
          <span className="pb-3 mb-0">{this.props.clan.name}</span>
        </Fragment>
      );
    }
  }
}

export default ClanName;
