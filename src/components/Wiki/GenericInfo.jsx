import React, { Component } from "react";
import { withTranslation } from "react-i18next";

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
    return Object.keys(this.props.dataInfo).map((key, index) => {
      if (this.props.dataInfo[key]) {
        return (
          <li
            key={key + "-" + index}
            className="list-group-item d-flex justify-content-between lh-condensed"
          >
            <div className="my-0 text-capitalize">{t(key)}</div>
            <div className="text-muted">{this.props.dataInfo[key]}</div>
          </li>
        );
      } else {
        return "";
      }
    });
  }
}

export default withTranslation()(GenericInfo);
