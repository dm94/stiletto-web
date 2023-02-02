import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { calcRarityValue } from "../../rarityCalc";

class GenericInfo extends Component {
  render() {
    if (this.props.dataInfo) {
      const { t } = this.props;
      return (
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t(this.props.name)}</div>
            <div className="card-body">
              <ul className="list-group">{this.showValues(t)}</ul>
            </div>
          </div>
        </div>
      );
    }
    return "";
  }

  showValues(t) {
    return Object.keys(this.props.dataInfo).map((key) => {
      if (this.props.dataInfo[key]) {
        const value = calcRarityValue(
          this.props.rarity,
          key,
          this.props.category,
          this.props.dataInfo[key]
        );
        return (
          <li
            key={`infolist-${this.props.name}-${key}`}
            className="list-group-item d-flex justify-content-between lh-condensed"
          >
            <div className="my-0 text-capitalize">{t(key)}</div>
            <div
              className={
                value != this.props.dataInfo[key]
                  ? this.props.textColor
                  : "text-muted"
              }
            >
              {value}
            </div>
          </li>
        );
      } else {
        return "";
      }
    });
  }
}

export default withTranslation()(GenericInfo);
