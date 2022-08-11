import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Ingredient from "../Ingredient";

class CanBeUsedInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canBeUsed: [],
    };
  }

  componentDidMount() {
    if (this.props.items && this.props.name) {
      let name = this.props.name.toLowerCase();
      let canBeUsed = this.props.items.filter((item) => {
        if (
          item.crafting != null &&
          item.crafting[0] != null &&
          item.crafting[0].ingredients != null
        ) {
          let allIngredients = item.crafting[0].ingredients;

          return (
            allIngredients.filter(
              (ingredient) => ingredient.name.toLowerCase() === name
            ).length > 0
          );
        } else {
          return false;
        }
      });
      this.setState({
        canBeUsed: canBeUsed,
      });
    }
  }

  render() {
    if (this.props.name && this.props.items) {
      if (this.state.canBeUsed.length > 0) {
        const { t } = this.props;
        return (
          <div className="col-12 col-md-6">
            <div className="card border-secondary mb-3">
              <div className="card-header">{t("It can be used in")}</div>
              <div className="card-body">
                <ul className="list-inline">{this.showCanBeUsed()}</ul>
              </div>
            </div>
          </div>
        );
      }
    }
    return "";
  }

  showCanBeUsed() {
    return this.state.canBeUsed.map((item) => {
      return (
        <li className="list-inline-item" key={item.name}>
          <Ingredient
            key={item.name + "-ingredient"}
            ingredient={item}
            value={1}
          />
        </li>
      );
    });
  }
}

export default withTranslation()(CanBeUsedInfo);
