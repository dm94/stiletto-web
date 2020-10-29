import { timers } from "jquery";
import React, { Component } from "react";
import Timer from "../components/Timer";

class AuctionTimers extends Component {
  state = {
    timers: 1,
  };

  showTimers() {
    var timers = [];
    for (var i = 0; i < this.state.timers; i++) {
      timers.push(<Timer key={i} />);
    }
    return <div className="col-12">{timers}</div>;
  }

  render() {
    return (
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header text-center">
              This data is not saved, if you reload the page it will be deleted
            </div>
          </div>
        </div>
        {this.showTimers()}
        <div className="col-12">
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
                  {" "}
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
