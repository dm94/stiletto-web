import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Icon from "../Icon";

class SchematicDropInfo extends Component {
  render() {
    if (this.props.name && this.props.items) {
      const { t } = this.props;
      let schematics = this.props.items.filter(
        (it) =>
          it.category === "Schematics" &&
          it.learn &&
          it.learn.includes(this.props.name)
      );
      if (schematics.length > 0) {
        return (
          <div className="col-12 col-md-6">
            <div className="card border-secondary mb-3">
              <div className="card-header">{t("Learned in")}</div>
              <div className="card-body">
                <ul className="list-inline">
                  {this.showSchematics(t, schematics)}
                </ul>
              </div>
            </div>
          </div>
        );
      }
    }
    return "";
  }

  showSchematics(t, schematics) {
    return schematics.map((schematic, index) => {
      let http = window.location.protocol;
      let slashes = http.concat("//");
      let host = slashes.concat(window.location.hostname);
      let url =
        host +
        (window.location.port ? ":" + window.location.port : "") +
        "/item/" +
        encodeURI(schematic.name.toLowerCase().replaceAll(" ", "_"));
      return (
        <li className="list-inline-item" key={schematic.name + "-" + index}>
          <div className="list-group-item">
            <Icon key={schematic.name} name={schematic.name} />
            <a href={url}>{t(schematic.name, { ns: "items" })}</a>
          </div>
        </li>
      );
    });
  }
}

export default withTranslation()(SchematicDropInfo);
