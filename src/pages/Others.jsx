import React, { Component } from "react";
const axios = require("axios");

class Others extends Component {
  state = { items: null };

  componentDidMount() {
    axios
      .get("https://steamcommunity.com/games/903950/rss/")
      .then((response) => {
        this.setState({ items: response.data });
      });
  }

  showUpdates() {
    if (this.state.items != null) {
      return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel est mi. Nunc accumsan felis eu metus sollicitudin, quis malesuada tortor tempus. Integer suscipit nibh ac tincidunt luctus. Fusce ac diam ut ligula posuere gravida. Nam ultrices maximus velit auctor lacinia. Proin et lacus justo. Sed ullamcorper suscipit cursus. Nam hendrerit mi in neque maximus, ut rhoncus quam facilisis. Cras id nibh diam. In dignissim eget dui congue interdum. Nunc mi est, vulputate in iaculis et, molestie in nisl.";
    } else {
      return "Data could not be loaded";
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-header">Latest updates</div>
            <div className="card-body">{this.showUpdates()}</div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-6">
              <div className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                <div className="p-4 d-flex flex-column position-static">
                  <h3 className="mb-0 pb-2">Report Bugs</h3>
                  <p className="card-text mb-auto">
                    I'd appreciate it if you find a bug and tell me about it on
                    Github or another platform so that I can fix it
                  </p>
                  <a
                    className="btn btn-success m-2"
                    href="https://github.com/dm94/stiletto-web/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Report
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                <div className="p-4 d-flex flex-column">
                  <h3 className="mb-0 pb-2">Discord Bot</h3>
                  <p className="card-text mb-auto">
                    I have also created a discord bot useful to control the
                    walkers and make a list of what is needed to create objects.
                  </p>
                  <a
                    className="btn btn-success m-2"
                    href="https://top.gg/bot/715948052979908911"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Go to Discord bot
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-3">
                <div className="card-body">
                  <a
                    className="btn btn-success btn-block"
                    href="https://discord.gg/PdXxUWd"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Dm94´s Discord
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-3">
                <div className="card-body">
                  <a
                    className="btn btn-primary btn-block"
                    href="https://store.steampowered.com/app/903950/Last_Oasis/?curator_clanid=9919055"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Steam Page
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-3">
                <div className="card-body">
                  <a
                    className="btn btn-primary btn-block"
                    href="https://discord.gg/lastoasis"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Official Discord
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-3">
                <div className="card-body">
                  <a
                    className="btn btn-primary btn-block"
                    href="https://lastoasis.gamepedia.com/Last_Oasis_Wiki"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Wiki
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Others;
