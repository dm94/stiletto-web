import React, { Component } from "react";

class WalkerListItem extends Component {
  state = {};

  render() {
    return (
      <tr>
        <td className="text-center">{this.props.walker.walkerID}</td>
        <td className="text-center">{this.props.walker.name}</td>
        <td className="text-center">{this.props.walker.ownerUser}</td>
        <td className="text-center">{this.props.walker.lastUser}</td>
        <td className="text-center">{this.props.walker.datelastuse}</td>
      </tr>
    );
  }
}

export default WalkerListItem;
