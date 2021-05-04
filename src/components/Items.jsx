import React, { Component, Fragment } from "react";
import Item from "./Item";

class Items extends Component {
  render() {
    return (
      <Fragment>
        {this.props.items.map((item) => (
          <Item key={item.name} onAdd={this.props.onAdd} item={item} />
        ))}
      </Fragment>
    );
  }
}

export default Items;
