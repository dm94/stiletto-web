import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Timer = ({ value, onPlay }) => {
  const { t } = useTranslation();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const [isFinish, setIsFinish] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isOn) {
        if (hours <= 0 && minutes <= 0 && seconds <= 0) {
          setIsFinish(true);
          setIsOn(false);
          if (value) {
            onPlay();
          }
        } else if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (seconds <= 0) {
          if (minutes > 0) {
            setMinutes(minutes - 1);
            setSeconds(59);
          } else if (minutes <= 0 && hours > 0) {
            setHours(hours - 1);
            setMinutes(59);
            setSeconds(59);
          }
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [hours, minutes, seconds, isOn, value, onPlay]);

  return (
    <div
      className={`bg-gray-800 border ${isFinish ? "border-yellow-500" : "border-gray-600"} rounded-lg shadow-md m-2 overflow-hidden`}
    >
      <div className={`p-4 ${isFinish ? "bg-yellow-500 bg-opacity-20" : ""}`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-1">
            <label
              htmlFor="hours"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              {t("common.hours")}
            </label>
            <input
              type="number"
              id="hours"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              max="24"
              min="0"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-right text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
            />
          </div>
          <div className="md:col-span-1">
            <label
              htmlFor="minutes"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              {t("common.minutes")}
            </label>
            <input
              type="number"
              id="minutes"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              max="59"
              min="0"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-right text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
            />
          </div>
          <div className="md:col-span-1">
            <label
              htmlFor="seconds"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              {t("common.seconds")}
            </label>
            <input
              type="number"
              id="seconds"
              value={seconds}
              onChange={(e) => setSeconds(Number(e.target.value))}
              max="59"
              min="0"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-right text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
            />
          </div>
          <div className="md:col-span-5">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              {t("common.description")}
            </label>
            <input
              type="text"
              id="description"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("common.description")}
            />
          </div>
          <div className="md:col-span-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center"
              onClick={() => {
                setIsOn(true);
                setIsFinish(false);
              }}
            >
              <i className="fas fa-play mr-2" /> {t("common.start")}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center"
              onClick={() => setIsOn(false)}
            >
              <i className="fas fa-stop mr-2" /> {t("common.stop")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
