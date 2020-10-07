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
      <li className="list-group-item">
        <div className="row">
          <div className="col-md-8 col-xl-10">{this.props.item.name}</div>
          <div className="col-md-7 col-xl-2">
            <button
              className="btn btn-success btn-sm"
              onClick={() => this.props.onAdd(this.props.item.name)}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </li>
    );
  }
}

export default Item;
