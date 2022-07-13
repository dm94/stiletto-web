import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Ingredients from "../Ingredients";
import Icon from "../Icon";
import CraftingTime from "../CraftingTime";
import Station from "../Station";

class SelectedItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableEdit: true,
    };
  }

  showIngredient(t) {
    if (this.props.item.crafting != null) {
      return this.props.item.crafting.map((ingredients, i) => (
        <div
          className={
            this.props.item.crafting.length > 1
              ? "col-xl-6 border border-success"
              : "col-xl-12"
          }
          key={this.props.item.name + this.props.item.count + i}
        >
          <Ingredients
            crafting={ingredients}
            value={
              ingredients.output != null
                ? this.props.item.count / ingredients.output
                : this.props.item.count
            }
          />
          {ingredients.station && <Station name={ingredients.station} />}
          {ingredients.time && (
            <CraftingTime
              time={ingredients.time}
              total={this.props.item.count}
            />
          )}
        </div>
      ));
    }
  }

  showDamage(t) {
    if (this.props.item.damage != null) {
      return (
        <div className="col-12 text-muted">
          <div className="row">
            <div className="col-12">{t("Damage")}</div>
            <div className="col">
              100% = {this.props.item.damage * this.props.item.count}
            </div>
            <div className="col">
              50% = {this.props.item.damage * this.props.item.count * 0.5}
            </div>
            <div className="col">
              30% = {this.props.item.damage * this.props.item.count * 0.3}
            </div>
            <div className="col">
              10% = {this.props.item.damage * this.props.item.count * 0.1}
            </div>
          </div>
        </div>
      );
    }
  }

  change = (count) => {
    this.props.onChangeCount(
      this.props.item.name,
      parseInt(this.props.item.count) + count
    );
  };

  render() {
    const { t } = this.props;
    let http = window.location.protocol;
    let slashes = http.concat("//");
    let host = slashes.concat(window.location.hostname);
    let url =
      host +
      (window.location.port ? ":" + window.location.port : "") +
      "/item/" +
      encodeURI(this.props.item.name.replaceAll(" ", "_"));
    return (
      <div className="col-xl-6 col-sm-12">
        <div className="card">
          <div className="text-center card-header">
            <button
              className="close"
              onClick={(e) => this.props.onChangeCount(this.props.item.name, 0)}
            >
              <span aria-hidden="true">X</span>
            </button>
            <div className="input-group w-75">
              <input
                type="number"
                className="form-control text-center"
                value={this.props.item.count}
                onChange={(e) => {
                  this.props.onChangeCount(
                    this.props.item.name,
                    e.target.value
                  );
                }}
                onMouseEnter={() => this.setState({ disableEdit: false })}
                onMouseLeave={() => {
                  this.setState({ disableEdit: true });
                }}
                min="1"
                max="9999"
                readOnly={this.state.disableEdit}
              />
              <span className="input-group-text">
                <Icon key={this.props.item.name} name={this.props.item.name} />
                {"x "}
                <a href={url}>{t(this.props.item.name)}</a>
              </span>
            </div>
          </div>
          <div className="card-body">
            <div className="list-unstyled row">{this.showIngredient(t)}</div>
            {this.showDamage(t)}
          </div>
          <div className="card-footer">
            <div className="row">
              <div className="col-4 col-lg-2 p-1">
                <button
                  className="btn btn-success btn-block"
                  onClick={() => this.change(1)}
                >
                  +1
                </button>
              </div>
              <div className="col-4 col-lg-2 p-1">
                {" "}
                <button
                  className="btn btn-success btn-block"
                  onClick={() => this.change(10)}
                >
                  +10
                </button>{" "}
              </div>
              <div className="col-4 col-lg-2 p-1">
                <button
                  className="btn btn-success btn-block"
                  onClick={() => this.change(100)}
                >
                  +100
                </button>
              </div>
              <div className="col-4 col-lg-2 p-1">
                <button
                  className="btn btn-danger btn-block"
                  onClick={() => this.change(-1)}
                >
                  -1
                </button>
              </div>
              <div className="col-4 col-lg-2 p-1">
                <button
                  className="btn btn-danger btn-block"
                  onClick={() => this.change(-10)}
                >
                  -10
                </button>
              </div>
              <div className="col-4 col-lg-2 p-1">
                <button
                  className="btn btn-danger btn-block"
                  onClick={() => this.change(-100)}
                >
                  -100
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(SelectedItem);
