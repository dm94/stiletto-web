import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { getItems } from "../services";
import ModalMessage from "../components/ModalMessage";
import Ingredients from "../components/Ingredients";
import LoadingScreen from "../components/LoadingScreen";

class ItemWiki extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      isLoaded: false,
      canBeUsed: [],
    };
  }

  async componentDidMount() {
    let item_name = this.props.match.params.name;
    if (item_name != null) {
      item_name = item_name.toLowerCase();
      item_name = item_name.replaceAll("_", " ");
    }

    let items = await getItems();
    if (items != null) {
      let item = items.find((it) => it.name.toLowerCase() == item_name);
      let allItems = items.filter((item) => {
        if (
          item.crafting != null &&
          item.crafting[0] != null &&
          item.crafting[0].ingredients != null
        ) {
          let allIngredients = item.crafting[0].ingredients;

          return (
            allIngredients.filter(
              (ingredient) => ingredient.name.toLowerCase() == item_name
            ).length > 0
          );
        } else {
          return false;
        }
      });
      this.setState({ item: item, isLoaded: true, canBeUsed: allItems });
    }
  }
  render() {
    const { t } = this.props;
    if (this.state.isLoaded) {
      if (this.state.item != null) {
        let name = this.state.item.name;
        let countCostToLearn =
          this.state.item.cost != null && this.state.item.cost.count != null
            ? this.state.item.cost.count
            : "";
        let typeCostToLearn =
          this.state.item.cost != null && this.state.item.cost.name != null
            ? this.state.item.cost.name
            : t("Not defined");
        let category =
          this.state.item.category != null
            ? this.state.item.category
            : t("Not defined");
        let parent =
          this.state.item.parent != null
            ? this.state.item.parent
            : t("Not defined");
        let tradePrice =
          this.state.item.trade_price != null
            ? this.state.item.trade_price + " flots"
            : t("Not defined");

        let http = window.location.protocol;
        let slashes = http.concat("//");
        let host = slashes.concat(window.location.hostname);
        let parent_url =
          this.state.item.parent != null
            ? host +
              (window.location.port ? ":" + window.location.port : "") +
              "/item/" +
              parent.toLowerCase().replaceAll(" ", "_")
            : "wood";
        return (
          <div className="container">
            <div className="row">
              <div className="col-6">
                <div className="card border-secondary mb-3">
                  <div className="card-header">{t(name)}</div>
                  <div className="card-body">
                    <ul className="list-group mb-3">
                      <li className="list-group-item d-flex justify-content-between lh-condensed">
                        <div className="my-0">{t("Cost to learn")}</div>
                        <div className="text-muted">
                          {countCostToLearn + " " + t(typeCostToLearn)}
                        </div>
                      </li>
                      <li className="list-group-item d-flex justify-content-between lh-condensed">
                        <div className="my-0">{t("Category")}</div>
                        <div className="text-muted">{category}</div>
                      </li>
                      <li className="list-group-item d-flex justify-content-between lh-condensed">
                        <div className="my-0">{t("Parent")}</div>
                        <div className="text-muted">
                          <a href={parent_url}>{t(parent)}</a>
                        </div>
                      </li>
                      <li className="list-group-item d-flex justify-content-between lh-condensed">
                        <div className="my-0">{t("Trade Price")}</div>
                        <div className="text-muted">{tradePrice}</div>
                      </li>
                    </ul>
                  </div>
                  <div className="card-footer">
                    <a
                      type="button"
                      className="btn btn-lg btn-info btn-block"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={
                        "https://lastoasis.fandom.com/wiki/Special:Search?query=" +
                        name +
                        "&scope=internal&navigationSearch=true"
                      }
                    >
                      {t("Wiki")}
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card border-secondary mb-3">
                  <div className="card-header">{t("Recipe")}</div>
                  <div className="card-body">
                    {this.showIngredient(this.state.item)}
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card border-secondary mb-3">
                  <div className="card-header">{t("It can be used in")}</div>
                  <div className="card-body">
                    <ul className="list-inline">{this.showCanBeUsed(t)}</ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <ModalMessage
            message={{
              isError: true,
              text: "The page you are looking for does not exist",
              redirectPage: "/",
            }}
          />
        );
      }
    } else {
      return <LoadingScreen />;
    }
  }

  showCanBeUsed(t) {
    if (this.state.canBeUsed.length > 0) {
      return this.state.canBeUsed.map((item) => {
        let http = window.location.protocol;
        let slashes = http.concat("//");
        let host = slashes.concat(window.location.hostname);
        let url =
          host +
          (window.location.port ? ":" + window.location.port : "") +
          "/item/" +
          item.name.toLowerCase().replaceAll(" ", "_");
        return (
          <li className="list-inline-item" key={item.name}>
            <a href={url}>{t(item.name)}</a> ||
          </li>
        );
      });
    } else {
      return <li>{t("Not used in any recipe")}</li>;
    }
  }

  showIngredient(item) {
    if (item != null && item.crafting != null) {
      return item.crafting.map((ingredients, index) => (
        <div
          className={item.crafting.length > 1 ? "col-xl-6 border" : "col-xl-12"}
          key={"ingredients-" + index + "-" + item.name}
        >
          <Ingredients crafting={ingredients} value={1} />
        </div>
      ));
    }
  }
}

export default withTranslation()(ItemWiki);
