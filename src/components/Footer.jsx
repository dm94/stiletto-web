import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer footer mt-auto">
      <div className="container-fluid py-3 bg-dark text-white">
        <div className="row">
          <div className="col-xl-10">
            By Dm94Dani{" | "}{" "}
            <Link className="text-white" to="/privacy">
              {t("Privacy Policy")}
            </Link>{" "}
            {" | "}
            <a
              title="GitHub package.json version"
              href="https://github.com/dm94/stiletto-web"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                width="104"
                height="20"
                alt="GitHub package.json version"
                src="https://img.shields.io/github/package-json/v/dm94/stiletto-web"
              />
            </a>
            {" | "}
            <a
              title="GitHub last commit"
              href="https://github.com/dm94/stiletto-web"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                height="20"
                alt="GitHub last commit"
                src="https://img.shields.io/github/last-commit/dm94/stiletto-web"
              />
            </a>
            {" | "}
            <a
              title="Crowdin"
              target="_blank"
              rel="noopener noreferrer"
              href="https://crowdin.com/project/stiletto"
            >
              <img
                width="94"
                height="20"
                alt="Crowdin translations"
                src="https://badges.crowdin.net/stiletto/localized.svg"
              />
            </a>
            {" | "}
            {t(
              "This website uses utilities related to the game 'Last Oasis' but is not affiliated with"
            )}{" "}
            <a
              href="https://www.donkey.team/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Donkey Crew
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
