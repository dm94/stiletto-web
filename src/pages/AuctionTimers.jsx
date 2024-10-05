import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Timer from "../components/AuctionTimers/Timer";
import { getDomain } from "../functions/utils";

class AuctionTimers extends Component {
  state = {
    timers: 1,
    playSound: false,
  };

  showTimers() {
    const timers = [];
    for (let i = 0; i < this.state.timers; i++) {
      timers.push(
        <Timer key={i} onPlay={this.playAlarm} value={this.state.playSound} />
      );
    }
    return <div className="col-12">{timers}</div>;
  }

  playAlarm() {
    const audio = new Audio("./cobra.mp3");
    audio.play();
  }

  render() {
    const { t } = this.props;

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
                  className={
                    this.state.playSound
                      ? "btn btn-secondary active"
                      : "btn btn-secondary"
                  }
                  onClick={() => {
                    this.setState({ playSound: true });
                  }}
                >
                  <i className="fas fa-volume-up" /> {t("Sound On")}
                </button>
                <button
                  type="button"
                  className={
                    this.state.playSound
                      ? "btn btn-secondary"
                      : "btn btn-secondary active"
                  }
                  onClick={() => {
                    this.setState({ playSound: false });
                  }}
                >
                  <i className="fas fa-volume-mute" /> {t("Sound Off")}
                </button>
              </div>
            </div>
          </div>
        </div>
        {this.showTimers()}
        <div className="col-md-12">
          <div className="card">
            <div className="card-body text-center">
              <div className="row">
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={() =>
                      this.setState((state) => ({ timers: state.timers + 1 }))
                    }
                  >
                    +
                  </button>
                </div>
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-danger btn-block"
                    onClick={() =>
                      this.setState((state) => ({ timers: state.timers - 1 }))
                    }
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
  }
}

export default withTranslation()(AuctionTimers);
