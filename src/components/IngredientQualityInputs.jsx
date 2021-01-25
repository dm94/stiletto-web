import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { getStyle } from "./BGDarkSyles";

class IngredientQualityInputs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputGroups: [],
      averageQuality: 0,
    };
  }

  qualitiesInputs(t, input) {
    return (
      <div className="input-group input-group-sm mb-3">
        <input
          type="number"
          id={"quantity" + this.props.ingredient.name}
          max={this.props.ingredient.count}
          min={0}
          className={getStyle("form-control")}
          placeholder={t("Quantity")}
          aria-label={t("Quantity")}
          onChange={(evt) =>
            this.changeMatsQualities(input.id, "quantity", evt.target.value)
          }
        />
        <div className="input-group-prepend">
          <span className="input-group-text">Q</span>
        </div>
        <input
          id={"quality" + this.props.ingredient.name}
          type="number"
          max={100}
          min={0}
          className={getStyle("form-control")}
          placeholder={t("Quality")}
          aria-label={t("Quality")}
          onChange={(evt) =>
            this.changeMatsQualities(input.id, "quality", evt.target.value)
          }
        />
      </div>
    );
  }

  changeMatsQualities(id, type, val) {
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

    if (sumQuantity < this.props.ingredient.count) {
      sumQuantity = this.props.ingredient.count;
    }

    this.setState({
      inputGroups: otherMats,
      averageQuality: Math.floor(maxQuality / sumQuantity),
    });
    this.props.onChangeAverage(
      this.props.ingredient.name,
      Math.floor(maxQuality / sumQuantity)
    );
  }

  allInputs(t) {
    if (this.state.inputGroups.length > 0) {
      return this.state.inputGroups
        .sort((input) => input.id)
        .map((input) => (
          <div key={input.id}>{this.qualitiesInputs(t, input)}</div>
        ));
    } else if (this.state.inputGroups.length === 0) {
      return (
        <div>
          {this.qualitiesInputs(t, {
            id: 0,
            mats: { quantity: 0, quality: 0 },
          })}
        </div>
      );
    }
  }

  render() {
    const { t } = this.props;

    return (
      <div>
        {this.allInputs(t)}
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-success"
            onClick={() => {
              let all = this.state.inputGroups;
              all.push({
                id: all[all.length - 1].id + 1,
                mats: { quantity: 0, quality: 0 },
              });
              this.setState({ inputGroups: all });
            }}
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
              let all = this.state.inputGroups;
              if (all.length > 1) {
                this.setState({ inputGroups: all.splice(all.length - 1) });
              } else {
                this.setState({
                  inputGroups: { id: 0, mats: { quantity: 0, quality: 0 } },
                });
              }
            }}
          >
            -
          </button>
        </div>
      </div>
    );
  }
}

export default withTranslation()(IngredientQualityInputs);
