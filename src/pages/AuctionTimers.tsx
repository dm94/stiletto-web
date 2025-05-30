import { useState, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import Timer from "@components/AuctionTimers/Timer";
import { getDomain } from "@functions/utils";
import HeaderMeta from "@components/HeaderMeta";
import { FaVolumeUp, FaVolumeMute, FaPlus, FaMinus } from "react-icons/fa";

const AuctionTimers = memo(() => {
  const { t } = useTranslation();
  const [timers, setTimers] = useState(1);
  const [playSound, setPlaySound] = useState(false);

  const playAlarm = useCallback(() => {
    const audio = new Audio("./cobra.mp3");
    audio.play();
  }, []);

  const renderTimers = useCallback(() => {
    const timerElements = [];
    for (let i = 0; i < timers; i++) {
      timerElements.push(
        <Timer key={i} onPlay={playAlarm} value={playSound} />,
      );
    }
    return <div className="w-full">{timerElements}</div>;
  }, [timers, playAlarm, playSound]);

  return (
    <div className="container mx-auto px-4 py-6">
      <HeaderMeta
        title={t(
          "seo.auctions.title",
          "Auction Timers - Stiletto for Last Oasis",
        )}
        description={t("seo.auctions.description", "Timers for what you need")}
        canonical={`${getDomain()}/auctions`}
        image="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/timers.jpg"
        keywords="Last Oasis, auction timers, timers, game, guide"
      />

      <div className="flex flex-wrap mb-6">
        <div className="w-full lg:w-2/3 px-2 mb-4 lg:mb-0">
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 text-center text-gray-300">
              {t("diplomacy.relationshipNotice")}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3 px-2">
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
            <div className="p-4 text-center">
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  type="button"
                  className={`px-4 py-2 ${
                    playSound
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  } rounded-l-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center`}
                  onClick={() => setPlaySound(true)}
                >
                  <FaVolumeUp className="mr-2 inline" /> {t("common.soundOn")}
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 ${
                    !playSound
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  } rounded-r-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center`}
                  onClick={() => setPlaySound(false)}
                >
                  <FaVolumeMute className="mr-2 inline" />{" "}
                  {t("common.soundOff")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderTimers()}

      <div className="w-full mt-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div className="p-4 text-center">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
                onClick={() => setTimers(timers + 1)}
              >
                <FaPlus className="mr-2 inline" />
                {t("timers.addTimer")}
              </button>
              <button
                type="button"
                className={`px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg font-medium ${
                  timers <= 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => setTimers(Math.max(1, timers - 1))}
                disabled={timers <= 1}
              >
                <FaMinus className="mr-2 inline" />
                {t("timers.removeTimer")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AuctionTimers;
