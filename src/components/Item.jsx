import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class Item extends Component {
  render() {
    const { t } = this.props;
    return (
      <li
        className={
          localStorage.getItem("darkmode") !== "true"
            ? "list-group-item"
            : "list-group-item list-group-item-dark"
        }
      >
        <div className="row">
          <div className="col-md-8 col-xl-10">{t(this.props.item.name)}</div>
          <div className="col-md-7 col-xl-2">
            <button
              className="btn btn-success btn-sm"
              onClick={() => this.props.onAdd(this.props.item.name)}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </li>
    );
  }
}

export default withTranslation()(Item);
