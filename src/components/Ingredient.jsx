import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Icon from "./Icon";

class Ingredient extends Component {
  render() {
    const { t } = this.props;
    return (
      <div className="text-center">
        <Icon
          key={this.props.ingredient.name}
          name={this.props.ingredient.name}
        />
        {this.props.ingredient.count * this.props.value}x{" "}
        {t(this.props.ingredient.name)}
      </div>
    );
  }
}

export default withTranslation()(Ingredient);
