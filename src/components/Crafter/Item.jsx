import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { getStoredItem } from "../../services";

class Item extends Component {
  render() {
    const { t } = this.props;
    return (
      <div
        className={
          getStoredItem("darkmode") !== "true"
            ? "list-group-item"
            : "list-group-item list-group-item-dark"
        }
      >
        <div className="row">
          <div className="col-auto">
            {t(this.props?.item.name, { ns: "items" })}
          </div>
          <div className="col">
            <button
              className="btn btn-success btn-sm float-right"
              aria-label="Add item"
              onClick={() => this.props?.onAdd(this.props?.item.name)}
            >
              <i className="fas fa-plus" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Item);
