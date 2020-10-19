import React, { Component } from "react";

class ClanMapItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHover: false,
    };
  }

  showButton() {
    if (this.state.isHover) {
      return (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
          className="btn-group-vertical"
        >
          <button
            className="btn btn-primary btn-sm"
            variant="primary"
            onClick={() => this.props.onOpen(this.props.map)}
          >
            Show map
          </button>
          <button
            className="btn btn-danger btn-sm"
            variant="primary"
            onClick={() => this.props.onDelete(this.props.map.mapid)}
          >
            Delete map
          </button>
        </div>
      );
    }
  }

  render() {
    return (
      <div
        className="m-2 col-sm-2 col-xl-2 text-center"
        key={"clanmap" + this.props.map.mapid}
        onMouseOver={() => this.setState({ isHover: true })}
        onMouseLeave={() => this.setState({ isHover: false })}
      >
        <img
          src={this.props.value}
          className="img-fluid"
          alt={this.props.map.name}
        />
        {this.showButton()}
        <h6>
          {this.props.map.name}{" "}
          <small className="text-muted">{this.props.map.dateofburning}</small>
        </h6>
      </div>
    );
  }
}

export default ClanMapItem;
