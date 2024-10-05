import React, { Component } from "react";
import ClanName from "../ClanName";

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
        <div
          className={
            this.props?.leader && this.state.isHover ? "d-none" : "col-12"
          }
        >
          <ClanName clan={this.props?.clan} />
        </div>
        <div
          className={
            this.props?.leader && this.state.isHover ? "col-10" : "d-none"
          }
        >
          <ClanName clan={this.props?.clan} />
        </div>
        <div
          className={
            this.props?.leader && this.state.isHover ? "col-2" : "d-none"
          }
        >
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => this.props?.onDelete(this.props?.clan.id)}
          >
            <i className="fas fa-trash" />
          </button>
        </div>
      </div>
    );
  }
}

export default ClanSelect;
