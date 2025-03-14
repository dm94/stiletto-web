"use client";

import { useTranslations } from "next-intl";

interface ModuleInfoProps {
  moduleInfo: {
    max?: number;
    increase?: number;
    maxIncrease?: number;
  };
}

export const ModuleInfo = ({ moduleInfo }: ModuleInfoProps) => {
  const t = useTranslations();

  if (!moduleInfo) {
    return null;
  }

  return (
    <div className="col-span-12 md:col-span-6">
      <div className="card border-secondary mb-3">
        <div className="card-header">{t("Module info")}</div>
        <div className="card-body">
          <ul className="list-group">
            {moduleInfo?.max && (
              <li className="list-group-item flex justify-between items-center">
                <div className="my-0">{t("Limit per walker")}</div>
                <div className="text-muted">{moduleInfo.max}</div>
              </li>
            )}
            {moduleInfo?.increase && (
              <li className="list-group-item flex justify-between items-center">
                <div className="my-0">{t("Improvement per module")}</div>
                <div className="text-muted">{moduleInfo.increase}</div>
              </li>
            )}
            {moduleInfo?.maxIncrease && (
              <li className="list-group-item flex justify-between items-center">
                <div className="my-0">{t("Maximum improvement")}</div>
                <div className="text-muted">{moduleInfo.maxIncrease}</div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModuleInfo;
