import React, { Component, Fragment, Suspense } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { getItems } from "../services";
import ModalMessage from "../components/ModalMessage";
import Ingredients from "../components/Ingredients";
import Station from "../components/Station";
import Icon from "../components/Icon";
import CraftingTime from "../components/CraftingTime";
import LoadingScreen from "../components/LoadingScreen";
import LoadingPart from "../components/LoadingPart";
import ModuleInfo from "../components/Wiki/ModuleInfo";
import ToolInfo from "../components/Wiki/ToolInfo";
import GenericInfo from "../components/Wiki/GenericInfo";
import Comments from "../components/Wiki/Comments";
import { calcRarityValue } from "../rarityCalc";

const WikiDescription = React.lazy(() =>
  import("../components/Wiki/WikiDescription")
);
const SchematicDropInfo = React.lazy(() =>
  import("../components/Wiki/SchematicDropInfo")
);
const DropsInfo = React.lazy(() => import("../components/Wiki/DropsInfo"));
const CanBeUsedInfo = React.lazy(() =>
  import("../components/Wiki/CanBeUsedInfo")
);

const SchematicItems = React.lazy(() =>
  import("../components/Wiki/SchematicItems")
);

class ItemWiki extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      isLoaded: false,
      canBeUsed: [],
      allItems: [],
      rarity: "Common",
      textColor: "text-muted",
    };
  }

  async componentDidMount() {
    let item_name = this.props.match.params.name;
    if (item_name != null) {
      item_name = decodeURI(item_name);
      item_name = item_name.replaceAll("_", " ");
      item_name = item_name.toLowerCase();
    }

    const items = await getItems();
    if (items != null) {
      const item = items.find((it) => it.name.toLowerCase() === item_name);
      this.setState({
        item: item,
        isLoaded: true,
        allItems: items,
      });
    }
  }

  render() {
    const { t } = this.props;
    if (this.state.isLoaded) {
      if (this.state.item != null) {
        const name = this.state.item.name;
        const http = window.location.protocol;
        const slashes = http.concat("//");
        const host = slashes.concat(window.location.hostname);
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
        const craftUrl =
          host +
          (window.location.port ? ":" + window.location.port : "") +
          "/crafter?craft=" +
          encodeURI(name.toLowerCase());

        const category = this.state.item.category;

        return (
          <div className="container">
            {this.helmetInfo(name)}
            <div className="row">
              <div className="col-12 col-md-6">
                <div className="card border-secondary mb-3">
                  <div className="card-header">
                    <Icon key={name} name={name} width={35} />
                    {t(name, { ns: "items" })}
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
                            {t(category, { ns: "items" })}
                          </div>
                        </li>
                      ) : (
                        ""
                      )}
                      {this.state.item.parent ? (
                        <li className="list-group-item d-flex justify-content-between lh-condensed">
                          <div className="my-0">{t("Parent")}</div>
                          <div className="text-muted">
                            <a href={parent_url}>
                              {t(this.state.item.parent, { ns: "items" })}
                            </a>
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
                          <div className={this.state.textColor}>
                            {calcRarityValue(
                              this.state.rarity,
                              "weight",
                              category,
                              this.state.item.weight
                            )}
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
                          <div className={this.state.textColor}>
                            {calcRarityValue(
                              this.state.rarity,
                              "durability",
                              category,
                              this.state.item.durability
                            )}
                          </div>
                        </li>
                      ) : (
                        ""
                      )}
                    </ul>
                  </div>
                  <div className="card-footer text-center">
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Rarities"
                    >
                      <button
                        type="button"
                        title={t("Common")}
                        className={
                          this.state.rarity === "Common"
                            ? "btn btn-outline-light active"
                            : "btn btn-outline-light"
                        }
                        onClick={() => {
                          this.setState({
                            rarity: "Common",
                            textColor: "text-muted",
                          });
                        }}
                      >
                        C
                      </button>
                      <button
                        type="button"
                        title={t("Uncommon")}
                        className={
                          this.state.rarity === "Uncommon"
                            ? "btn btn-outline-success active"
                            : "btn btn-outline-success"
                        }
                        onClick={() => {
                          this.setState({
                            rarity: "Uncommon",
                            textColor: "text-success",
                          });
                        }}
                      >
                        U
                      </button>
                      <button
                        type="button"
                        title={t("Rare")}
                        className={
                          this.state.rarity === "Rare"
                            ? "btn btn-outline-info active"
                            : "btn btn-outline-info"
                        }
                        onClick={() => {
                          this.setState({
                            rarity: "Rare",
                            textColor: "text-info",
                          });
                        }}
                      >
                        R
                      </button>
                      <button
                        type="button"
                        title={t("Epic")}
                        className={
                          this.state.rarity === "Epic"
                            ? "btn btn-outline-danger active"
                            : "btn btn-outline-danger"
                        }
                        onClick={() => {
                          this.setState({
                            rarity: "Epic",
                            textColor: "text-danger",
                          });
                        }}
                      >
                        E
                      </button>
                      <button
                        type="button"
                        title={t("Legendary")}
                        className={
                          this.state.rarity === "Legendary"
                            ? "btn btn-outline-warning active"
                            : "btn btn-outline-warning"
                        }
                        onClick={() => {
                          this.setState({
                            rarity: "Legendary",
                            textColor: "text-warning",
                          });
                        }}
                      >
                        L
                      </button>
                    </div>
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
              <Suspense
                fallback={
                  <div className="col-12 col-xl-6">
                    <div className="card border-secondary mb-3">
                      <LoadingPart />
                    </div>
                  </div>
                }
              >
                <SchematicItems key="schematicItems" item={this.state.item} />
              </Suspense>
              {this.showDescription(t)}
              {this.state.item.structureInfo && (
                <GenericInfo
                  key="structureInfo"
                  name="Structure Info"
                  dataInfo={this.state.item.structureInfo}
                  rarity={this.state.rarity}
                  textColor={this.state.textColor}
                  category={category}
                />
              )}
              {this.state.item.projectileDamage && (
                <GenericInfo
                  key="proyectileInfo"
                  name="Projectile Info"
                  dataInfo={this.state.item.projectileDamage}
                  rarity={this.state.rarity}
                  textColor={this.state.textColor}
                  category={category}
                />
              )}
              {this.state.item.weaponInfo && (
                <GenericInfo
                  key="weaponinfo"
                  name="Weapon Info"
                  dataInfo={this.state.item.weaponInfo}
                  rarity={this.state.rarity}
                  textColor={this.state.textColor}
                  category={category}
                />
              )}
              {this.state.item.armorInfo && (
                <GenericInfo
                  key="armorinfo"
                  name="Armor Info"
                  dataInfo={this.state.item.armorInfo}
                  rarity={this.state.rarity}
                  textColor={this.state.textColor}
                  category={category}
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
              <Suspense
                fallback={
                  <div className="col-12 col-md-6">
                    <div className="card border-secondary mb-3">
                      <LoadingPart />
                    </div>
                  </div>
                }
              >
                <SchematicDropInfo
                  key="schematicInfo"
                  name={this.state.item.name}
                  items={this.state.allItems}
                />
              </Suspense>
              <Suspense
                fallback={
                  <div className="col-12">
                    <div className="card border-secondary mb-3">
                      <LoadingPart />
                    </div>
                  </div>
                }
              >
                <WikiDescription
                  key="wikidescription"
                  name={this.state.item.name}
                />
              </Suspense>
              <Suspense
                fallback={
                  <div className="col-12 col-md-6">
                    <div className="card border-secondary mb-3">
                      <LoadingPart />
                    </div>
                  </div>
                }
              >
                <CanBeUsedInfo
                  key="CanBeUsedInfo"
                  name={this.state.item.name}
                  items={this.state.allItems}
                />
              </Suspense>
              <Suspense
                fallback={
                  <div className="col-12 col-md-6">
                    <div className="card border-secondary mb-3">
                      <LoadingPart />
                    </div>
                  </div>
                }
              >
                <DropsInfo key="dropInfo" drops={this.state.item.drops} />
              </Suspense>
              <Comments key="comments" name={this.state.item.name} />
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
            (window.location.port ? ":" + window.location.port : "") +
            "/item"
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
}

export default withTranslation()(ItemWiki);
