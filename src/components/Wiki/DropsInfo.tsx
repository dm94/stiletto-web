"use client";

import { useTranslations } from "next-intl";

interface Drop {
  location: string;
  chance?: number;
  minQuantity?: number;
  maxQuantity?: number;
}

interface DropsInfoProps {
  drops?: Drop[];
}

export const DropsInfo = ({ drops = [] }: DropsInfoProps) => {
  const t = useTranslations();

  if (!drops?.length) {
    return null;
  }

  return (
    <div className="col-span-12 md:col-span-6">
      <div className="card border-secondary mb-3">
        <div className="card-header">{t("Obtainable from")}</div>
        <div className="card-body">
          <ul className="list-inline">
            {drops.map((drop, index) => {
              const titleInfo = `Drop ${drop?.chance ?? "unknown"}% -> ${
                drop?.minQuantity ?? "unknown"
              }/${drop?.maxQuantity ?? "unknown"}`;
              return (
                <li
                  className="list-inline-item"
                  key={`${drop.location}-${index}`}
                  title={titleInfo}
                >
                  <p className="list-group-item">{t(drop.location)}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DropsInfo;
