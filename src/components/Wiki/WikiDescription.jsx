import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getExternalWikiDescription } from "../../functions/requests/other";

const WikiDescription = ({ name }) => {
  const [description, setDescription] = useState(undefined);
  const { t } = useTranslation();

  useEffect(() => {
    const updateDescription = async () => {
      const detail = await getExternalWikiDescription(name);
      if (detail) {
        setDescription(detail);
      }
    };

    updateDescription();
  }, [name]);

  if (description) {
    return (
      <div className="w-full p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
            {t("Description by Wiki")}
          </div>
          <div className="p-4">
            <pre className="text-gray-300 whitespace-pre-wrap">
              {description}
            </pre>
          </div>
          <div className="p-4 bg-gray-900 border-t border-gray-700">
            <a
              type="button"
              className="block w-full px-4 py-2 text-center text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
  }

  return false;
};

export default WikiDescription;
