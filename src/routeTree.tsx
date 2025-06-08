import { RootRoute, Route } from "@tanstack/react-router";
import CrafterApp from "./CrafterApp"; // Import the main app component

// Import page components
import Home from "./pages/Home";
import Crafter from "./pages/Crafter";
import ClanList from "./pages/ClanList";
import MemberList from "./pages/MemberList";
// import WalkerList from "./pages/WalkerList"; // Commented out as it's not in the provided old router
import ClanMaps from "./pages/ClanMaps";
import MapDetail from "./pages/MapDetail";
import MapPage from "./pages/MapPage";
import AuctionTimers from "./pages/AuctionTimers";
import TradeSystem from "./pages/TradeSystem";
import Wiki from "./pages/Wiki";
import ItemWiki from "./pages/ItemWiki";
import CreatureWiki from "./pages/CreatureWiki";
import TechTree from "./pages/TechTree";
import Diplomacy from "./pages/Diplomacy";
import Others from "./pages/Others";
import DiscordConnection from "./pages/DiscordConnection";
import Privacy from "./pages/Privacy";
import NotFoundPage from "./pages/NotFound";
import ResourceMapNoLog from "./components/ClanMaps/ResourceMapNoLog";

// Define a context interface if you need to pass data through context
interface RouterContext {
  // auth: AuthContext; // Example, if you have auth context
  lang?: string;
}

// Create a pathless root route. This will serve as the main layout.
const rootRoute = new RootRoute({
  component: CrafterApp, // CrafterApp will render the <Outlet/> for child routes
});

// Create a layout route that handles the optional language parameter
const langLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/$lang?", // Optional language parameter
  // You can add a component here if this layout needs its own UI, e.g., a language switcher
  // component: LanguageLayoutComponent,
});

// Define application routes as children of the langLayoutRoute
const indexRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "/",
  component: Home,
});

const profileRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "profile", // Relative path
  component: DiscordConnection,
});

const crafterRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "crafter",
  component: Crafter,
});

const membersRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "members",
  component: MemberList,
});

const clanListRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "clanlist",
  component: ClanList,
});

const mapsRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "maps",
  component: ClanMaps,
});

const mapDetailRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "maps/$id",
  component: MapDetail,
});

const tradesRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "trades",
  component: TradeSystem,
});

const diplomacyRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "diplomacy",
  component: Diplomacy,
});

const auctionsRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "auctions",
  component: AuctionTimers,
});

const othersRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "others",
  component: Others,
});

// This route seems to be for a public map view, potentially without language prefix?
// If it should also have lang prefix, it should be a child of langLayoutRoute.
// For now, making it a child of rootRoute, assuming it might have different layout/handling.
const mapResourceNoLogRoute = new Route({
  getParentRoute: () => rootRoute, // Changed parent to rootRoute for distinct handling
  path: "/map/$id", // Absolute path from root
  component: ResourceMapNoLog,
});

const mapPageRoute = new Route({
  getParentRoute: () => langLayoutRoute, // Or rootRoute if it doesn't need lang
  path: "map",
  component: MapPage,
});

const techTreeRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "tech/$tree",
  component: TechTree,
});

const techTreeIndexRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "tech", // Changed from /tech/ to tech to be relative
  component: TechTree,
});

const privacyRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "privacy",
  component: Privacy,
});

const itemWikiRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "item/$name",
  component: ItemWiki,
});

const itemWikiRarityRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "item/$name/$rarity",
  component: ItemWiki,
});

const itemIndexRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "item",
  component: Wiki,
});

const creatureWikiRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "creature/$name",
  component: CreatureWiki,
});

const creatureIndexRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "creature",
  component: Wiki,
});

const wikiIndexRoute = new Route({
  getParentRoute: () => langLayoutRoute,
  path: "wiki",
  component: Wiki,
});

// Catch-all "Not Found" route - should be a child of the layout that applies
const notFoundRoute = new Route({
  getParentRoute: () => langLayoutRoute, // Or rootRoute if it's a very generic 404
  path: "*", // This will catch unmatched paths under the parent
  component: NotFoundPage,
});

// Assemble the route tree
const appRoutes = langLayoutRoute.addChildren([
  indexRoute,
  profileRoute,
  crafterRoute,
  membersRoute,
  clanListRoute,
  mapsRoute,
  mapDetailRoute,
  tradesRoute,
  diplomacyRoute,
  auctionsRoute,
  othersRoute,
  mapPageRoute, // Assuming mapPage needs language context
  techTreeRoute,
  techTreeIndexRoute,
  privacyRoute,
  itemWikiRoute,
  itemWikiRarityRoute,
  itemIndexRoute,
  creatureWikiRoute,
  creatureIndexRoute,
  wikiIndexRoute,
  notFoundRoute, // This catch-all should be last for this layout
]);

// Add the language layout and the specific /map/:id route to the root
export const routeTree = rootRoute.addChildren([
  appRoutes,
  mapResourceNoLogRoute,
  // Consider a root-level catch-all if /map/:id and other potential root paths don't cover all cases
  // new Route({ getParentRoute: () => rootRoute, path: "*", component: NotFoundPage })
]);
