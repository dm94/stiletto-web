import { useState, useEffect, type FormEvent } from "react";
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
import { type RelationshipInfo, TypeRelationship } from "../types/dto/relationship";

const Diplomacy = () => {
  const { t } = useTranslation();
  const [clanId, setClanId] = useState<number | false>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [listOfRelations, setListOfRelations] = useState<RelationshipInfo[]>([]);
  const [typedInput, setTypedInput] = useState<TypeRelationship>(TypeRelationship.NAP);
  const [clanFlagInput, setClanFlagInput] = useState<string>("");
  const [clanFlagSymbolInput, setClanFlagSymbolInput] = useState<string>("C1");
  const [nameOtherClanInput, setNameOtherClanInput] = useState<string>("");
  const [isLeader, setIsLeader] = useState<boolean>(false);
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);

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
          const data = await response.json() as RelationshipInfo[];
          setListOfRelations(data);
          setIsLoaded(true);
        } else if (response.status === 405) {
          setError("error.unauthorized");
        } else if (response.status === 503) {
          setError("error.databaseConnection");
        }
      } catch {
        setError("errors.apiConnection");
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

  const handleCreateRelationship = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (clanId === false) {
      return;
    }
    
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
        setError("error.methodNotAllowed");
      } else if (response.status === 503) {
        setError("error.databaseConnection");
      }
    } catch {
      setError("common.tryAgainLater");
    }
  };

  const handleDeleteDiplomacy = async (relationShipId: number) => {
    if (clanId === false) {
      return;
    }

    try {
      const response = await deleteRelationship(clanId, relationShipId);

      if (response.status === 204) {
        window.location.reload();
      } else if (response.status === 401) {
        setError("error.unauthorized");
      } else if (response.status === 503) {
        setError("error.databaseConnection");
      }
    } catch {
      setError("common.tryAgainLater");
    }
  };

  const listOfAllies = () => {
    if (!listOfRelations.length) {
      return "";
    }

    const allies = listOfRelations.filter(
      (r) => r.typed === 1 || r.typed === 31,
    );

    return allies.map((d) => (
      <div key={`ally${d.id}`} className="w-full">
        <ClanSelect
          clan={d}
          isLeader={isLeader || hasPermissions}
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
      (r) => r.typed === 2 || r.typed === 32,
    );

    return enemies.map((d) => (
      <div key={`enemy${d.id}`} className="w-full">
        <ClanSelect
          clan={d}
          isLeader={isLeader || hasPermissions}
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
      <div key={`npa${d.id}`} className="w-full">
        <ClanSelect
          clan={d}
          isLeader={isLeader || hasPermissions}
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
        className="w-1/12"
        key={`symbol-${symbol}`}
        onClick={() => setClanFlagSymbolInput(symbol)}
      >
        <img
          src={`${config.REACT_APP_RESOURCES_URL}/symbols/${symbol}.png`}
          className={
            symbol === clanFlagSymbolInput
              ? "w-full h-auto rounded-lg border border-gray-300"
              : "w-full h-auto"
          }
          alt={symbol}
          id={`symbol-img-${symbol}`}
        />
        <p className="text-center text-sm text-gray-300">{symbol}</p>
      </button>
    ));
  };

  const createNewRelationship = () => {
    if (!isLeader && !hasPermissions) {
      return "";
    }

    return (
      <div className="w-full">
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md">
          <div className="p-4">
            <form onSubmit={handleCreateRelationship}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="typedInput"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    {t("common.type")}
                  </label>
                  <select
                    id="typedInput"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={typedInput}
                    onChange={(evt) => setTypedInput(Number(evt.target.value) as TypeRelationship)}
                  >
                    <option value="0">{t("diplomacy.napOrSettler")}</option>
                    <option value="1">{t("diplomacy.ally")}</option>
                    <option value="2">{t("diplomacy.war")}</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="flag_color"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    {t("clan.flagColor")}
                  </label>
                  <input
                    type="color"
                    className="w-full p-1 bg-gray-700 border border-gray-600 rounded-lg h-10"
                    id="flag_color"
                    name="flag_color"
                    value={clanFlagInput}
                    onChange={(evt) => setClanFlagInput(evt.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="nameOtherClanInput"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  {t("clan.clanName")}
                </label>
                <input
                  type="text"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="nameOtherClanInput"
                  name="nameOtherClanInput"
                  maxLength={20}
                  value={nameOtherClanInput}
                  onChange={(evt) => setNameOtherClanInput(evt.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="sigilClanFlagInput"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  {t("diplomacy.symbol")}
                </label>
                <div className="w-full">
                  <div className="flex flex-wrap">{symbolsList()}</div>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  className="w-full md:w-1/2 lg:w-1/3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="submit"
                  value="Submit"
                >
                  {t("diplomacy.createRelationship")}
                </button>
              </div>
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
          text: "clan.needClanAccess",
          redirectPage: "/profile",
        }}
      />
    );
  }

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
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
      <div className="flex flex-col space-y-4">
        {/* Formulario de creación en una fila completa */}
        {isLeader || hasPermissions ? (
          <div className="w-full">{createNewRelationship()}</div>
        ) : null}

        {/* Las tres categorías en otra fila */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="w-full">
            <div className="bg-gray-800 border border-green-500 rounded-lg shadow-md">
              <div className="bg-green-600 text-white text-center p-2 rounded-t-lg">
                {t("diplomacy.allies")}
              </div>
              <div className="p-4">
                <div className="space-y-2">{listOfAllies()}</div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="bg-gray-800 border border-yellow-500 rounded-lg shadow-md">
              <div className="bg-yellow-500 text-gray-900 text-center p-2 rounded-t-lg">
                {t("diplomacy.napOrSettlers")}
              </div>
              <div className="p-4">
                <div className="space-y-2">{listOfNAP()}</div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="bg-gray-800 border border-red-500 rounded-lg shadow-md">
              <div className="bg-red-600 text-white text-center p-2 rounded-t-lg">
                {t("diplomacy.war")}
              </div>
              <div className="p-4">
                <div className="space-y-2">{listOfEnemies()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diplomacy;
