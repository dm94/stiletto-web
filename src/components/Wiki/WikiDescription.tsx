import type React from "react";
import { useState, useEffect, useMemo, memo } from "react";
import { useTranslation } from "react-i18next";
import { getExternalWikiDescription } from "@functions/requests/other";

interface WikiDescriptionProps {
  name: string;
}

const WikiDescription: React.FC<WikiDescriptionProps> = ({ name }) => {
  const [description, setDescription] = useState<string>();
  const { t } = useTranslation();

  useEffect(() => {
    const updateDescription = async () => {
      try {
        const detail = await getExternalWikiDescription(name);
        if (detail) {
          setDescription(detail);
        }
      } catch {
        console.error("Error fetching wiki description:");
      }
    };

    updateDescription();
  }, [name]);

  const wikiUrl = useMemo(() => {
    return `https://lastoasis.fandom.com/wiki/Special:Search?query=${encodeURIComponent(name)}&scope=internal&navigationSearch=true`;
  }, [name]);

  if (description) {
    return (
      <div className="w-full p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
            {t("wiki.descriptionByWiki")}
          </div>
          <div className="p-4">
            <pre className="text-gray-300 whitespace-pre-wrap">
              {description}
            </pre>
          </div>
          <div className="p-4 bg-gray-900 border-t border-gray-700">
            <a
              type="button"
              className="block w-full px-4 py-2 text-center text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              target="_blank"
              rel="noopener noreferrer"
              href={wikiUrl}
            >
              {t("menu.wiki")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return false;
};

export default memo(WikiDescription);
