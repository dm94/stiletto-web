"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getExternalWikiDescription } from "@/lib/services/external";

interface WikiDescriptionProps {
  name: string;
}

export const WikiDescription = ({ name }: WikiDescriptionProps) => {
  const [description, setDescription] = useState<string>();
  const t = useTranslations();

  useEffect(() => {
    const updateDescription = async () => {
      const detail = await getExternalWikiDescription(name);
      if (detail) {
        setDescription(detail);
      }
    };

    updateDescription();
  }, [name]);

  if (!description) {
    return null;
  }

  return (
    <div className="col-span-12">
      <div className="card border-secondary mb-3">
        <div className="card-header">{t("Description by Wiki")}</div>
        <div className="card-body">
          <pre className="whitespace-pre-wrap">{description}</pre>
        </div>
        <div className="card-footer">
          <a
            type="button"
            className="btn btn-lg btn-info w-full"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://lastoasis.fandom.com/wiki/Special:Search?query=${name}&scope=internal&navigationSearch=true`}
          >
            {t("Wiki")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default WikiDescription;
