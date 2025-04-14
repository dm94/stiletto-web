import type React from "react";
import { useTranslation } from "next-i18next";
import { memo, useMemo } from "react";
import Icon from "../Icon";
import { getItemUrl } from "../../functions/utils";
import type { Item } from "../../types/item";

interface SchematicDropInfoProps {
  name: string;
  items: Item[];
}

interface Schematic extends Item {
  category: string;
  learn?: string[];
}

const SchematicDropInfo: React.FC<SchematicDropInfoProps> = ({
  name,
  items,
}) => {
  const { t } = useTranslation();

  const schematics = useMemo(() => {
    if (!name || !items) {
      return [];
    }
    return items.filter(
      (it) => it?.category === "Schematics" && it?.learn?.includes(name),
    ) as Schematic[];
  }, [name, items]);

  const schematicsList = useMemo(() => {
    return schematics.map((schematic) => {
      const url = getItemUrl(schematic.name);

      return (
        <li
          className="inline-block mr-2 mb-2"
          key={`schematic-${schematic.name}`}
        >
          <div className="p-2 bg-gray-800 border border-gray-700 rounded-lg flex items-center space-x-2">
            <Icon key={schematic.name} name={schematic.name} />
            <a href={url} className="text-blue-400 hover:text-blue-300">
              {t(schematic.name, { ns: "items" })}
            </a>
          </div>
        </li>
      );
    });
  }, [schematics, t]);

  if (schematics.length > 0) {
    return (
      <div className="w-full md:w-1/2 px-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
            {t("wiki.learnedIn")}
          </div>
          <div className="p-4">
            <ul className="flex flex-wrap -m-2">{schematicsList}</ul>
          </div>
        </div>
      </div>
    );
  }

  return false;
};

export default memo(SchematicDropInfo);
