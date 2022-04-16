import React, { Component, Fragment } from "react";
import QualityInput from "./QualityInput";

class IngredientQualityInputs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputGroups: [],
      averageQuality: 0,
      disableAdd: false,
    };
  }

  changeMatsQualities = (id, type, val) => {
    let onlyMats = this.state.inputGroups.filter((m) => m.id === id);
    let otherMats = this.state.inputGroups.filter((m) => m.id !== id);

    let mats = {};

    if (onlyMats.length > 0) {
      mats = {
        quantity: onlyMats[0].mats.quantity,
        quality: onlyMats[0].mats.quality,
      };
    } else {
      mats = { quantity: 0, quality: 0 };
    }

    mats[type] = parseInt(val);
    otherMats.push({ id: id, mats: mats });

    let maxQuality = 0;
    let sumQuantity = 0;
    otherMats.forEach((input) => {
      if (input.mats.quantity !== 0) {
        maxQuality =
          maxQuality +
          parseInt(input.mats.quantity) * parseInt(input.mats.quality);
        sumQuantity = sumQuantity + parseInt(input.mats.quantity);
      }
    });

    this.setState({
      inputGroups: otherMats,
      averageQuality: Math.floor(maxQuality / this.props.ingredient.count),
      disableAdd: sumQuantity >= this.props.ingredient.count,
    });
    this.props.onChangeAverage(
      this.props.ingredient.name,
      Math.floor(maxQuality / this.props.ingredient.count)
    );
  };

  allInputs() {
    if (this.state.inputGroups.length > 0) {
      return this.state.inputGroups
        .sort((input) => input.id)
        .map((input) => (
          <QualityInput
            key={input.id}
            input={input}
            ingredient={this.props.ingredient}
            onChangeMats={this.changeMatsQualities}
          />
        ));
    } else if (this.state.inputGroups.length === 0) {
      return (
        <QualityInput
          key={0}
          input={{
            id: 0,
            mats: { quantity: 0, quality: 0 },
          }}
          ingredient={this.props.ingredient}
          onChangeMats={this.changeMatsQualities}
        />
      );
    }
  }

  render() {
    return (
      <Fragment>
        {this.allInputs()}
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-success"
            onClick={() => {
              this.setState((state) => {
                let all = state.inputGroups;
                all.push({
                  id: all.length > 0 ? all[all.length - 1].id + 1 : 1,
                  mats: { quantity: 0, quality: 0 },
                });
                this.setState({ inputGroups: all });
              });
            }}
            disabled={this.state.disableAdd}
          >
            +
          </button>
          <button type="button" className="btn btn-secondary" disabled>
            Q: {this.state.averageQuality}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              if (this.state.inputGroups.length > 0) {
                this.setState((state) => {
                  let all = state.inputGroups;
                  all.pop();
                  this.setState({
                    inputGroups: all,
                  });
                });
              } else {
                this.setState({
                  inputGroups: { id: 0, mats: { quantity: 0, quality: 0 } },
                });
              }
            }}
            disabled={this.state.inputGroups.length < 2}
          >
            -
          </button>
        </div>
      </Fragment>
    );
  }
}

export default IngredientQualityInputs;
