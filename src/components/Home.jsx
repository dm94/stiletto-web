import React, { Component } from "react";
import { BrowserRouter as Router, Redirect } from "react-router-dom";

class Home extends Component {
  state = { redirectTo: null };
  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    return (
      <div className="row">
        <div
          className="col-md-6"
          onClick={() => this.setState({ redirectTo: "/crafter" })}
        >
          <div className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
            <div className="col-6 p-4 d-flex flex-column position-static">
              <h3 className="mb-0">Crafter</h3>
              <p className="card-text mb-auto">
                Here you can see the materials needed to build each thing you
                need and with the amount you need as if it were a shopping list.
                It is in English and Spanish
              </p>
            </div>
            <div className="col-6">
              <img
                alt="Crafter page"
                className="img-fluid"
                src="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/crafter.jpg"
              />
            </div>
          </div>
        </div>
        <div
          className="col-md-6"
          onClick={() => this.setState({ redirectTo: "/maps" })}
        >
          <div className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
            <div className="col-6 p-4 d-flex flex-column position-static">
              <h3 className="mb-0">Resources Map</h3>
              <div class="mb-1 text-muted">In beta stage</div>
              <p className="card-text mb-auto">
                Create and edit maps to add resources or strategic points. You
                need to be logged in and in a clan to use it
              </p>
            </div>
            <div className="col-6">
              <img
                alt="Resources map page"
                className="img-fluid"
                src="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/maps.jpg"
              />
            </div>
          </div>
        </div>
        <div
          className="col-md-6"
          onClick={() => this.setState({ redirectTo: "/walkerlist" })}
        >
          <div className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
            <div className="col-6 p-4 d-flex flex-column position-static">
              <h3 className="mb-0">Walker List</h3>
              <p className="card-text mb-auto">
                Check when your walkers were last used and who used them in a
                simple and quick way. I have created a discord bot that apart
                from giving other functions allows you to control the walkers
                log in an easier way
              </p>
            </div>
            <div className="col-6">
              <img
                alt="Resources map page"
                className="img-fluid"
                src="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/walkersList.png"
              />
            </div>
          </div>
        </div>
        <div
          className="col-md-3"
          onClick={() => this.setState({ redirectTo: "/profile" })}
        >
          <div className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
            <div className="col-12 p-4 d-flex flex-column position-static">
              <h3 className="mb-0">Control the clan</h3>
              <p className="card-text mb-auto">
                Use this section to control your clan, make alliances or send
                wars and to easily show it to your clan members.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
            <div className="col-12 p-4 d-flex flex-column position-static">
              <h3 className="mb-0">Trading system</h3>
              <div class="mb-1 text-muted">
                This function is not yet available
              </div>
              <p className="card-text mb-auto">
                You can create offers or search for them easily from here, you
                don't need to be on 20 discord servers looking for who to
                exchange with
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
