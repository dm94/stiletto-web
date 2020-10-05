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
        <div className="col-10">{this.props.item.name}</div>
        <div className="col-2">
          <button
            className="btn btn-success btn-sm"
            onClick={() => this.props.onAdd(this.props.item.name)}
          >
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </li>
    );
  }
}

export default Item;
