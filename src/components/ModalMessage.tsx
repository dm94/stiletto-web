import React, { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { AnalyticsEvent, sendEvent } from "@functions/page-tracking";

export interface MessageProps {
  isError?: boolean;
  text: string;
  redirectPage?: string;
}

export interface ModalMessageProps {
  message: MessageProps;
  onClickOk?: () => void;
}

// Original ActionButton removed, as a forwardRef version exists at the bottom.

const ModalMessage: React.FC<ModalMessageProps> = ({ message, onClickOk }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const titleId = "modal-message-title";
  const descriptionId = "modal-message-description";
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null); // Ref for the button

  const navigateTo = useCallback((): void => { // Moved navigateTo before useEffect
    navigate(message?.redirectPage ?? "");
  }, [navigate, message?.redirectPage]);

  useEffect(() => {
    sendEvent(AnalyticsEvent.MODAL, {
      props: {
        action: message?.isError ? "error" : "information",
        label: message?.text,
      },
    });

    // Focus the button when the modal opens
    buttonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (message?.redirectPage) {
          navigateTo();
        } else {
          onClickOk?.();
        }
        return;
      }

      if (event.key === "Tab") {
        // Focus trapping
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) { return; } // Added block

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else if (document.activeElement === lastElement) { // Collapsed else if
          // Tab
            firstElement.focus();
            event.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [message, onClickOk, navigateTo]); // Added navigateTo back
  
  // Attach buttonRef to the ActionButton's underlying button
  // This requires ActionButton to forward the ref.
  // For simplicity, I'll assume ActionButton is modified or we target its button directly if possible.
  // If ActionButton cannot be modified, we focus modalRef.current as a fallback.
  // Let's modify ActionButton to accept a ref.

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      data-testid="modal-message-container"
    >
      <div
        ref={modalRef} // Ref for the modal content area
        className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1} // Make the modal container focusable for initial focus if button fails
      >
        <div className="p-4 border-b border-gray-700">
          <h5 className="text-xl font-semibold text-white" id={titleId}>
            {message?.isError ? t("common.error") : t("common.information")}
          </h5>
        </div>
        <div className="p-4 text-gray-300" id={descriptionId}>{t(message?.text)}</div>
        <div className="p-4 border-t border-gray-700">
          {message?.redirectPage ? (
            // Assuming ActionButton is modified to forward refs to the button
            <ActionButton ref={buttonRef} onClick={() => navigateTo()} />
          ) : (
            <ActionButton ref={buttonRef} onClick={() => onClickOk?.()} />
          )}
        </div>
      </div>
    </div>
  );
};

// Modify ActionButton to forward refs
const ActionButton = React.forwardRef<
  HTMLButtonElement,
  { onClick: () => void }
>(({ onClick }, ref) => (
  <button
    ref={ref}
    type="button"
    className="w-full px-4 py-2 text-sm font-medium text-yellow-500 border border-yellow-500 rounded-md hover:bg-yellow-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
    onClick={onClick}
  >
    OK
  </button>
));
ActionButton.displayName = "ActionButton"; // For better debugging

export default ModalMessage;
