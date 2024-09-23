import React, { Component, Fragment } from "react";
import { withTranslation } from "react-i18next";

class DropsInfo extends Component {
  render() {
    if (this.props.drops) {
      const { t } = this.props;
      return (
        <Fragment>
          <div className="col-12 col-md-6">
            <div className="card border-secondary mb-3">
              <div className="card-header">{t("Obtainable from")}</div>
              <div className="card-body">
                <ul className="list-inline">{this.showDrops(t)}</ul>
              </div>
            </div>
          </div>
        </Fragment>
      );
    }
    return "";
  }

  showDrops(t) {
    return this.props.drops.map((drop, index) => {
      const titleInfo = `Drop ${drop?.chance ?? "unknown"}% -> ${drop?.minQuantity ?? "unknown"}/${drop?.maxQuantity ?? "unknown"}`;

      return (
        <li className="list-inline-item" key={drop.location + "-" + index} title={titleInfo}>
          <p className="list-group-item">{t(drop.location)}</p>
        </li>
      );
    });
  }
}

export default withTranslation()(DropsInfo);
