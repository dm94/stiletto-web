import React, { Component } from "react";
import Ingredients from "./Ingredients";

class SelectedItem extends Component {
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
      <div className="col">
        <div className="card">
          <div className="text-center card-header">
            {this.props.value}x {this.props.item.name}
          </div>
          <div className="card-body">
            <div className="list-unstyled ">{this.showIngredient()}</div>
          </div>
          <div className="card-footer">
            <div className="btn-group col-xl-12" role="group">
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
      </div>
    );
  }
}

export default SelectedItem;
