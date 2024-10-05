import React, { Component } from "react";

class CraftingTime extends Component {
  render() {
    let totalTime = 0;
    const totalToCraft = this.props?.total ? this.props?.total : 1;
    const time = this.props?.time;

    if (totalToCraft && time) {
      totalTime = time * totalToCraft;
    }

    if (totalTime > 0) {
      totalTime = this.secondsToHms(totalTime);
      return (
        <div className="text-right mb-0 text-muted">
          <i className="fa fa-clock" /> {totalTime}
        </div>
      );
    }
    return "";
  }

  secondsToHms(d) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    const hDisplay = h > 0 ? `${h} h ` : "";
    const mDisplay = m > 0 ? `${m} m ` : "";
    const sDisplay = s > 0 ? `${s} s` : "";
    return hDisplay + mDisplay + sDisplay;
  }
}

export default CraftingTime;
