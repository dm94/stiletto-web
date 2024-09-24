import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Icon from "./Icon";

class Station extends Component {
  render() {
    const { t } = this.props;
    return (
      <div className="text-right mb-0 text-muted">
        {t("made on")} <Icon key={this.props?.name} name={this.props?.name} />{" "}
        {t(this.props?.name)}
      </div>
    );
  }
}

export default withTranslation()(Station);
