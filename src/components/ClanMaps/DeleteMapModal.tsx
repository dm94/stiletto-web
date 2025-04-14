import type React from "react";
import { memo } from "react";
import { useTranslation } from "next-i18next";

interface DeleteMapModalProps {
  idMap: number;
  onDeleteMap: (mapid: number) => Promise<void>;
  onCancel: () => void;
}

const DeleteMapModal: React.FC<DeleteMapModalProps> = ({
  idMap,
  onDeleteMap,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-900 opacity-75" />
        </div>
        <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-300"
                  id="deletemapmodal"
                >
                  {t("common.areYouSure")}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-400">
                    {t("common.notReversible")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => onDeleteMap(idMap)}
            >
              {t("common.delete")}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => onCancel()}
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DeleteMapModal);
