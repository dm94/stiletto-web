import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class ModuleInfo extends Component {
  render() {
    if (this.props.moduleInfo) {
      const { t } = this.props;
      return (
        <div className="col-12 col-md-6">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("Module info")}</div>
            <div className="card-body">
              <ul className="list-group">
                {this.props.moduleInfo.max ? (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Limit per walker")}</div>
                    <div className="text-muted">
                      {this.props.moduleInfo.max}
                    </div>
                  </li>
                ) : (
                  ""
                )}
                {this.props.moduleInfo.increase ? (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Improvement per module")}</div>
                    <div className="text-muted">
                      {this.props.moduleInfo.increase}
                    </div>
                  </li>
                ) : (
                  ""
                )}
                {this.props.moduleInfo.maxIncrease ? (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Maximum improvement")}</div>
                    <div className="text-muted">
                      {this.props.moduleInfo.maxIncrease}
                    </div>
                  </li>
                ) : (
                  ""
                )}
              </ul>
            </div>
          </div>
        </div>
      );
    }
    return "";
  }
}

export default withTranslation()(ModuleInfo);
