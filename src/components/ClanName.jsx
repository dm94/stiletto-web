import React, { Component } from "react";

class ClanName extends Component {
  render() {
    return (
      <div>
        <svg
          className="bd-placeholder-img mr-2 rounded"
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
      </div>
    );
  }
}

export default ClanName;
