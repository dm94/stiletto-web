import React, { Component } from "react";
import { BrowserRouter as Router, Redirect } from "react-router-dom";

class ModalMessage extends Component {
  state = { redirect: false };

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.props.message.redirectPage} />;
    }
    return (
      <div className="modal d-block">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modal">
                {this.props.message.isError ? "Error" : "Information"}
              </h5>
            </div>
            <div className="modal-body">{this.props.message.text}</div>
            <div className="modal-footer">
              <button
                className="btn btn-lg btn-outline-warning btn-block"
                onClick={(e) => this.setState({ redirect: true })}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalMessage;
