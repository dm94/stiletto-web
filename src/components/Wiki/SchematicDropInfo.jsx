import React from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";
import { getItemUrl } from "../../functions/utils";

const SchematicDropInfo = ({ name, items }) => {
  const { t } = useTranslation();

  const showSchematics = (schematics) => {
    return schematics.map((schematic) => {
      const url = getItemUrl(schematic.name);

      return (
        <li className="list-inline-item" key={`schematic-${schematic.name}`}>
          <div className="list-group-item">
            <Icon key={schematic.name} name={schematic.name} />
            <a href={url}>{t(schematic.name, { ns: "items" })}</a>
          </div>
        </li>
      );
    });
  };

  if (name && items) {
    const schematics = items.filter(
      (it) => it?.category === "Schematics" && it?.learn?.includes(name)
    );

    if (schematics.length > 0) {
      return (
        <div className="col-12 col-md-6">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("Learned in")}</div>
            <div className="card-body">
              <ul className="list-inline">{showSchematics(schematics)}</ul>
            </div>
          </div>
        </div>
      );
    }
  }

  return false;
};

export default SchematicDropInfo;
