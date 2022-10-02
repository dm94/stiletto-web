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
            <div className="col-12 col-md-6">
              <div className="col-12">
                <div className="card mb-3">
                  <div className="card-body">
                    <a
                      className="btn btn-success btn-block"
                      href="https://www.paypal.me/dm94dani/5"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("Help keep the website running")}
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="card mb-3">
                  <div className="card-body">
                    <a
                      className="btn btn-danger btn-block"
                      href="https://crowdin.com/project/stiletto"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("Help to translate the website")}
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-12">
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
            </div>
            <div className="col-12 col-md-6">{this.showDiscord(t)}</div>
          </div>
        </div>
        <div className="col-12">
          <div className="row">
            <div className="col-12">
              <h3 className="text-center text-info">
                {t("Sponsored servers")}
              </h3>
            </div>
            <div className="col-12 col-md-4 p-3 mx-auto">
              <a
                href="https://discord.gg/FcecRtZ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="img-fluid"
                  src="/img/banner-lastoasis.jpg"
                  alt="Last Oasis Banner"
                  height="100"
                  width="600"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  showDiscord(t) {
    if (localStorage.getItem("acceptscookies")) {
      return (
        <iframe
          title="discord"
          src="https://discord.com/widget?id=317737508064591874&theme=dark"
          className="w-100"
          height="500"
          frameBorder="0"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        ></iframe>
      );
    } else {
      return (
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
      );
    }
  }
}

export default withTranslation()(Others);
