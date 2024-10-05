import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Icon from "./Icon";
import Ingredients from "./Ingredients";
import { getDomain } from "../functions/utils";
class Ingredient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showList: false,
    };
  }

  render() {
    const { t } = this.props;
    const hasIngredients = this.props?.ingredient.ingredients != null;

    const url = `${getDomain()}/item/${encodeURI(
      this.props?.ingredient.name.toLowerCase().replaceAll(" ", "_")
    )}`;

    return (
      <div className="list-group-item">
        <div
          tabIndex={hasIngredients ? 0 : undefined}
          className={hasIngredients ? "text-success" : ""}
          role={hasIngredients ? "button" : ""}
          onClick={() =>
            this.setState((state) => ({ showList: !state.showList }))
          }
        >
          <Icon
            key={this.props?.ingredient.name}
            name={this.props?.ingredient.name}
          />
          {this.props?.ingredient.count != null && this.props?.value != null
            ? `${Math.ceil(this.props?.ingredient.count * this.props?.value)}x `
            : ""}
          {this.props?.ingredient.ingredients != null ? (
            t(this.props?.ingredient.name, { ns: "items" })
          ) : (
            <a href={url}>{t(this.props?.ingredient.name, { ns: "items" })}</a>
          )}
        </div>
        <div
          className={
            this.props?.ingredient.ingredients != null ? "list-group" : ""
          }
        >
          {this.showSubList()}
        </div>
      </div>
    );
  }

  showSubList() {
    if (this.state.showList && this.props?.ingredient.ingredients != null) {
      return this.props?.ingredient.ingredients.map((ingredients) => (
        <ul
          className="list-group list-group-horizontal"
          key={`ingredient-sublist-${this.props?.ingredient.name}-${this.props?.value}`}
        >
          <span className="sr-only">----------------------------</span>
          <Ingredients
            crafting={ingredients}
            value={
              ingredients.output != null
                ? (this.props?.ingredient.count * this.props?.value) /
                  ingredients.output
                : this.props?.ingredient.count * this.props?.value
            }
          />
          <span className="sr-only">----------------------------</span>
        </ul>
      ));
    }
  }
}

export default withTranslation()(Ingredient);
