"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Marker } from "@/types/maps";

interface CreateResourceTabProps {
  items: Marker[] | null;
  onCreateResource: (
    resourceType: string,
    quality: number,
    description: string,
    lastHarvested: string
  ) => void;
  coordinateXInput: number;
  coordinateYInput: number;
  onChangeX: (x: number) => void;
  onChangeY: (y: number) => void;
}

export default function CreateResourceTab({
  items,
  onCreateResource,
  coordinateXInput,
  coordinateYInput,
  onChangeX,
  onChangeY,
}: CreateResourceTabProps) {
  const t = useTranslations();
  const [resourceType, setResourceType] = useState("");
  const [quality, setQuality] = useState(1);
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateResource(
      resourceType,
      quality,
      description,
      new Date().toISOString()
    );
    setResourceType("");
    setQuality(1);
    setDescription("");
  };

  if (!items) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        {t("Loading resource types...")}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label htmlFor="x" className="block text-sm font-medium mb-1">
          X
        </label>
        <input
          type="number"
          id="x"
          value={coordinateXInput}
          onChange={(e) => onChangeX(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>

      <div>
        <label htmlFor="y" className="block text-sm font-medium mb-1">
          Y
        </label>
        <input
          type="number"
          id="y"
          value={coordinateYInput}
          onChange={(e) => onChangeY(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>

      <div>
        <label
          htmlFor="resourceType"
          className="block text-sm font-medium mb-1"
        >
          {t("Resource Type")}
        </label>
        <select
          id="resourceType"
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          required
        >
          <option value="">{t("Select a resource type")}</option>
          {items.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="quality" className="block text-sm font-medium mb-1">
          {t("Quality")}
        </label>
        <input
          type="number"
          id="quality"
          min="1"
          max="100"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          {t("Description")}
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
      >
        {t("Create Resource")}
      </button>
    </form>
  );
}
