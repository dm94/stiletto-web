"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { getItemUrl } from "@/lib/utils";
import { Item } from "@/types/items";

interface SchematicDropInfoProps {
  name: string;
  items: Item[];
}

interface Schematic extends Item {
  learn?: string[];
}

export const SchematicDropInfo = ({ name, items }: SchematicDropInfoProps) => {
  const t = useTranslations();

  if (!name || !items) {
    return null;
  }

  const schematics = items.filter(
    (it): it is Schematic =>
      it?.category === "Schematics" && it?.learn?.includes(name)
  );

  if (schematics.length === 0) {
    return null;
  }

  return (
    <div className="col-span-12 md:col-span-6">
      <div className="card border-secondary mb-3">
        <div className="card-header">{t("Learned in")}</div>
        <div className="card-body">
          <ul className="list-inline">
            {schematics.map((schematic) => {
              const url = getItemUrl(schematic.name);
              return (
                <li
                  className="list-inline-item"
                  key={`schematic-${schematic.name}`}
                >
                  <div className="list-group-item">
                    <Icon name={schematic.name} />
                    <Link href={url}>{t(schematic.name, { ns: "items" })}</Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SchematicDropInfo;
