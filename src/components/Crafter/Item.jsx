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
          <div className="col-auto">{t(this.props.item.name)}</div>
          <div className="col">
            <button
              className="btn btn-success btn-sm float-right"
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
