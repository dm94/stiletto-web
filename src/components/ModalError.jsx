import React, { Component } from "react";
import { BrowserRouter as Router, Link, Redirect } from "react-router-dom";

class ModalError extends Component {
  state = { redirect: false };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <div className="modal d-block">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="errormodal">
                Error
              </h5>
            </div>
            <div className="modal-body">{this.props.value}</div>
            <div className="modal-footer">
              <button
                className="btn btn-lg btn-outline-danger btn-block"
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

export default ModalError;
