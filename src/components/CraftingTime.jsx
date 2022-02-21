import React, { Component } from "react";

class CraftingTime extends Component {
  render() {
    let totalTime = 0;
    let totalToCraft = this.props.total ? this.props.total : 1;
    let time = this.props.time;

    if (totalToCraft && time) {
      totalTime = time * totalToCraft;
    }

    if (totalTime > 0) {
      totalTime = this.secondsToHms(totalTime);
      return (
        <div className="text-right mb-0 text-muted">
          <i className="fa fa-clock"></i> {totalTime}
        </div>
      );
    } else {
      return "";
    }
  }

  secondsToHms(d) {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor((d % 3600) / 60);
    let s = Math.floor((d % 3600) % 60);

    let hDisplay = h > 0 ? h + " h " : "";
    let mDisplay = m > 0 ? m + " m " : "";
    let sDisplay = s > 0 ? s + " s" : "";
    return hDisplay + mDisplay + sDisplay;
  }
}

export default CraftingTime;
