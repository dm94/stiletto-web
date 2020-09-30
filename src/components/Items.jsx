import React, { Component } from "react";
import Item from "./Item";

class Items extends Component {
  state = {};

  render() {
    return (
      <div className="list-group">
        {this.props.items.map((item) => (
          <Item key={item.name} onAdd={this.props.onAdd} item={item} />
        ))}
      </div>
    );
  }
}

export default Items;
