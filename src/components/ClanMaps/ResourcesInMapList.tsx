import type React from "react";
import { useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";
import type { Resource } from "../../types/dto/resources";

interface ResourcesInMapListProps {
  resources: Resource[] | null;
  onFilter?: (resourceType: string) => void;
  onSelect?: (x: number, y: number) => void;
}

const ResourcesInMapList: React.FC<ResourcesInMapListProps> = ({
  resources,
  onFilter,
  onSelect,
}) => {
  const { t } = useTranslation();
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>("All");

  const filterTheResources = (type: string) => {
    setResourceTypeFilter(type);
    onFilter?.(type);
  };

  const renderList = () => {
    const filteredResources =
      resourceTypeFilter === "All"
        ? resources?.filter((r: Resource) => r.x != null)
        : resources?.filter(
            (r: Resource) =>
              r.x != null && r.resourcetype === resourceTypeFilter,
          );

    return filteredResources?.map((resource: Resource) => (
      <li
        className="p-2 bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
        key={resource.resourceid}
      >
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
    if (!resources) {
      return false;
    }

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

  return (
    <Fragment>
      <div className="flex flex-wrap gap-4 mb-4 justify-center">
        {renderFilterList()}
      </div>
      <ul className="space-y-2 max-h-[60vh] overflow-y-auto">{renderList()}</ul>
    </Fragment>
  );
};

export default ResourcesInMapList;
