import React, { Component } from "react";

class Ingredient extends Component {
  state = {};
  render() {
    return (
      <div className="text-center">
        {this.props.ingredient.count * this.props.value}x{" "}
        {this.props.ingredient.name}
      </div>
    );
  }
}

export default Ingredient;
