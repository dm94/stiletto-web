import React, { Component } from "react";

class Ingredient extends Component {
  state = {};
  render() {
    return (
      <div className="row">
        <div className="col-6 text-right">
          {this.props.ingredient.count * this.props.value}x
        </div>
        <div className="col-6 text-left">{this.props.ingredient.name}</div>
      </div>
    );
  }
}

export default Ingredient;
