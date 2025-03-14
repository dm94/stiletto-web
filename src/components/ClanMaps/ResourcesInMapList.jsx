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
      <li className="p-2 bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors" key={resource.resourceid}>
        <button
          type="button"
          className="w-full p-2 text-gray-300 hover:text-white focus:outline-none"
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
        className={`p-2 rounded-lg ${
          type === resourceTypeFilter
            ? "bg-gray-600 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
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
      <div className="flex flex-wrap gap-2 mb-4">
        {renderFilterList()}
      </div>
      <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
        {renderList()}
      </ul>
    </Fragment>
  );
};

export default ResourcesInMapList;
