import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class Ingredient extends Component {
  render() {
    const { t } = this.props;
    return (
      <div className="text-center">
        {this.props.ingredient.count * this.props.value}x{" "}
        {t(this.props.ingredient.name)}
      </div>
    );
  }
}

export default withTranslation()(Ingredient);
