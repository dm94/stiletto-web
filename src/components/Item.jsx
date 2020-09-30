import React, { Component } from "react";
import Ingredients from "./Ingredients";

class Item extends Component {
  state = {};

  showIngredient() {
    if (this.props.item.crafting != null) {
      return this.props.item.crafting.map((ingredients) => (
        <Ingredients key={this.props.item.name} crafting={ingredients} />
      ));
    }
  }

  render() {
    return (
      <li className="list-group-item container">
        <div className="d-inline-block text-wrap" style={{ width: "16rem" }}>
          {this.props.item.name}
        </div>
        <div className="mb-1">
          <button
            className="btn btn-success btn-sm"
            onClick={() => this.props.onAdd(this.props.item.name)}
          >
            +
          </button>
        </div>
      </li>
    );
  }
}

export default Item;
