"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Resource } from "@/types/maps";

interface ResourcesInMapListProps {
  resources: Resource[] | null;
  onSelect: (x: number, y: number) => void;
  onFilter: (resourceType: string) => void;
}

export default function ResourcesInMapList({
  resources,
  onSelect,
  onFilter,
}: ResourcesInMapListProps) {
  const t = useTranslations();
  const [selectedType, setSelectedType] = useState("All");

  if (!resources) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        {t("No resources found")}
      </div>
    );
  }

  const resourceTypes = [
    "All",
    ...new Set(resources.map((r) => r.resourcetype)),
  ];

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    onFilter(type);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 p-4">
        {resourceTypes.map((type) => (
          <button
            key={type}
            type="button"
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedType === type
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
            onClick={() => handleTypeChange(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => onSelect(resource.x, resource.y)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{resource.resourcetype}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("Quality")}: {resource.quality}
                </p>
                {resource.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {resource.description}
                  </p>
                )}
              </div>
              <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                <p>X: {resource.x}</p>
                <p>Y: {resource.y}</p>
                <p>
                  {new Date(resource.harvested).toLocaleString(undefined, {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
