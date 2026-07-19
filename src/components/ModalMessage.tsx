import type React from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { AnalyticsEvent, sendEvent } from "@functions/page-tracking";
import { useEffect, useRef } from "react";

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
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}> = ({ onClick, buttonRef }) => (
  <button
    ref={buttonRef}
    type="button"
    className="w-full px-4 py-2 text-sm font-medium text-yellow-500 border border-yellow-500 rounded-md hover:bg-yellow-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
    onClick={onClick}
  >
    OK
  </button>
);

const ModalMessage: React.FC<ModalMessageProps> = ({ message, onClickOk }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    sendEvent(AnalyticsEvent.MODAL, {
      props: {
        action: message?.isError ? "error" : "information",
        label: message?.text,
      },
    });
  }, [message?.isError, message?.text]);

  const navigateTo = (): void => {
    navigate(message?.redirectPage ?? "");
  };

  useEffect(() => {
    // Auto-focus the action button on mount for keyboard/screen reader convenience
    buttonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (message?.redirectPage) {
          navigate(message.redirectPage);
        } else {
          onClickOk?.();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [message?.redirectPage, onClickOk, navigate]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      data-testid="modal-message-container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-message-title"
    >
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-4 border-b border-gray-700">
          <h5
            className="text-xl font-semibold text-white"
            id="modal-message-title"
          >
            {message?.isError ? t("common.error") : t("common.information")}
          </h5>
        </div>
        <div className="p-4 text-gray-300">{t(message?.text)}</div>
        <div className="p-4 border-t border-gray-700">
          {message?.redirectPage ? (
            <ActionButton buttonRef={buttonRef} onClick={() => navigateTo()} />
          ) : (
            <ActionButton buttonRef={buttonRef} onClick={() => onClickOk?.()} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalMessage;
