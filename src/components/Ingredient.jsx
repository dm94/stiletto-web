import React, { Component } from "react";

class Ingredient extends Component {
  state = {};
  render() {
    return (
      <row>
        <div class="col-sm">{this.props.ingredient.name}</div>
        <div class="col-sm">{this.props.ingredient.count}</div>
      </row>
    );
  }
}

export default Ingredient;
