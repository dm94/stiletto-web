import type React from "react";
import { useState, useEffect } from "react";
import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";
import { sendEvent } from "../page-tracking";

export interface MessageProps {
  isError?: boolean;
  text: string;
  redirectPage?: string;
}

export interface ModalMessageProps {
  message: MessageProps;
  onClickOk?: () => void;
}

// Button component for both OK and Redirect buttons
const ActionButton: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => (
  <button
    type="button"
    className="w-full px-4 py-2 text-sm font-medium text-yellow-500 border border-yellow-500 rounded-md hover:bg-yellow-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
    onClick={onClick}
  >
    OK
  </button>
);

const ModalMessage: React.FC<ModalMessageProps> = ({ message, onClickOk }) => {
  const [redirect, setRedirect] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    sendEvent("modal", {
      props: {
        action: message?.isError ? "Error" : "Information",
        label: message?.text,
      },
    });
  }, [message?.isError, message?.text]);

  const handleRedirect = (): void => setRedirect(true);
  
  // Handle redirect if needed
  if (redirect) {
    return <Navigate to={message?.redirectPage ?? ""} replace />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-4 border-b border-gray-700">
          <h5 className="text-xl font-semibold text-white" id="modal">
            {message?.isError ? t("common.error") : t("common.information")}
          </h5>
        </div>
        <div className="p-4 text-gray-300">{t(message?.text)}</div>
        <div className="p-4 border-t border-gray-700">
          {message?.redirectPage ? (
            <ActionButton onClick={handleRedirect} />
          ) : (
            <ActionButton onClick={() => onClickOk?.()} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalMessage;
