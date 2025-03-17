import React from "react";
import { useTranslation } from "react-i18next";

const DropsInfo = ({ drops = [] }) => {
  const { t } = useTranslation();

  const showDrops = () => {
    return drops?.map((drop, index) => {
      const titleInfo = `Drop ${drop?.chance ?? "unknown"}% -> ${drop?.minQuantity ?? "unknown"
        }/${drop?.maxQuantity ?? "unknown"}`;
      return (
        <li
          className="inline-block mr-2 mb-2"
          key={`${drop.location}-${index}`}
          title={titleInfo}
        >
          <div className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-neutral-300">
            {t(drop.location)}
          </div>
        </li>
      );
    });
  };

  if (drops && drops.length > 0) {
    return (
      <div className="w-full md:w-1/2 px-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
            {t("wiki.obtainableFrom")}
          </div>
          <div className="p-4">
            <ul className="flex flex-wrap -m-2">{showDrops()}</ul>
          </div>
        </div>
      </div>
    );
  }

  return false;
};

export default DropsInfo;
