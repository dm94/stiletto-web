import type React from "react";
import { useState, Fragment, useCallback, useMemo, memo } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";
import type { ResourceInfo } from "@ctypes/dto/resources";

interface ResourcesInMapListProps {
  resources: ResourceInfo[];
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

  const filterTheResources = useCallback(
    (type: string) => {
      setResourceTypeFilter(type);
      onFilter?.(type);
    },
    [onFilter],
  );

  const handleResourceSelect = useCallback(
    (resource: ResourceInfo) => {
      onSelect?.(resource.x, resource.y);
    },
    [onSelect],
  );

  const filteredResources = useMemo(() => {
    if (!resources) {
      return [];
    }

    return resourceTypeFilter === "All"
      ? resources.filter((r: ResourceInfo) => r.x != null)
      : resources.filter(
          (r: ResourceInfo) =>
            r.x != null && r.resourcetype === resourceTypeFilter,
        );
  }, [resources, resourceTypeFilter]);

  const renderList = useMemo(() => {
    return filteredResources.map((resource: ResourceInfo) => (
      <li
        className="p-2 bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
        key={resource.resourceid}
      >
        <button
          type="button"
          className="w-full p-2 text-gray-300 hover:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          onClick={() => handleResourceSelect(resource)}
          aria-label={`${t(resource.resourcetype)} at coordinates ${Math.floor(resource.x)},${Math.floor(resource.y)}`}
        >
          <Icon name={resource.resourcetype} aria-hidden="true" />
          {t(resource.resourcetype)}
        </button>
      </li>
    ));
  }, [filteredResources, handleResourceSelect, t]);

  const resourceTypes = useMemo(() => {
    if (!resources) {
      return ["All"];
    }

    const types = ["All"];
    for (const resource of resources) {
      if (resource.x != null && !types.includes(resource.resourcetype)) {
        types.push(resource.resourcetype);
      }
    }
    return types;
  }, [resources]);

  const renderFilterList = useMemo(() => {
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
        aria-pressed={type === resourceTypeFilter}
        aria-label={`${t("common.filter")}: ${t(type)}`}
      >
        <Icon name={type} aria-hidden="true" />
        {t(type)}
      </button>
    ));
  }, [resourceTypes, resourceTypeFilter, filterTheResources, t]);

  return (
    <Fragment>
      <div className="flex flex-wrap gap-4 mb-4 justify-center">
        {renderFilterList}
      </div>
      <ul className="space-y-2 max-h-[60vh] overflow-y-auto">{renderList}</ul>
    </Fragment>
  );
};

export default memo(ResourcesInMapList);
