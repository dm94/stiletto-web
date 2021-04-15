import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Icon from "./Icon";
import Ingredients from "./Ingredients";
class Ingredient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showList: false,
    };
  }

  render() {
    const { t } = this.props;
    return (
      <div className="list-group-item">
        <div
          className={
            this.props.ingredient.ingredients != null ? "text-success" : ""
          }
          role={this.props.ingredient.ingredients != null ? "button" : ""}
          onClick={() =>
            this.setState((state) => ({ showList: !state.showList }))
          }
        >
          <Icon
            key={this.props.ingredient.name}
            name={this.props.ingredient.name}
          />
          {this.props.ingredient.count * this.props.value}x{" "}
          {t(this.props.ingredient.name)}
        </div>
        <div
          className={
            this.props.ingredient.ingredients != null ? "list-group" : ""
          }
        >
          {this.showSubList()}
        </div>
      </div>
    );
  }

  showSubList() {
    if (this.props.ingredient.ingredients != null && this.state.showList) {
      return this.props.ingredient.ingredients.map((ingredients, i) => (
        <ul
          className="list-group list-group-horizontal"
          key={
            this.props.ingredient.name +
            this.props.ingredient.count * this.props.value +
            i
          }
        >
          <label className="sr-only">----------------------------</label>
          <Ingredients
            crafting={ingredients}
            value={this.props.ingredient.count * this.props.value}
          />
          <label className="sr-only">----------------------------</label>
        </ul>
      ));
    }
  }
}

export default withTranslation()(Ingredient);
