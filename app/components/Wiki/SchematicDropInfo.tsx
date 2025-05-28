import type React from "react";
import { useTranslation } from "react-i18next";
import { memo, useMemo } from "react";
import Icon from "../Icon";
import { getItemUrl } from "@functions/utils";
import type { ItemCompleteInfo } from "@ctypes/item";

interface SchematicDropInfoProps {
  item: ItemCompleteInfo;
}

const SchematicDropInfo: React.FC<SchematicDropInfoProps> = ({ item }) => {
  const { t } = useTranslation();

  const itemList = useMemo(() => {
    return item.learn?.map((schematic) => {
      const url = getItemUrl(schematic);

      return (
        <li className="inline-block mr-2 mb-2" key={`schematic-${schematic}`}>
          <div className="p-2 bg-gray-800 border border-gray-700 rounded-lg flex items-center space-x-2">
            <Icon key={schematic} name={schematic} />
            <a href={url} className="text-blue-400 hover:text-blue-300">
              {t(schematic, { ns: "items" })}
            </a>
          </div>
        </li>
      );
    });
  }, [item, t]);

  if (item?.learn && item?.learn?.length > 0) {
    return (
      <div className="w-full md:w-1/2 px-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
            {t("wiki.usedFor")}
          </div>
          <div className="p-4">
            <ul className="flex flex-wrap -m-2">{itemList}</ul>
          </div>
        </div>
      </div>
    );
  }

  return false;
};

export default memo(SchematicDropInfo);
