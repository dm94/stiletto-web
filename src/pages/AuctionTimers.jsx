import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Timer from "../components/AuctionTimers/Timer";
import { getDomain } from "../functions/utils";

const AuctionTimers = () => {
  const { t } = useTranslation();
  const [timers, setTimers] = useState(1);
  const [playSound, setPlaySound] = useState(false);

  const playAlarm = () => {
    const audio = new Audio("./cobra.mp3");
    audio.play();
  };

  const renderTimers = () => {
    const timerElements = [];
    for (let i = 0; i < timers; i++) {
      timerElements.push(
        <Timer key={i} onPlay={playAlarm} value={playSound} />
      );
    }
    return <div className="col-12">{timerElements}</div>;
  };

  return (
    <div className="row">
      <Helmet>
        <title>Auction Timers - Stiletto for Last Oasis</title>
        <meta name="description" content="Timers for what you need" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Auction Timers - Stiletto for Last Oasis"
        />
        <meta name="twitter:description" content="Timers for what you need" />
        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/timers.jpg"
        />
        <link rel="canonical" href={`${getDomain()}/auctions`} />
      </Helmet>
      <div className="col-md-8">
        <div className="card">
          <div className="card-header text-center">
            {t(
              "This data is not saved, if you reload the page it will be deleted"
            )}
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-body text-center">
            <div className="btn-group">
              <button
                type="button"
                className={`btn btn-secondary ${playSound ? "active" : ""}`}
                onClick={() => setPlaySound(true)}
              >
                <i className="fas fa-volume-up" /> {t("Sound On")}
              </button>
              <button
                type="button"
                className={`btn btn-secondary ${!playSound ? "active" : ""}`}
                onClick={() => setPlaySound(false)}
              >
                <i className="fas fa-volume-mute" /> {t("Sound Off")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {renderTimers()}
      <div className="col-md-12">
        <div className="card">
          <div className="card-body text-center">
            <div className="row">
              <div className="col">
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={() => setTimers(timers + 1)}
                >
                  +
                </button>
              </div>
              <div className="col">
                <button
                  type="button"
                  className="btn btn-danger btn-block"
                  onClick={() => setTimers(timers - 1)}
                >
                  -
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionTimers;
