import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type FormEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import ModalMessage from "../components/ModalMessage";
import LoadingScreen from "../components/LoadingScreen";
import ClanSelect from "../components/Diplomacy/ClanSelect";
import { getUser } from "../functions/requests/users";
import { getDomain } from "../functions/utils";
import { config } from "../config/config";
import {
  getRelationships,
  createRelationship,
  deleteRelationship,
} from "../functions/requests/clans/relationships";
import {
  type RelationshipInfo,
  TypeRelationship,
} from "../types/dto/relationship";
import { getMemberPermissions } from "../functions/requests/clans/members";

const Diplomacy = () => {
  const { t } = useTranslation();
  const [clanId, setClanId] = useState<number>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [listOfRelations, setListOfRelations] = useState<RelationshipInfo[]>(
    [],
  );
  const [typedInput, setTypedInput] = useState<TypeRelationship>(
    TypeRelationship.NAP,
  );
  const [clanFlagInput, setClanFlagInput] = useState<string>("");
  const [clanFlagSymbolInput, setClanFlagSymbolInput] = useState<string>("C1");
  const [nameOtherClanInput, setNameOtherClanInput] = useState<string>("");
  const [isLeader, setIsLeader] = useState<boolean>(false);
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);

  const fetchRelationships = useCallback(async (clanid: number) => {
    try {
      const response = await getRelationships(clanid);
      setListOfRelations(response);
      return response;
    } catch {
      setError("errors.apiConnection");
      return [];
    }
  }, []);

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        const userProfile = await getUser();
        const { clanid, discordid, leaderid } = userProfile;

        setClanId(clanid);
        setIsLeader(discordid === leaderid);

        if (!clanid) {
          setIsLoaded(true);
          return;
        }

        await fetchRelationships(clanid);

        if (discordid === leaderid) {
          setHasPermissions(true);
        } else {
          const permissions = await getMemberPermissions(clanid, discordid);
          setHasPermissions(permissions.diplomacy ?? false);
        }
      } catch {
        setError("errors.apiConnection");
      } finally {
        setIsLoaded(true);
      }
    };

    initializeComponent();
  }, [fetchRelationships]);

  const handleCreateRelationship = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!clanId || isSubmitting) {
        return;
      }

      setIsSubmitting(true);
      setError("");

      try {
        await createRelationship(clanId, {
          nameotherclan: nameOtherClanInput,
          clanflag: clanFlagInput,
          typed: typedInput,
          symbol: clanFlagSymbolInput,
        });

        const updatedRelationships = await fetchRelationships(clanId);
        setListOfRelations(updatedRelationships);

        setNameOtherClanInput("");
        setClanFlagInput("");
        setTypedInput(TypeRelationship.NAP);
        setClanFlagSymbolInput("C1");
      } catch {
        setError("common.tryAgainLater");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      clanId,
      clanFlagInput,
      clanFlagSymbolInput,
      fetchRelationships,
      isSubmitting,
      nameOtherClanInput,
      typedInput,
    ],
  );

  const handleDeleteDiplomacy = useCallback(
    async (relationShipId: number) => {
      if (!clanId || isSubmitting) {
        return;
      }

      setIsSubmitting(true);
      setError("");

      try {
        await deleteRelationship(clanId, relationShipId);

        setListOfRelations((prev) =>
          prev.filter((rel) => rel.id !== relationShipId),
        );
      } catch {
        setError("common.tryAgainLater");
      } finally {
        setIsSubmitting(false);
      }
    },
    [clanId, isSubmitting],
  );

  // Memoized relationship lists to prevent unnecessary recalculations
  const allies = useMemo(() => {
    return listOfRelations.filter(
      (r) =>
        r.typed === TypeRelationship.ALLY ||
        r.typed === TypeRelationship.FALSE_ALLY,
    );
  }, [listOfRelations]);

  const enemies = useMemo(() => {
    return listOfRelations.filter(
      (r) =>
        r.typed === TypeRelationship.WAR ||
        r.typed === TypeRelationship.FALSE_WAR,
    );
  }, [listOfRelations]);

  const naps = useMemo(() => {
    return listOfRelations.filter(
      (r) =>
        r.typed === TypeRelationship.NAP ||
        r.typed === TypeRelationship.FALSE_NAP,
    );
  }, [listOfRelations]);

  // Render relationship lists
  const renderRelationshipList = useCallback(
    (relationships: RelationshipInfo[], keyPrefix: string) => {
      if (!relationships.length) {
        return (
          <div className="text-gray-400 text-center">{t("common.noData")}</div>
        );
      }

      return relationships.map((relationship) => (
        <div key={`${keyPrefix}${relationship.id}`} className="w-full">
          <ClanSelect
            clan={relationship}
            isLeader={isLeader || hasPermissions}
            onDelete={handleDeleteDiplomacy}
          />
        </div>
      ));
    },
    [handleDeleteDiplomacy, hasPermissions, isLeader, t],
  );

  const listOfAllies = useCallback(() => {
    return renderRelationshipList(allies, "ally");
  }, [allies, renderRelationshipList]);

  const listOfEnemies = useCallback(() => {
    return renderRelationshipList(enemies, "enemy");
  }, [enemies, renderRelationshipList]);

  const listOfNAP = useCallback(() => {
    return renderRelationshipList(naps, "nap");
  }, [naps, renderRelationshipList]);

  // Memoize symbols list to prevent unnecessary re-renders
  const symbolsList = useMemo(() => {
    const symbols = Array.from({ length: 30 }, (_, i) => `C${i + 1}`);
    return symbols.map((symbol) => (
      <button
        type="button"
        className="w-1/12"
        key={`symbol-${symbol}`}
        onClick={() => setClanFlagSymbolInput(symbol)}
        aria-label={`Select symbol ${symbol}`}
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
          loading="lazy"
        />
        <p className="text-center text-sm text-gray-300">{symbol}</p>
      </button>
    ));
  }, [clanFlagSymbolInput]);

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
                    onChange={(evt) =>
                      setTypedInput(
                        Number(evt.target.value) as TypeRelationship,
                      )
                    }
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
                  <div className="flex flex-wrap">{symbolsList}</div>
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
