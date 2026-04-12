import type React from "react";
import { useTranslation } from "react-i18next";

interface RequestActionModalProps {
  isOpen: boolean;
  message?: string;
  onAccept: () => void;
  onReject: () => void;
}

const RequestActionModal: React.FC<RequestActionModalProps> = ({
  isOpen,
  message,
  onAccept,
  onReject,
}) => {
  const { t } = useTranslation();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-xl max-w-md w-full mx-4">
        <div className="bg-gray-900 px-4 py-3 border-b border-gray-700">
          <h5 className="text-white font-medium">{t("common.request")}</h5>
        </div>
        <div className="p-4 text-gray-300">{message ?? ""}</div>
        <div className="p-4 bg-gray-900 border-t border-gray-700 flex flex-col space-y-2">
          <button
            type="button"
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={onAccept}
            data-testid="accept-request-button"
          >
            {t("common.accept")}
          </button>
          <button
            type="button"
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={onReject}
            data-testid="reject-request-button"
          >
            {t("common.reject")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestActionModal;
