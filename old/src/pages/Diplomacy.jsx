import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import ModalMessage from "../components/ModalMessage";
import LoadingScreen from "../components/LoadingScreen";
import ClanSelect from "../components/Diplomacy/ClanSelect";
import { getUserProfile, getHasPermissions } from "../functions/services";
import { getDomain } from "../functions/utils";
import { config } from "../config/config";
import {
  getRelationships,
  createRelationship,
  deleteRelationship,
} from "../functions/requests/clans/relationships";

const Diplomacy = () => {
  const { t } = useTranslation();
  const [clanId, setClanId] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");
  const [listOfRelations, setListOfRelations] = useState([]);
  const [typedInput, setTypedInput] = useState(0);
  const [clanFlagInput, setClanFlagInput] = useState("");
  const [clanFlagSymbolInput, setClanFlagSymbolInput] = useState("C1");
  const [nameOtherClanInput, setNameOtherClanInput] = useState("");
  const [isLeader, setIsLeader] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    const initializeComponent = async () => {
      const userProfile = await getUserProfile();
      if (!userProfile.success) {
        setError(userProfile.message);
        return;
      }

      const { clanid, discordid, leaderid } = userProfile.message;
      setClanId(clanid);
      setIsLeader(discordid === leaderid);

      if (!clanid) {
        return;
      }

      try {
        const response = await getRelationships(clanid);

        if (response.ok) {
          const data = await response.json();
          setListOfRelations(data);
          setIsLoaded(true);
        } else if (response.status === 405) {
          setError("Unauthorized");
        } else if (response.status === 503) {
          setError("Error connecting to database");
        }
      } catch {
        setError("Error when connecting to the API");
      }

      if (discordid === leaderid) {
        setHasPermissions(true);
      } else {
        const permissions = await getHasPermissions("diplomacy");
        setHasPermissions(permissions);
      }
    };

    initializeComponent();
  }, []);

  const handleCreateRelationship = async (event) => {
    event.preventDefault();
    try {
      const response = await createRelationship(clanId, {
        nameotherclan: nameOtherClanInput,
        clanflag: clanFlagInput,
        typed: typedInput,
        symbol: clanFlagSymbolInput,
      });

      if (response.status === 201) {
        window.location.reload();
      } else if (response.status === 405) {
        setError("Method Not Allowed");
      } else if (response.status === 503) {
        setError("Error connecting to database");
      }
    } catch {
      setError("Try again later");
    }
  };

  const handleDeleteDiplomacy = async (relationShipId) => {
    try {
      const response = await deleteRelationship(clanId, relationShipId);

      if (response.status === 204) {
        window.location.reload();
      } else if (response.status === 401) {
        setError("Unauthorized");
      } else if (response.status === 503) {
        setError("Error connecting to database");
      }
    } catch {
      setError("Try again later");
    }
  };

  const listOfAllies = () => {
    if (!listOfRelations.length) {
      return "";
    }

    const allies = listOfRelations.filter(
      (r) => r.typed === 1 || r.typed === 31
    );

    return allies.map((d) => (
      <div key={`ally${d.id}`} className="col-12">
        <ClanSelect
          clan={d}
          leader={isLeader || hasPermissions}
          onDelete={handleDeleteDiplomacy}
        />
      </div>
    ));
  };

  const listOfEnemies = () => {
    if (!listOfRelations.length) {
      return "";
    }

    const enemies = listOfRelations.filter(
      (r) => r.typed === 2 || r.typed === 32
    );

    return enemies.map((d) => (
      <div key={`enemy${d.id}`} className="col-12">
        <ClanSelect
          clan={d}
          leader={isLeader || hasPermissions}
          onDelete={handleDeleteDiplomacy}
        />
      </div>
    ));
  };

  const listOfNAP = () => {
    if (!listOfRelations.length) {
      return "";
    }

    const nap = listOfRelations.filter((r) => r.typed === 0 || r.typed === 30);

    return nap.map((d) => (
      <div key={`npa${d.id}`} className="col-12">
        <ClanSelect
          clan={d}
          leader={isLeader || hasPermissions}
          onDelete={handleDeleteDiplomacy}
        />
      </div>
    ));
  };

  const symbolsList = () => {
    const symbols = Array.from({ length: 30 }, (_, i) => `C${i + 1}`);
    return symbols.map((symbol) => (
      <button
        type="button"
        className="col-1"
        key={`symbol-${symbol}`}
        onClick={() => setClanFlagSymbolInput(symbol)}
      >
        <img
          src={`${config.REACT_APP_RESOURCES_URL}/symbols/${symbol}.png`}
          className={
            symbol === clanFlagSymbolInput
              ? "img-fluid img-thumbnail"
              : "img-fluid"
          }
          alt={symbol}
          id={`symbol-img-${symbol}`}
        />
        <p className="text-center">{symbol}</p>
      </button>
    ));
  };

  const createNewRelationship = () => {
    if (!isLeader && !hasPermissions) {
      return "";
    }

    return (
      <div className="col-md-12">
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <form onSubmit={handleCreateRelationship}>
              <div className="row">
                <div className="form-group col">
                  <label htmlFor="typedInput">{t("Type")}</label>
                  <select
                    id="typedInput"
                    className="custom-select"
                    value={typedInput}
                    onChange={(evt) => setTypedInput(evt.target.value)}
                  >
                    <option value="0">{t("NAP or Settler")}</option>
                    <option value="1">{t("Ally")}</option>
                    <option value="2">{t("War")}</option>
                  </select>
                </div>
                <div className="form-group col">
                  <label htmlFor="flag_color">{t("Flag Color")}</label>
                  <input
                    type="color"
                    className="form-control"
                    id="flag_color"
                    name="flag_color"
                    value={clanFlagInput}
                    onChange={(evt) => setClanFlagInput(evt.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="nameOtherClanInput">{t("Clan Name")}</label>
                <input
                  type="text"
                  className="form-control"
                  id="nameOtherClanInput"
                  name="nameOtherClanInput"
                  maxLength="20"
                  value={nameOtherClanInput}
                  onChange={(evt) => setNameOtherClanInput(evt.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="sigilClanFlagInput">{t("Symbol")}</label>
                <div className="col-12">
                  <div className="row">{symbolsList()}</div>
                </div>
              </div>
              <button
                className="btn btn-lg btn-outline-info btn-block"
                type="submit"
                value="Submit"
              >
                {t("Create a relationship")}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <ModalMessage
        message={{
          isError: true,
          text: error,
          redirectPage: "/profile",
        }}
      />
    );
  }

  if (!clanId) {
    return (
      <ModalMessage
        message={{
          isError: true,
          text: "You need to have a clan to access this section",
          redirectPage: "/profile",
        }}
      />
    );
  }

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <div className="container-fluid">
      <Helmet>
        <title>Clan Diplomacy - Stiletto for Last Oasis</title>
        <meta
          name="description"
          content="View your clan's list of allies, enemies and NAP"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Clan Diplomacy - Stiletto for Last Oasis"
        />
        <meta
          name="twitter:description"
          content="View your clan's list of allies, enemies and NAP"
        />
        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/diplomacy.jpg"
        />
        <link rel="canonical" href={`${getDomain()}/diplomacy`} />
      </Helmet>
      <div className="row">
        {createNewRelationship()}
        <div className="col-md-4">
          <div className="card mb-4 shadow-sm border-success">
            <div className="card-header bg-success text-white text-center">
              {t("Allies")}
            </div>
            <div className="card-body">
              <div className="row">{listOfAllies()}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4 shadow-sm border-warning">
            <div className="card-header bg-warning text-dark text-center">
              {t("NAP or Settlers")}
            </div>
            <div className="card-body">{listOfNAP()}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4 shadow-sm border-danger">
            <div className="card-header bg-danger text-white text-center">
              {t("War")}
            </div>
            <div className="card-body">{listOfEnemies()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diplomacy;
