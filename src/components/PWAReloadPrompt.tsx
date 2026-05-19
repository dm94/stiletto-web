import type React from "react";
import { useTranslation } from "react-i18next";
import { useRegisterSW } from "virtual:pwa-register/react";
import { FaSyncAlt } from "react-icons/fa";

const PWAReloadPrompt: React.FC = () => {
  const { t } = useTranslation();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW registered:", r);
    },
    onRegisterError(error) {
      console.error("SW registration error:", error);
    },
  });

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleClose = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl transition-all scale-100 flex flex-col items-center text-center gap-4 relative overflow-hidden">
        {/* Animated Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 animate-pulse" />

        {/* Icon Circle */}
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2 animate-bounce">
          <FaSyncAlt className="w-6 h-6 animate-spin-slow" />
        </div>

        {/* Text Details */}
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {t("pwa.updateAvailable")}
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          {t("pwa.updateMessage")}
        </p>

        {/* Button Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
          <button
            type="button"
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 transform active:scale-95 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            onClick={handleUpdate}
          >
            {t("pwa.updateButton")}
          </button>
          <button
            type="button"
            className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl border border-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-900"
            onClick={handleClose}
          >
            {t("pwa.dismissButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAReloadPrompt;
