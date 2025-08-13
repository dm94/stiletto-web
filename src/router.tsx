import React from "react";
import { Routes, Route } from "react-router";
import { Suspense } from "react";
import LoadingScreen from "@components/LoadingScreen";

// Lazy load all page components
const Home = React.lazy(() => import("@pages/Home"));
const Crafter = React.lazy(() => import("@pages/Crafter"));
const DiscordConnection = React.lazy(() => import("@pages/DiscordConnection"));
const ClanList = React.lazy(() => import("@pages/ClanList"));
const MemberList = React.lazy(() => import("@pages/MemberList"));
const ClanMaps = React.lazy(() => import("@pages/ClanMaps"));
const MapDetail = React.lazy(() => import("@pages/MapDetail"));
const TradeSystem = React.lazy(() => import("@pages/TradeSystem"));
const Diplomacy = React.lazy(() => import("@pages/Diplomacy"));
const AuctionTimers = React.lazy(() => import("@pages/AuctionTimers"));
const Others = React.lazy(() => import("@pages/Others"));
const MapPage = React.lazy(() => import("@pages/MapPage"));
const TechTree = React.lazy(() => import("@pages/TechTree"));
const Privacy = React.lazy(() => import("@pages/Privacy"));
const ItemWiki = React.lazy(() => import("@pages/ItemWiki"));
const CreatureWiki = React.lazy(() => import("@pages/CreatureWiki"));
const Wiki = React.lazy(() => import("@pages/Wiki"));
const NotFoundPage = React.lazy(() => import("@pages/NotFound"));
const ResourceMapNoLog = React.lazy(
  () => import("@components/ClanMaps/ResourceMapNoLog"),
);

const AppRoutes: React.ReactElement = (
  <Suspense fallback={<LoadingScreen />}>
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="profile" element={<DiscordConnection />} />
      <Route path="crafter" element={<Crafter />} />
      <Route path="members" element={<MemberList />} />
      <Route path="clanlist" element={<ClanList />} />
      <Route path="maps" element={<ClanMaps />} />
      <Route path="maps/:id" element={<MapDetail />} />
      <Route path="trades" element={<TradeSystem />} />
      <Route path="diplomacy" element={<Diplomacy />} />
      <Route path="auctions" element={<AuctionTimers />} />
      <Route path="others" element={<Others />} />
      <Route path="map/:id" element={<ResourceMapNoLog />} />
      <Route path="map" element={<MapPage />} />
      <Route path="tech/:tree" element={<TechTree />} />
      <Route path="tech/" element={<TechTree />} />
      <Route path="privacy" element={<Privacy />} />
      <Route path="item/:name" element={<ItemWiki />} />
      <Route path="item/:name/:rarity" element={<ItemWiki />} />
      <Route path="item" element={<Wiki />} />
      <Route path="creature/:name" element={<CreatureWiki />} />
      <Route path="creature" element={<Wiki />} />
      <Route path="wiki/" element={<Wiki />} />
      <Route path="not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
