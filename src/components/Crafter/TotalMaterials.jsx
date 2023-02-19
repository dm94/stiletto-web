import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Axios from "axios";
import ListIngredients from "./ListIngredients";
import Icon from "../Icon";
import { sendEvent } from "../../page-tracking";
import { sendNotification } from "../../functions/broadcast";

class TotalMaterials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipeToken: "",
    };
  }

  addRecipe = () => {
    sendEvent({
      category: "Share",
      action: "Generate a recipe code",
    });
    const items = this.props.selectedItems.map((item) => {
      return { name: item.name, count: item.count };
    });
    const options = {
      method: "post",
      url: process.env.REACT_APP_API_URL + "/recipes",
      params: {
        items: JSON.stringify(items),
      },
    };

    Axios.request(options)
      .then((response) => {
        if (response.status === 503) {
          sendNotification("Error connecting to database", "Error");
        } else if (response.status === 201) {
          sendNotification("Sharing code has been generated", "Information");
          this.setState({ recipeToken: response.data.token });
        }
      })
      .catch(() => {
        sendNotification("Error when connecting to the API", "Error");
      });
  };

  footerPart(t) {
    if (this.state.recipeToken.length > 0) {
      const url =
        window.location.protocol.concat("//").concat(window.location.hostname) +
        (window.location.port ? ":" + window.location.port : "") +
        "/crafter?recipe=" +
        this.state.recipeToken;
      return (
        <div className="input-group mb-3 float-left">
          <input
            type="text"
            className="form-control"
            data-cy="share-crafter-input"
            value={url}
            disabled
          />
          <div className="input-group-append">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(url);
              }}
            >
              {t("Copy")}
            </button>
            {this.shareButton(t)}
          </div>
        </div>
      );
    } else {
      return this.shareButton(t);
    }
  }

  shareButton(t) {
    return (
      <button
        className="btn btn-success float-right"
        onClick={this.addRecipe}
        title={t("Generate a link to share it")}
        data-cy="share-crafter-btn"
        disabled={this.props.selectedItems.length <= 0}
      >
        <i className="fas fa-share-alt"></i> {t("Share")}
      </button>
    );
  }

  itemsList(t) {
    const http = window.location.protocol;
    const slashes = http.concat("//");
    const host = slashes.concat(window.location.hostname);
    const url =
      host +
      (window.location.port ? ":" + window.location.port : "") +
      "/item/";

    return this.props.selectedItems.map((item) => (
      <li className="list-inline-item" key={item.name}>
        <Icon key={item.name} name={item.name} /> {item.count}x{" "}
        <a href={url + encodeURI(item.name.replaceAll(" ", "_"))}>
          {t(item.name, { ns: "items" })}
        </a>{" "}
        -
      </li>
    ));
  }

  copyMaterials = (t) => {
    sendEvent({
      category: "Share",
      action: "Copy materials",
    });

    let text = t("To make") + ":\n\n";

    this.props.selectedItems.forEach(
      (item) =>
        (text += item.count + "x " + t(item.name, { ns: "items" }) + " - ")
    );

    text += "\n\n" + t("You need the following materials") + ":\n\n";

    const totalIngredients = [];
    this.props.selectedItems.forEach((item) => {
      if (item.crafting != null && item.crafting[0].ingredients != null) {
        const output =
          item.crafting[0].output != null ? item.crafting[0].output : 1;
        item.crafting[0].ingredients.forEach((ingredient) => {
          if (
            totalIngredients.find((ingre) => ingre.name === ingredient.name)
          ) {
            totalIngredients.forEach((ingre) => {
              if (ingre.name === ingredient.name) {
                ingre.count += (ingredient.count / output) * item.count;
              }
            });
          } else {
            totalIngredients.push({
              name: ingredient.name,
              count: (ingredient.count / output) * item.count,
              ingredients: ingredient.ingredients,
            });
          }
        });
      }
    });
    totalIngredients.forEach(
      (ingredient) =>
        (text += "\t" + ingredient.count + "x " + t(ingredient.name) + "\n")
    );

    text +=
      "\n" +
      t("List of all necessary materials by") +
      " " +
      window.location.origin;

    navigator.clipboard.writeText(text);
    sendNotification("Items copied to the clipboard", "Information");
  };

  render() {
    const { t } = this.props;
    return (
      <div className="card border-warning m-3">
        <div className="card-header border-warning">
          <button
            className="btn btn-sm btn-primary float-right"
            title={t("Copy to clipboard")}
            data-cy="crafter-copy-clipboard"
            onClick={() => this.copyMaterials(t)}
            disabled={this.props.selectedItems.length <= 0}
          >
            <i className="fas fa-copy"></i>
          </button>
          <div className="font-weight-normal">{t("Total materials")}</div>
        </div>
        <div className="card-body" id="list-all-items">
          <ul className="list-inline">{this.itemsList(t)}</ul>
          <div className="list-unstyled">
            <ListIngredients
              ref={this.componentRef}
              selectedItems={this.props.selectedItems}
            />
            <li className="text-right text-muted">
              {t("List of all necessary materials by")}{" "}
              {window.location.hostname +
                (window.location.port ? ":" + window.location.port : "")}
            </li>
          </div>
        </div>
        <div className="card-footer">{this.footerPart(t)}</div>
      </div>
    );
  }
}
export default withTranslation()(TotalMaterials);
