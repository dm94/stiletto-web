import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { reportIncident } from "@functions/requests/reports";
import type { ReportIncidentRequest } from "@ctypes/dto/reports";

export interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("reports.messageRequired");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const requestParams: ReportIncidentRequest = {
        message: message.trim(),
        url: window.location.href,
      };

      await reportIncident(requestParams);
      setSuccess(true);
      setMessage("");

      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch {
      setError("report.error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setMessage("");
      setError("");
      setSuccess(false);
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      data-testid="report-incident-modal"
    >
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-4 border-b border-gray-700">
          <h5 className="text-xl font-semibold text-white">
            {t("report.incidentTitle")}
          </h5>
        </div>

        {success ? (
          <div className="p-4">
            <div className="text-green-400 text-center">
              {t("report.success")}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-4">
              <div className="mb-4">
                <label
                  htmlFor="incident-message"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {t("report.message")}
                </label>
                <textarea
                  id="incident-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder={t("report.messagePlaceholder")}
                  rows={4}
                  maxLength={500}
                  disabled={isSubmitting}
                />
                <div className="text-xs text-gray-400 mt-1">
                  {message.length}/500
                </div>
              </div>

              {error && (
                <div className="mb-4 text-red-400 text-sm">{t(error)}</div>
              )}
            </div>

            <div className="p-4 border-t border-gray-700 flex gap-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="flex-1 px-4 py-2 text-sm font-medium text-yellow-500 border border-yellow-500 rounded-md hover:bg-yellow-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t("report.submitting") : t("report.submit")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportIncidentModal;
