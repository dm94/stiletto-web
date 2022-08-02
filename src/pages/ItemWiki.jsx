import React, { Component, Fragment } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { getItems } from "../services";
import ModalMessage from "../components/ModalMessage";
import Ingredients from "../components/Ingredients";
import Ingredient from "../components/Ingredient";
import Station from "../components/Station";
import Icon from "../components/Icon";
import CraftingTime from "../components/CraftingTime";
import LoadingScreen from "../components/LoadingScreen";
import ModuleInfo from "../components/Wiki/ModuleInfo";
import ToolInfo from "../components/Wiki/ToolInfo";
import GenericInfo from "../components/Wiki/GenericInfo";
import WikiDescription from "../components/Wiki/WikiDescription";
import DropsInfo from "../components/Wiki/DropsInfo";

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
      item_name = decodeURI(item_name);
      item_name = item_name.replaceAll("_", " ");
      item_name = item_name.toLowerCase();
    }

    let items = await getItems();
    if (items != null) {
      let item = items.find((it) => it.name.toLowerCase() === item_name);
      let allItems = items.filter((item) => {
        if (
          item.crafting != null &&
          item.crafting[0] != null &&
          item.crafting[0].ingredients != null
        ) {
          let allIngredients = item.crafting[0].ingredients;

          return (
            allIngredients.filter(
              (ingredient) => ingredient.name.toLowerCase() === item_name
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
        let http = window.location.protocol;
        let slashes = http.concat("//");
        let host = slashes.concat(window.location.hostname);
        let parent_url = "";
        if (this.state.item.parent) {
          parent_url =
            host +
            (window.location.port ? ":" + window.location.port : "") +
            "/item/" +
            encodeURI(
              this.state.item.parent.toLowerCase().replaceAll(" ", "_")
            );
        }
        let craftUrl =
          host +
          (window.location.port ? ":" + window.location.port : "") +
          "/crafter?craft=" +
          encodeURI(name.toLowerCase());
        return (
          <div className="container">
            {this.helmetInfo(name)}
            <div className="row">
              <div className="col-12 col-md-6">
                <div className="card border-secondary mb-3">
                  <div className="card-header">
                    <Icon key={name} name={name} width={35} />
                    {t(name)}
                  </div>
                  <div className="card-body">
                    <ul className="list-group mb-3">
                      {this.state.item.cost ? (
                        <li className="list-group-item d-flex justify-content-between lh-condensed">
                          <div className="my-0">{t("Cost to learn")}</div>
                          <div className="text-muted">
                            {(this.state.item.cost.count
                              ? this.state.item.cost.count
                              : "") +
                              " " +
                              (this.state.item.cost.name
                                ? t(this.state.item.cost.name)
                                : "")}
                          </div>
                        </li>
                      ) : (
                        ""
                      )}
                      {this.state.item.category ? (
                        <li className="list-group-item d-flex justify-content-between lh-condensed">
                          <div className="my-0">{t("Category")}</div>
                          <div className="text-muted">
                            {this.state.item.category}
                          </div>
                        </li>
                      ) : (
                        ""
                      )}
                      {this.state.item.parent ? (
                        <li className="list-group-item d-flex justify-content-between lh-condensed">
                          <div className="my-0">{t("Parent")}</div>
                          <div className="text-muted">
                            <a href={parent_url}>{t(this.state.item.parent)}</a>
                          </div>
                        </li>
                      ) : (
                        ""
                      )}
                      {this.state.item.trade_price ? (
                        <li className="list-group-item d-flex justify-content-between lh-condensed">
                          <div className="my-0">{t("Trade Price")}</div>
                          <div className="text-muted">
                            {this.state.item.trade_price} flots
                          </div>
                        </li>
                      ) : (
                        ""
                      )}
                      {this.state.item.stackSize ? (
                        <li className="list-group-item d-flex justify-content-between lh-condensed">
                          <div className="my-0">{t("Character Stack")}</div>
                          <div className="text-muted">
                            {this.state.item.stackSize}
                          </div>
                        </li>
                      ) : (
                        ""
                      )}
                      {this.state.item.weight ? (
                        <li className="list-group-item d-flex justify-content-between lh-condensed">
                          <div className="my-0">{t("Weight")}</div>
                          <div className="text-muted">
                            {this.state.item.weight}
                          </div>
                        </li>
                      ) : (
                        ""
                      )}
                      {this.state.item.experiencieReward ? (
                        <li className="list-group-item d-flex justify-content-between lh-condensed">
                          <div className="my-0">
                            {t("Experience by crafting")}
                          </div>
                          <div className="text-muted">
                            {this.state.item.experiencieReward}
                          </div>
                        </li>
                      ) : (
                        ""
                      )}
                      {this.state.item.durability ? (
                        <li className="list-group-item d-flex justify-content-between lh-condensed">
                          <div className="my-0">{t("Durability")}</div>
                          <div className="text-muted">
                            {this.state.item.durability}
                          </div>
                        </li>
                      ) : (
                        ""
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              {this.state.item.crafting ? (
                <div className="col-12 col-xl-6">
                  <div className="card border-secondary mb-3">
                    <div className="card-header">
                      {t("Recipe")}{" "}
                      <a href={craftUrl} className="float-right">
                        <i className="fas fa-tools"></i>
                      </a>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {this.showIngredient(this.state.item)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {this.state.item.learn ? (
                <div className="col-12 col-xl-6">
                  <div className="card border-secondary mb-3">
                    <div className="card-header">{t("It is used to")}</div>
                    <div className="card-body">
                      <div className="row">{this.showSchematicItems(t)}</div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {this.showDescription(t)}
              {this.state.item.structureInfo && (
                <GenericInfo
                  key="structureInfo"
                  name="Structure Info"
                  dataInfo={this.state.item.structureInfo}
                />
              )}
              {this.state.item.projectileDamage && (
                <GenericInfo
                  key="proyectileInfo"
                  name="Projectile Info"
                  dataInfo={this.state.item.projectileDamage}
                />
              )}
              {this.state.item.weaponInfo && (
                <GenericInfo
                  key="weaponinfo"
                  name="Weapon Info"
                  dataInfo={this.state.item.weaponInfo}
                />
              )}
              {this.state.item.armorInfo && (
                <GenericInfo
                  key="armorinfo"
                  name="Armor Info"
                  dataInfo={this.state.item.armorInfo}
                />
              )}
              {this.state.item.toolInfo && (
                <ToolInfo key="toolinfo" toolInfo={this.state.item.toolInfo} />
              )}
              {this.state.item.moduleInfo && (
                <ModuleInfo
                  key="moduleinfo"
                  moduleInfo={this.state.item.moduleInfo}
                />
              )}
              <WikiDescription
                key="wikidescription"
                name={this.state.item.name}
              />
              {this.showCanBeUsedPart(t)}
              <DropsInfo key="dropInfo" drops={this.state.item.drops} />
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
      return (
        <Fragment>
          {this.helmetInfo("Wiki")}
          <LoadingScreen />
        </Fragment>
      );
    }
  }

  helmetInfo(name) {
    return (
      <Helmet>
        <title>{name + " - Stiletto for Last Oasis"}</title>
        <meta
          name="description"
          content={"All necessary information for " + name}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={name + " - Stiletto for Last Oasis"}
        />
        <meta
          name="twitter:description"
          content={"All necessary information for " + name}
        />
        <link
          rel="canonical"
          href={
            window.location.protocol
              .concat("//")
              .concat(window.location.hostname) +
            (window.location.href ? ":" + window.location.port : "") +
            window.location.pathname
          }
        />
      </Helmet>
    );
  }

  showDescription(t) {
    if (this.state.item.description) {
      return (
        <div className="col-12 col-md-6">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("Description")}</div>
            <div className="card-body">{this.state.item.description}</div>
          </div>
        </div>
      );
    }
  }

  showCanBeUsed(t) {
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

  showCanBeUsedPart(t) {
    if (this.state.canBeUsed.length > 0) {
      return (
        <div className="col-12 col-md-6">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("It can be used in")}</div>
            <div className="card-body">
              <ul className="list-inline">{this.showCanBeUsed(t)}</ul>
            </div>
          </div>
        </div>
      );
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
          {ingredients.station && <Station name={ingredients.station} />}
          {ingredients.time && <CraftingTime time={ingredients.time} />}
        </div>
      ));
    }
  }

  showSchematicItems(t) {
    if (this.state.item.learn) {
      return this.state.item.learn.map((itemCraft, index) => {
        let http = window.location.protocol;
        let slashes = http.concat("//");
        let host = slashes.concat(window.location.hostname);
        let url =
          host +
          (window.location.port ? ":" + window.location.port : "") +
          "/item/" +
          encodeURI(itemCraft.toLowerCase().replaceAll(" ", "_"));
        return (
          <div className="col" key={"craft-" + index}>
            <Icon key={itemCraft} name={itemCraft} />
            <a href={url}>{t(itemCraft)}</a>
          </div>
        );
      });
    }
  }
}

export default withTranslation()(ItemWiki);
