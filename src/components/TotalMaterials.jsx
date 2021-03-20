import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Axios from "axios";
import ListIngredients from "./ListIngredients";

class TotalMaterials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipeToken: "",
    };
  }

  addRecipe = () => {
    let items = this.props.selectedItems.map((item) => {
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
          this.props.onError("Error connecting to database");
        } else if (response.status === 201) {
          console.log(response.data);
          this.setState({ recipeToken: response.data.token });
        }
      })
      .catch(() => {
        this.props.onError("Error when connecting to the API");
      });
  };

  shareButton(t) {
    if (this.state.recipeToken.length > 0) {
      let url =
        window.location.protocol.concat("//").concat(window.location.hostname) +
        (window.location.port ? ":" + window.location.port : "") +
        "/crafter?recipe=" +
        this.state.recipeToken;
      return (
        <div className="input-group mb-3 float-left">
          <input type="text" className="form-control" value={url} disabled />
          <div className="input-group-append">
            <button
              className="btn btn-success"
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(url);
              }}
            >
              {t("Copy")}
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <button
          className="btn btn-success float-right"
          onClick={this.addRecipe}
          disabled={
            !(
              this.props.selectedItems.length > 0 &&
              this.props.selectedItems.length < 21
            )
          }
        >
          {t("Share")}
        </button>
      );
    }
  }

  itemsList() {
    return this.props.selectedItems.map((item) => (
      <li className="list-inline-item" key={item.name}>
        {item.count}x {item.name} -
      </li>
    ));
  }

  render() {
    const { t } = this.props;
    return (
      <div className="card border-warning m-3">
        <div className="card-header border-warning">
          <div className="font-weight-normal">{t("Total materials")}</div>
        </div>
        <div className="card-body" id="list-all-items">
          <ul className="list-inline">{this.itemsList()}</ul>
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
        <div className="card-footer">{this.shareButton(t)}</div>
      </div>
    );
  }
}
export default withTranslation()(TotalMaterials);
