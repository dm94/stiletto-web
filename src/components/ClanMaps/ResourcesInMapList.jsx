import React, { useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";

const ResourcesInMapList = ({ resources, onFilter, onSelect }) => {
  const { t } = useTranslation();
  const [resourceTypeFilter, setResourceTypeFilter] = useState("All");

  const filterTheResources = (type) => {
    setResourceTypeFilter(type);
    onFilter?.(type);
  };

  const renderList = () => {
    const filteredResources =
      resourceTypeFilter === "All"
        ? resources?.filter((r) => r.x != null)
        : resources?.filter(
            (r) => r.x != null && r.resourcetype === resourceTypeFilter
          );

    return filteredResources?.map((resource) => (
      <li className="list-group-item text-center" key={resource.resourceid}>
        <button
          type="button"
          className="btn btn-block"
          onClick={() => onSelect?.(resource.x, resource.y)}
        >
          <Icon name={resource.resourcetype} />
          {t(resource.resourcetype)}
        </button>
      </li>
    ));
  };

  const renderFilterList = () => {
    const resourceTypes = ["All"];
    for (const resource of resources) {
      if (
        resource.x != null &&
        !resourceTypes.includes(resource.resourcetype)
      ) {
        resourceTypes.push(resource.resourcetype);
      }
    }

    return resourceTypes.map((type) => (
      <button
        type="button"
        key={type}
        className={`btn btn-secondary ${
          type === resourceTypeFilter ? "active" : ""
        }`}
        onClick={() => filterTheResources(type)}
      >
        <Icon name={type} />
        {t(type)}
      </button>
    ));
  };

  if (!resources) {
    return false;
  }

  return (
    <Fragment>
      <fieldset className="btn-group btn-group-sm">
        {renderFilterList()}
      </fieldset>
      <ul className="list-group">{renderList()}</ul>
    </Fragment>
  );
};

export default ResourcesInMapList;
