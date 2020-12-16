import React, { Component } from "react";
import ClanName from "./ClanName";

class ClanSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHover: false,
    };
  }
  render() {
    return (
      <div
        className="row"
        onMouseOver={() => this.setState({ isHover: true })}
        onMouseLeave={() => this.setState({ isHover: false })}
      >
        <div className="col-10">
          <ClanName clan={this.props.clan} />
        </div>
        <div
          className={
            this.props.leader && this.state.isHover ? "col-2" : "col-2 d-none"
          }
        >
          <button
            className="btn btn-danger btn-sm"
            onClick={() => this.props.onDelete(this.props.clan.id)}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    );
  }
}

export default ClanSelect;
