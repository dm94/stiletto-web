import React, { Component } from "react";

class Timer extends Component {
  constructor(props) {
    super(props);
    this.tick = this.tick.bind(this);
    this.state = {
      hours: 0,
      minutes: 10,
      seconds: 0,
      isOn: false,
      isFinish: false,
    };
  }

  componentDidMount() {
    this.timer = setInterval(this.tick, 1000);
  }

  tick() {
    if (this.state.isOn) {
      if (
        this.state.hours == 0 &&
        this.state.minutes == 0 &&
        this.state.seconds == 0
      ) {
        this.setState({ isFinish: true, isOn: false });
        if (this.props.value) {
          this.props.onPlay();
        }
      }
      if (this.state.seconds > 0) {
        this.setState({ seconds: this.state.seconds - 1 });
      } else if (this.state.seconds == 0) {
        if (this.state.minutes > 0) {
          this.setState({ minutes: this.state.minutes - 1, seconds: 59 });
        } else if (this.state.minutes == 0) {
          if (this.state.hours > 0) {
            this.setState({
              hours: this.state.hours - 1,
              minutes: 59,
              seconds: 60,
            });
          }
        }
      }
    }
  }

  render() {
    return (
      <div className="card">
        <div
          className={
            this.state.isFinish ? "card-body bg-warning " : "card-body"
          }
        >
          <div className="row">
            <div className="col-md-1">
              <label htmlFor="hours">Hours</label>
              <h1>
                <input
                  type="number"
                  id="hours"
                  value={this.state.hours}
                  onChange={(e) => this.setState({ hours: e.target.value })}
                  max="24"
                  min="0"
                  className="text-right form-control"
                />
              </h1>
            </div>
            <div className="col-md-1">
              <label htmlFor="minutes">Minutes</label>
              <h1>
                <input
                  type="number"
                  id="minutes"
                  value={this.state.minutes}
                  onChange={(e) => this.setState({ minutes: e.target.value })}
                  max="59"
                  min="0"
                  className="text-right form-control"
                />
              </h1>
            </div>
            <div className="col-md-1">
              <label htmlFor="seconds">Seconds</label>
              <h1>
                <input
                  type="number"
                  id="seconds"
                  value={this.state.seconds}
                  onChange={(e) => this.setState({ seconds: e.target.value })}
                  max="59"
                  min="0"
                  className="text-right form-control"
                />
              </h1>
            </div>
            <div className="col-md-5">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                className="form-control"
                placeholder="Description"
              />
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-success btn-block"
                onClick={() => this.setState({ isOn: true, isFinish: false })}
              >
                Start
              </button>
              <button
                className="btn btn-danger btn-block"
                onClick={() => this.setState({ isOn: false })}
              >
                Stop
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Timer;
