import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class ToolInfo extends Component {
  render() {
    if (this.props?.toolInfo) {
      const { t } = this.props;
      return (
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("Tool info")}</div>
            <div className="card-body">
              <ul className="list-group">{this.showToolInfo(t)}</ul>
            </div>
          </div>
        </div>
      );
    }
    return "";
  }

  showToolInfo(t) {
    return this.props?.toolInfo.map((toolInfo) => {
      return (
        <li
          key={toolInfo.toolType + toolInfo.tier}
          className="list-group-item d-flex justify-content-between lh-condensed"
        >
          <div className="my-0">{t(toolInfo.toolType)}</div>
          <div className="text-muted">{toolInfo.tier}</div>
        </li>
      );
    });
  }
}

export default withTranslation()(ToolInfo);
