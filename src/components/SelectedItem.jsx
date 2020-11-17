import React, { Component } from "react";
import Ingredients from "./Ingredients";
import { withTranslation } from "react-i18next";

class SelectedItem extends Component {
  showIngredient() {
    if (this.props.item.crafting != null) {
      return this.props.item.crafting.map((ingredients) => (
        <Ingredients
          key={this.props.item.name}
          crafting={ingredients}
          value={this.props.value}
        />
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
          {t("made on")} {t(this.props.item.crafting[0].station)}
        </div>
      );
    }
  }

  render() {
    const { t } = this.props;
    return (
      <div className="col">
        <div className="card">
          <div className="text-center card-header">
            {this.props.value}x {t(this.props.item.name)}
            <button
              className="close"
              onClick={(e) =>
                this.props.onChangeCount(this.props.item.name, -100000)
              }
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="card-body">
            <div className="list-unstyled ">{this.showIngredient()}</div>
            {this.showStation(t)}
          </div>
          <div className="card-footer">
            <div className="btn-group col-xl-12" role="group">
              <button
                className="btn btn-success"
                onClick={(e) =>
                  this.props.onChangeCount(this.props.item.name, 1)
                }
              >
                +1
              </button>
              <button
                className="btn btn-success"
                onClick={(e) =>
                  this.props.onChangeCount(this.props.item.name, 10)
                }
              >
                +10
              </button>
              <button
                className="btn btn-success"
                onClick={(e) =>
                  this.props.onChangeCount(this.props.item.name, 100)
                }
              >
                +100
              </button>
              <button
                className="btn btn-danger"
                onClick={(e) =>
                  this.props.onChangeCount(this.props.item.name, -1)
                }
              >
                -1
              </button>
              <button
                className="btn btn-danger"
                onClick={(e) =>
                  this.props.onChangeCount(this.props.item.name, -10)
                }
              >
                -10
              </button>
              <button
                className="btn btn-danger"
                onClick={(e) =>
                  this.props.onChangeCount(this.props.item.name, -100)
                }
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
