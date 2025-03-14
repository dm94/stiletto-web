import React from 'react';
import { useTranslation } from 'react-i18next';

const Station = ({ name }) => {
  const { t } = useTranslation();

  if (!name) {
    return null;
  }

  return (
    <div className="w-full md:w-1/2 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">{t("Station")}</div>
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <div className="text-gray-300">{name}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Station; 