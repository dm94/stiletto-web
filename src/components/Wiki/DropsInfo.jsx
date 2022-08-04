import React, { Component, Fragment } from "react";
import { withTranslation } from "react-i18next";

class DropsInfo extends Component {
  render() {
    if (this.props.drops) {
      const { t } = this.props;
      return (
        <Fragment>
          <div className="col-12">
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
      return (
        <li className="list-inline-item" key={drop.location + "-" + index}>
          <div className="list-group-item">{t(drop.location)}</div>
        </li>
      );
    });
  }

  showDropsWithDetails(t) {
    return this.props.drops.map((drop, index) => {
      return (
        <div
          key={drop.location + "-" + index}
          className="col-12 col-md-6 col-xl-3"
        >
          <div className="card border-secondary mb-3">
            <div className="card-header">{t(drop.location)}</div>
            {drop.chance ? (
              <div className="card-body">
                <ul className="list-group">
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0 text-capitalize">{t("Chance")}</div>
                    <div className="text-muted">{drop.chance}</div>
                  </li>
                  {drop.minQuantity ? (
                    <li className="list-group-item d-flex justify-content-between lh-condensed">
                      <div className="my-0 text-capitalize">
                        {t("Min Quantity")}
                      </div>
                      <div className="text-muted">{drop.minQuantity}</div>
                    </li>
                  ) : (
                    ""
                  )}
                  {drop.maxQuantity ? (
                    <li className="list-group-item d-flex justify-content-between lh-condensed">
                      <div className="my-0 text-capitalize">
                        {t("Max Quantity")}
                      </div>
                      <div className="text-muted">{drop.maxQuantity}</div>
                    </li>
                  ) : (
                    ""
                  )}
                </ul>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      );
    });
  }
}

export default withTranslation()(DropsInfo);
