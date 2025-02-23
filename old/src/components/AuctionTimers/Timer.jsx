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
    <div className="card border-secondary m-2">
      <div className={isFinish ? "card-body bg-warning " : "card-body"}>
        <div className="row">
          <div className="col-md-1">
            <label htmlFor="hours">{t("Hours")}</label>
            <h1>
              <input
                type="number"
                id="hours"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                max="24"
                min="0"
                className="text-right form-control"
              />
            </h1>
          </div>
          <div className="col-md-1">
            <label htmlFor="minutes">{t("Minutes")}</label>
            <h1>
              <input
                type="number"
                id="minutes"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                max="59"
                min="0"
                className="text-right form-control"
              />
            </h1>
          </div>
          <div className="col-md-1">
            <label htmlFor="seconds">{t("Seconds")}</label>
            <h1>
              <input
                type="number"
                id="seconds"
                value={seconds}
                onChange={(e) => setSeconds(Number(e.target.value))}
                max="59"
                min="0"
                className="text-right form-control"
              />
            </h1>
          </div>
          <div className="col-md-5">
            <label htmlFor="description">{t("Description")}</label>
            <input
              type="text"
              id="description"
              className="form-control"
              placeholder={t("Description")}
            />
          </div>
          <div className="col-md-4">
            <button
              type="button"
              className="btn btn-success btn-block"
              onClick={() => {
                setIsOn(true);
                setIsFinish(false);
              }}
            >
              <i className="fas fa-play" /> {t("Start")}
            </button>
            <button
              type="button"
              className="btn btn-danger btn-block"
              onClick={() => setIsOn(false)}
            >
              <i className="fas fa-stop" /> {t("Stop")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
