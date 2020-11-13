import React, { Component } from "react";
import Timer from "../components/Timer";

class AuctionTimers extends Component {
  state = {
    timers: 1,
    playSound: false,
  };

  showTimers() {
    var timers = [];
    for (var i = 0; i < this.state.timers; i++) {
      timers.push(
        <Timer key={i} onPlay={this.playAlarm} value={this.state.playSound} />
      );
    }
    return <div className="col-12">{timers}</div>;
  }

  playAlarm() {
    var audio = new Audio(
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/alarm.mp3"
    );
    audio.play();
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header text-center">
              This data is not saved, if you reload the page it will be deleted
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="btn-group">
                <button
                  className={
                    this.state.playSound
                      ? "btn btn-secondary active"
                      : "btn btn-secondary"
                  }
                  onClick={() => {
                    this.setState({ playSound: true });
                  }}
                >
                  Sound On
                </button>
                <button
                  className={
                    this.state.playSound
                      ? "btn btn-secondary"
                      : "btn btn-secondary active"
                  }
                  onClick={() => {
                    this.setState({ playSound: false });
                  }}
                >
                  Sound Off
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
                    className="btn btn-primary btn-block"
                    onClick={() =>
                      this.setState({ timers: this.state.timers + 1 })
                    }
                  >
                    +
                  </button>
                </div>
                <div className="col">
                  <button
                    className="btn btn-warning btn-block"
                    onClick={() =>
                      this.setState({ timers: this.state.timers - 1 })
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

export default AuctionTimers;
