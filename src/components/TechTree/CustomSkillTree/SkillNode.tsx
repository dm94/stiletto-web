import React from "react";
import { useTranslation } from "react-i18next";
import type { Item } from "../../../types/item";
import type { Tree } from "../../../types/dto/tech";
import Icon from "../../Icon";
import SkillNodeBtn from "../SkillNodeBtn";
import { getItemUrl } from "../../../functions/utils";

interface SkillNodeProps {
  item: Item;
  isSelected: boolean;
  onSelect: (id: string) => void;
  clan?: number;
  tree: Tree;
  disabled?: boolean;
}

const SkillNode: React.FC<SkillNodeProps> = ({
  item,
  isSelected,
  onSelect,
  clan,
  tree,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const handleClick = () => {
    if (!disabled) {
      onSelect(item.name);
    }
  };

  return (
    <div
      className={`relative p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
        isSelected
          ? "bg-purple-900/80 border-purple-500 shadow-lg shadow-purple-500/30"
          : "bg-gray-800/30 border-gray-600 hover:border-purple-400"
      }
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      <div className="text-center mb-2">
        <span className="text-lg font-medium">{t(item.name)}</span>
      </div>

      <div className="tooltip-container group relative">
        <div className="flex justify-center mb-2">
          <Icon key={item.name} name={item.name} width={35} />
        </div>

        <div className="tooltip absolute z-10 invisible group-hover:visible bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg w-64 -translate-x-1/2 left-1/2 mt-2">
          <div className="mx-auto">
            <div className="text-center mb-1">
              <a
                href={getItemUrl(item.name)}
                target="_blank"
                rel="noopener noreferrer"
                title={t("menu.wiki")}
                className="text-blue-400 hover:text-blue-300 flex flex-col items-center"
              >
                <Icon key={item.name} name={item.name} width={35} />
                {t("menu.wiki")}
              </a>
            </div>
            <p className="text-center border-b border-yellow-600 pb-1 mb-2">
              {t("crafting.whoHasLearnedIt")}
            </p>
            {clan ? (
              <SkillNodeBtn
                key={`btn-${item.name}`}
                item={item}
                clan={clan}
                tree={tree}
              />
            ) : (
              <p className="text-center text-gray-400">
                {t("techTree.needClanForFunction")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillNode;
