import React, { Component, Fragment } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";
import { getItems } from "../services";
import ModalMessage from "../components/ModalMessage";
import Ingredients from "../components/Ingredients";
import Ingredient from "../components/Ingredient";
import Station from "../components/Station";
import Icon from "../components/Icon";
import CraftingTime from "../components/CraftingTime";
import LoadingScreen from "../components/LoadingScreen";

class ItemWiki extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      isLoaded: false,
      canBeUsed: [],
      description: "",
    };
  }

  async componentDidMount() {
    let item_name = this.props.match.params.name;
    if (item_name != null) {
      item_name = decodeURI(item_name);
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

    const options = {
      method: "get",
      url: "https://lastoasis.fandom.com/api.php",
      params: {
        action: "query",
        prop: "extracts",
        titles: item_name,
        exsentences: 10,
        format: "json",
        origin: "*",
        formatversion: 2,
        exlimit: 1,
        explaintext: 1,
      },
    };
    Axios.request(options)
      .then((response) => {
        if (response.status === 200) {
          if (
            response.data != null &&
            response.data.query &&
            response.data.query.pages
          ) {
            if (
              response.data.query.pages[0] != null &&
              response.data.query.pages[0].extract != null
            ) {
              this.setState({
                description: response.data.query.pages[0].extract,
              });
            }
          }
        }
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
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
        let category = this.state.item.category
          ? this.state.item.category
          : t("Not defined");
        let parent = this.state.item.parent
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
              encodeURI(parent.toLowerCase())
            : "wood";
        let craftUrl =
          host +
          (window.location.port ? ":" + window.location.port : "") +
          "/crafter?craft=" +
          encodeURI(name.toLowerCase());
        return (
          <div className="container">
            {this.helmetInfo(name)}
            <div className="row">
              <div className="col-6">
                <div className="card border-secondary mb-3">
                  <div className="card-header">
                    <Icon key={name} name={name} width={35} />
                    {t(name)}
                  </div>
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
                      {this.state.item.stackSize ? (
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
              <div className="col-6">
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
              {this.showDescription(t)}
              {this.showStructureInfo(t)}
              {this.showProyectileInfo(t)}
              {this.showWeaponInfo(t)}
              {this.showArmorInfo(t)}
              {this.showToolInfoPart(t)}
              {this.showWikiDescription(t)}
              {this.showCanBeUsedPart(t)}
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
        <div className="col-6">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("Description")}</div>
            <div className="card-body">{this.state.item.description}</div>
          </div>
        </div>
      );
    }
  }

  showStructureInfo(t) {
    if (this.state.item.structureInfo) {
      return (
        <div className="col-6 col-xl-3">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("Structure info")}</div>
            <div className="card-body">
              <ul className="list-group">
                {this.state.item.structureInfo.type ? (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Type")}</div>
                    <div className="text-muted">
                      {t(this.state.item.structureInfo.type)}
                    </div>
                  </li>
                ) : (
                  ""
                )}
                {this.state.item.structureInfo.hp ? (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Health")}</div>
                    <div className="text-muted">
                      {t(this.state.item.structureInfo.hp)}
                    </div>
                  </li>
                ) : (
                  ""
                )}
              </ul>
            </div>
          </div>
        </div>
      );
    }
  }

  showArmorInfo(t) {
    if (this.state.item.armorInfo) {
      return (
        <div className="col-6 col-xl-3">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("Armor info")}</div>
            <div className="card-body">
              <ul className="list-group">
                {this.state.item.armorInfo.soak ? (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Soak")}</div>
                    <div className="text-muted">
                      {t(this.state.item.armorInfo.soak)}
                    </div>
                  </li>
                ) : (
                  ""
                )}
                {this.state.item.armorInfo.reduce ? (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Reduce")}</div>
                    <div className="text-muted">
                      {t(this.state.item.armorInfo.reduce)}
                    </div>
                  </li>
                ) : (
                  ""
                )}
                {this.state.item.armorInfo.movementSpeedReduction ? (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Speed reduction")}</div>
                    <div className="text-muted">
                      {t(this.state.item.armorInfo.movementSpeedReduction)}
                    </div>
                  </li>
                ) : (
                  ""
                )}
              </ul>
            </div>
          </div>
        </div>
      );
    }
  }

  showWeaponInfo(t) {
    if (this.state.item.weaponInfo) {
      return (
        <div className="col-6 col-xl-3">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("Weapon info")}</div>
            <div className="card-body">
              <ul className="list-group">
                {this.state.item.weaponInfo.weaponSpeed ? (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Speed")}</div>
                    <div className="text-muted">
                      {this.state.item.weaponInfo.weaponSpeed}
                    </div>
                  </li>
                ) : (
                  ""
                )}
                {this.state.item.weaponInfo.impact ? (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Impact")}</div>
                    <div className="text-muted">
                      {this.state.item.weaponInfo.impact}
                    </div>
                  </li>
                ) : (
                  ""
                )}
                {this.state.item.weaponInfo.stability ? (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Stability")}</div>
                    <div className="text-muted">
                      {this.state.item.weaponInfo.stability}
                    </div>
                  </li>
                ) : (
                  ""
                )}
                {this.state.item.weaponInfo.weaponLength ? (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Length")}</div>
                    <div className="text-muted">
                      {this.state.item.weaponInfo.weaponLength}
                    </div>
                  </li>
                ) : (
                  ""
                )}
                {this.state.item.weaponInfo.damage ? (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Damage")}</div>
                    <div className="text-muted">
                      {this.state.item.weaponInfo.damage}
                    </div>
                  </li>
                ) : (
                  ""
                )}
                {this.state.item.weaponInfo.penetration ? (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Penetration")}</div>
                    <div className="text-muted">
                      {this.state.item.weaponInfo.penetration}
                    </div>
                  </li>
                ) : (
                  ""
                )}
              </ul>
            </div>
          </div>
        </div>
      );
    }
  }

  showToolInfoPart(t) {
    if (this.state.item.toolInfo) {
      return (
        <div className="col-6 col-xl-3">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("Tool info")}</div>
            <div className="card-body">
              <ul className="list-group">{this.showToolInfo(t)}</ul>
            </div>
          </div>
        </div>
      );
    }
  }

  showToolInfo(t) {
    return this.state.item.toolInfo.map((toolInfo) => {
      return (
        <li
          key={toolInfo.toolType + toolInfo.tier}
          className="list-group-item d-flex justify-content-between lh-condensed"
        >
          <div className="my-0">{t(toolInfo.toolType)}</div>
          <div className="text-muted">{toolInfo.tier}</div>
        </li>
      );
    });
  }

  showProyectileInfo(t) {
    if (this.state.item.projectileDamage) {
      return (
        <div className="col-6 col-xl-3">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("Projectile info")}</div>
            <div className="card-body">
              <ul className="list-group">
                {this.state.item.projectileDamage.damage ? (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Damage")}</div>
                    <div className="text-muted">
                      {this.state.item.projectileDamage.damage}
                    </div>
                  </li>
                ) : (
                  ""
                )}
                {this.state.item.projectileDamage.penetration ? (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Penetration")}</div>
                    <div className="text-muted">
                      {this.state.item.projectileDamage.penetration}
                    </div>
                  </li>
                ) : (
                  ""
                )}
                {this.state.item.projectileDamage.effectivenessVsSoak ? (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("vs Soak")}</div>
                    <div className="text-muted">
                      {this.state.item.projectileDamage.effectivenessVsSoak}
                    </div>
                  </li>
                ) : (
                  ""
                )}
                {this.state.item.projectileDamage.effectivenessVsReduce ? (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("vs Reduce")}</div>
                    <div className="text-muted">
                      {this.state.item.projectileDamage.effectivenessVsReduce}
                    </div>
                  </li>
                ) : (
                  ""
                )}
              </ul>
            </div>
          </div>
        </div>
      );
    }
  }

  showWikiDescription(t) {
    if (this.state.description !== "") {
      return (
        <div className="col-12">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("Description by Wiki")}</div>
            <div className="card-body">
              <pre>{this.state.description}</pre>
            </div>
            <div className="card-footer">
              <a
                type="button"
                className="btn btn-lg btn-info btn-block"
                target="_blank"
                rel="noopener noreferrer"
                href={
                  "https://lastoasis.fandom.com/wiki/Special:Search?query=" +
                  this.state.item.name +
                  "&scope=internal&navigationSearch=true"
                }
              >
                {t("Wiki")}
              </a>
            </div>
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
        <div className="col-6">
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
}

export default withTranslation()(ItemWiki);
