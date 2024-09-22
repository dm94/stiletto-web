import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Icon from "../Icon";
import { getDomain } from "../../functions/utils";

class SchematicItems extends Component {
  render() {
    if (this.props.item && this.props.item.learn) {
      const { t } = this.props;

      return (
        <div className="col-12 col-xl-6">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("It is used to")}</div>
            <div className="card-body">
              <ul className="list-inline">{this.showSchematicItems(t)}</ul>
            </div>
          </div>
        </div>
      );
    }
    return "";
  }

  showSchematicItems(t) {
    return this.props.item.learn.map((itemCraft, index) => {
      const url =
      getDomain() +
        "/item/" +
        encodeURI(itemCraft.toLowerCase().replaceAll(" ", "_"));
      return (
        <li className="list-inline-item" key={itemCraft + "-" + index}>
          <div className="list-group-item">
            <Icon key={itemCraft} name={itemCraft} />
            <a href={url}>{t(itemCraft)}</a>
          </div>
        </li>
      );
    });
  }
}

export default withTranslation()(SchematicItems);
