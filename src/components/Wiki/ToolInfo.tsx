"use client";

import { useTranslations } from "next-intl";

interface Tool {
  toolType: string;
  tier: number;
}

interface ToolInfoProps {
  toolInfo: Tool[];
}

export const ToolInfo = ({ toolInfo }: ToolInfoProps) => {
  const t = useTranslations();

  if (!toolInfo?.length) {
    return null;
  }

  return (
    <div className="col-span-12 md:col-span-6 xl:col-span-3">
      <div className="card border-secondary mb-3">
        <div className="card-header">{t("Tool info")}</div>
        <div className="card-body">
          <ul className="list-group">
            {toolInfo.map((tool) => (
              <li
                key={tool.toolType + tool.tier}
                className="list-group-item flex justify-between items-center"
              >
                <div className="my-0">{t(tool.toolType)}</div>
                <div className="text-muted">{tool.tier}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ToolInfo;
