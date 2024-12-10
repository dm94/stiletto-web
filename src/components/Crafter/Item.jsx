import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { isDarkMode } from "../../functions/utils";

class Item extends Component {
  render() {
    const { t } = this.props;
    return (
      <div
        className={
          isDarkMode()
            ? "list-group-item list-group-item-dark"
            : "list-group-item"
        }
      >
        <div className="row">
          <div className="col-auto">
            {t(this.props?.item.name, { ns: "items" })}
          </div>
          <div className="col">
            <button
              type="button"
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
