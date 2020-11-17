import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class Ingredient extends Component {
  render() {
    const { t } = this.props;
    var res = this.props.ingredient.name.replace(" ", "_");
    var img = new Image();
    img.src = "https://api2.comunidadgzone.es/items/" + res + ".png";
    return (
      <div className="text-center">
        {img.complete ? (
          <img src={img.src} alt={this.props.ingredient.name} width="2%" />
        ) : (
          ""
        )}
        {this.props.ingredient.count * this.props.value}x{" "}
        {t(this.props.ingredient.name)}
      </div>
    );
  }
}

export default withTranslation()(Ingredient);
