import React, { Component } from "react";
import { withTranslation } from "react-i18next";
class Others extends Component {
  render() {
    const { t } = this.props;
    return (
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="row">
            <div className="col-md-4">
              <div className="card mb-3">
                <div className="card-body">
                  <a
                    className="btn btn-primary btn-block"
                    href="https://store.steampowered.com/app/903950/Last_Oasis/?curator_clanid=9919055"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("Steam Page")}
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
                    {t("Official Discord")}
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
                    {t("Wiki")}
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-3">
                <div className="card-body">
                  <a
                    className="btn btn-success btn-block"
                    href="https://discord.gg/FcecRtZ"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("Dm94Dani´s Discord")}
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-3">
                <div className="card-body">
                  <a
                    className="btn btn-success btn-block"
                    href="https://www.paypal.me/dm94dani/5"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("Buy me a coffee")}
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-3">
                <div className="card-body">
                  <a
                    className="btn btn-info btn-block"
                    href="https://docs.google.com/spreadsheets/d/1VbJ3amYocF3QpAebqhZO6rK8dm5c3YGN2JqqoVpaMGY/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("Walkers Upgrades Cost")}
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <a
                    className="btn btn-danger m-2 btn-block"
                    href="https://crowdin.com/project/stiletto"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("Help to translate the website")}
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="border rounded overflow-hidden mb-4">
                <div className="p-4 d-flex flex-column">
                  <h3 className="mb-0 pb-2">{t("Discord Bot")}</h3>
                  <p className="card-text mb-auto">
                    {t(
                      "I have also created a discord bot useful to control the walkers and make a list of what is needed to create objects."
                    )}
                  </p>
                  <a
                    className="btn btn-success m-2"
                    href="https://top.gg/bot/715948052979908911"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("Go to Discord bot")}
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                <div className="p-4 d-flex flex-column position-static">
                  <h3 className="mb-0 pb-2">{t("Privacy Agreement")}</h3>
                  <p className="card-text mb-auto">
                    {t(
                      "Cookies - This site only uses Google cookies to view web traffic."
                    )}
                  </p>
                  <p className="card-text mb-auto">
                    {t(
                      "Private data - The only registration data saved is Discord ID and Discord Tag"
                    )}
                    .
                  </p>
                  <p className="card-text mb-auto">
                    {t(
                      "Data added to the website such as diplomacy, map resources or clan members are stored in a database and the necessary security measures are taken so that no one can access these data."
                    )}
                  </p>
                  <p className="card-text mb-auto">
                    {t(
                      "Source Code is published on GitHub for full disclosure where you can also report any issues found."
                    )}
                  </p>
                </div>
              </div>
            </div>
            {this.showGoogleForm()}
          </div>
        </div>
      </div>
    );
  }

  showGoogleForm() {
    if (localStorage.getItem("acceptscookies")) {
      return (
        <iframe
          className="col-12 mx-auto border-0"
          src="https://docs.google.com/forms/d/e/1FAIpQLSdlljZ_CUgUtSOn2TZCBHbuQhzxApbgBGngRusWWdirHKA1fw/viewform?embedded=true"
          style={{ width: 640, height: 538 }}
          title="https://forms.gle/AbCEMNNZFjcV163p7"
        ></iframe>
      );
    }
  }
}

export default withTranslation()(Others);
