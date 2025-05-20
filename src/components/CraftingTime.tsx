import type React from "react";
import { useTranslation } from "react-i18next";
import FaIcon from "@components/FaIcon";

interface CraftingTimeProps {
  total?: number;
  time?: number;
}

const CraftingTime: React.FC<CraftingTimeProps> = ({ total = 1, time }) => {
  const { t } = useTranslation();

  const convertSecondsToTime = (seconds: number): string => {
    const totalSeconds = Number(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = Math.floor((totalSeconds % 3600) % 60);

    const hoursDisplay = hours > 0 ? `${hours} h ` : "";
    const minutesDisplay = minutes > 0 ? `${minutes} m ` : "";
    const secondsDisplay = remainingSeconds > 0 ? `${remainingSeconds} s` : "";

    return hoursDisplay + minutesDisplay + secondsDisplay;
  };

  const calculateTotalTime = (): number => {
    if (!time) {
      return 0;
    }
    return time * total;
  };

  const totalTime = calculateTotalTime();

  if (totalTime > 0) {
    return (
      <div className="flex items-center justify-end space-x-2 text-gray-300">
        <span>{t("Crafting time")}:</span>
        <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-lg">
          <FaIcon icon="fa fa-clock" />
          <span className="font-medium">{convertSecondsToTime(totalTime)}</span>
        </div>
      </div>
    );
  }

  return null;
};

export default CraftingTime;
