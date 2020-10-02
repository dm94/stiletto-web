import React, { Component } from "react";
import Ingredients from "./Ingredients";

class SelectedItem extends Component {
  state = {};

  showIngredient() {
    if (this.props.item.crafting != null) {
      return this.props.item.crafting.map((ingredients) => (
        <Ingredients
          key={this.props.item.name}
          crafting={ingredients}
          value={this.props.value}
        />
      ));
    }
  }

  render() {
    return (
      <div className="col-12 row border">
        <div className="col-6 ml-auto">
          <div className="row">
            <div className="col-6 text-right">{this.props.value}x</div>
            <div className="col-6 text-left">{this.props.item.name}</div>
          </div>
          <div className="row">
            <div className="ml-auto btn-group mr-2" role="group">
              <button
                className="btn btn-success"
                onClick={(e) => this.props.onAdd(this.props.item.name)}
              >
                +1
              </button>
              <button
                className="btn btn-success"
                onClick={(e) => this.props.onAdd10(this.props.item.name)}
              >
                +10
              </button>
              <button
                className="btn btn-success"
                onClick={(e) => this.props.onAdd100(this.props.item.name)}
              >
                +100
              </button>
              <button
                className="btn btn-danger"
                onClick={(e) => this.props.onRemove(this.props.item.name)}
              >
                -1
              </button>
              <button
                className="btn btn-danger"
                onClick={(e) => this.props.onRemove10(this.props.item.name)}
              >
                -10
              </button>
              <button
                className="btn btn-danger"
                onClick={(e) => this.props.onRemove100(this.props.item.name)}
              >
                -100
              </button>
            </div>
          </div>
        </div>
        <div className="col-6">{this.showIngredient()}</div>
      </div>
    );
  }
}

export default SelectedItem;
