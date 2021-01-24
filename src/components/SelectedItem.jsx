import React, { Component } from "react";
import Ingredients from "./Ingredients";
import { withTranslation } from "react-i18next";
import Icon from "./Icon";
import { getStyle } from "./BGDarkSyles";

class SelectedItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableEdit: true,
    };
  }

  showIngredient() {
    if (this.props.item.crafting != null) {
      return this.props.item.crafting.map((ingredients) => (
        <div
          className={
            this.props.item.crafting.length > 1
              ? "col-xl-6 border"
              : "col-xl-12"
          }
          key={this.props.item.name}
        >
          <Ingredients crafting={ingredients} value={this.props.item.count} />
        </div>
      ));
    }
  }

  showStation(t) {
    if (
      this.props.item.crafting != null &&
      this.props.item.crafting[0].station != null
    ) {
      return (
        <div className="text-right mb-0 text-muted">
          {t("made on")}{" "}
          <Icon
            key={this.props.item.crafting[0].station}
            name={this.props.item.crafting[0].station}
          />{" "}
          {t(this.props.item.crafting[0].station)}
        </div>
      );
    }
  }

  change(count) {
    this.props.onChangeCount(
      this.props.item.name,
      parseInt(this.props.item.count) + count
    );
  }

  render() {
    const { t } = this.props;
    return (
      <div className="col">
        <div className={getStyle("card")}>
          <div className="text-center card-header">
            <button
              className="close"
              onClick={(e) => this.props.onChangeCount(this.props.item.name, 0)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <div className="input-group w-75">
              <input
                type="number"
                className={getStyle("form-control text-right")}
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
              <span className={getStyle("input-group-text")}>
                x {t(this.props.item.name)}
              </span>
            </div>
          </div>
          <div className="card-body">
            <div className="list-unstyled row">{this.showIngredient()}</div>
            {this.showStation(t)}
          </div>
          <div className="card-footer">
            <div className="row">
              <button
                className="btn btn-success col"
                onClick={() => this.change(1)}
              >
                +1
              </button>
              <button
                className="btn btn-success col"
                onClick={() => this.change(10)}
              >
                +10
              </button>
              <button
                className="btn btn-success col"
                onClick={() => this.change(100)}
              >
                +100
              </button>
              <button
                className="btn btn-danger col"
                onClick={() => this.change(-1)}
              >
                -1
              </button>
              <button
                className="btn btn-danger col"
                onClick={() => this.change(-10)}
              >
                -10
              </button>
              <button
                className="btn btn-danger col"
                onClick={() => this.change(-100)}
              >
                -100
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(SelectedItem);
