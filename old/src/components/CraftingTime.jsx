import React from "react";

const CraftingTime = ({ total = 1, time }) => {
  const convertSecondsToTime = (seconds) => {
    const totalSeconds = Number(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = Math.floor((totalSeconds % 3600) % 60);

    const hoursDisplay = hours > 0 ? `${hours} h ` : "";
    const minutesDisplay = minutes > 0 ? `${minutes} m ` : "";
    const secondsDisplay = remainingSeconds > 0 ? `${remainingSeconds} s` : "";

    return hoursDisplay + minutesDisplay + secondsDisplay;
  };

  const calculateTotalTime = () => {
    if (!time) {
      return 0;
    }
    return time * total;
  };

  const totalTime = calculateTotalTime();

  if (totalTime > 0) {
    return (
      <div className="text-right mb-0 text-muted">
        <i className="fa fa-clock" /> {convertSecondsToTime(totalTime)}
      </div>
    );
  }

  return "";
};

export default CraftingTime;
