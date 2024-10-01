import React from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";
import { getItemUrl } from "../../functions/utils";

const SchematicItems = ({ item }) => {
  const { t } = useTranslation();

  const showSchematicItems = () => {
    return item?.learn?.map((itemCraft, index) => {
      const url = getItemUrl(itemCraft);

      return (
        <li className="list-inline-item" key={itemCraft + "-" + index}>
          <div className="list-group-item">
            <Icon key={itemCraft} name={itemCraft} />
            <a href={url}>{t(itemCraft)}</a>
          </div>
        </li>
      );
    });
  };

  if (item?.learn) {
    return (
      <div className="col-12 col-xl-6">
        <div className="card border-secondary mb-3">
          <div className="card-header">{t("It is used to")}</div>
          <div className="card-body">
            <ul className="list-inline">{showSchematicItems()}</ul>
          </div>
        </div>
      </div>
    );
  }

  return false;
};

export default SchematicItems;
