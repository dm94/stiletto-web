import type React from "react";
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router";
import LoadingScreen from "@components/LoadingScreen";
import ResourceMapNoLog from "@components/ClanMaps/ResourceMapNoLog";

// Dynamically import page components
const Crafter = lazy(() => import("@pages/Crafter"));
const DiscordConnection = lazy(() => import("@pages/DiscordConnection"));
const ClanList = lazy(() => import("@pages/ClanList"));
const MemberList = lazy(() => import("@pages/MemberList"));
const ClanMaps = lazy(() => import("@pages/ClanMaps"));
const MapDetail = lazy(() => import("@pages/MapDetail"));
const Home = lazy(() => import("@pages/Home"));
const TradeSystem = lazy(() => import("@pages/TradeSystem"));
const Diplomacy = lazy(() => import("@pages/Diplomacy"));
const AuctionTimers = lazy(() => import("@pages/AuctionTimers"));
const Others = lazy(() => import("@pages/Others"));
const MapPage = lazy(() => import("@pages/MapPage"));
const TechTree = lazy(() => import("@pages/TechTree"));
const Privacy = lazy(() => import("@pages/Privacy"));
const ItemWiki = lazy(() => import("@pages/ItemWiki"));
const CreatureWiki = lazy(() => import("@pages/CreatureWiki"));
const Wiki = lazy(() => import("@pages/Wiki"));
const NotFoundPage = lazy(() => import("@pages/NotFound"));

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
