import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { getStyle } from "./BGDarkSyles";

class QualityInput extends Component {
  state = {};
  render() {
    const { t } = this.props;
    return (
      <div className="input-group input-group-sm mb-3">
        <input
          type="number"
          id={"quantity" + this.props.input.id}
          max={this.props.ingredient.count}
          min={0}
          className={getStyle("form-control")}
          placeholder={t("Quantity")}
          aria-label={t("Quantity")}
          onChange={(evt) =>
            this.props.onChangeMats(
              this.props.input.id,
              "quantity",
              evt.target.value
            )
          }
        />
        <div className="input-group-prepend">
          <span className="input-group-text">Q</span>
        </div>
        <input
          id={"quality" + this.props.input.id}
          type="number"
          max={100}
          min={0}
          className={getStyle("form-control")}
          placeholder={t("Quality")}
          aria-label={t("Quality")}
          onChange={(evt) =>
            this.props.onChangeMats(
              this.props.input.id,
              "quality",
              evt.target.value
            )
          }
        />
      </div>
    );
  }
}

export default withTranslation()(QualityInput);
