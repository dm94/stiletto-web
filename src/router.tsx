import type React from "react";
import { Routes, Route } from "react-router";
import Crafter from "@pages/Crafter";
import DiscordConnection from "@pages/DiscordConnection";
import ClanList from "@pages/ClanList";
import MemberList from "@pages/MemberList";
import WalkerList from "@pages/WalkerList";
import ClanMaps from "@pages/ClanMaps";
import MapDetail from "@pages/MapDetail";
import Home from "@pages/Home";
import TradeSystem from "@pages/TradeSystem";
import Diplomacy from "@pages/Diplomacy";
import AuctionTimers from "@pages/AuctionTimers";
import Others from "@pages/Others";
import MapPage from "@pages/MapPage";
import TechTree from "@pages/TechTree";
import Privacy from "@pages/Privacy";
import ResourceMapNoLog from "@components/ClanMaps/ResourceMapNoLog";
import ItemWiki from "@pages/ItemWiki";
import Wiki from "@pages/Wiki";
import NotFoundPage from "@pages/NotFound";

const AppRoutes: React.ReactElement = (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/profile" element={<DiscordConnection />} />
    <Route path="/crafter" element={<Crafter />} />
    <Route path="/members" element={<MemberList />} />
    <Route path="/clanlist" element={<ClanList />} />
    <Route path="/walkerlist" element={<WalkerList />} />
    <Route path="/maps" element={<ClanMaps />} />
    <Route path="/maps/:id" element={<MapDetail />} />
    <Route path="/trades" element={<TradeSystem />} />
    <Route path="/diplomacy" element={<Diplomacy />} />
    <Route path="/auctions" element={<AuctionTimers />} />
    <Route path="/others" element={<Others />} />
    <Route path="/map/:id" element={<ResourceMapNoLog />} />
    <Route path="/map" element={<MapPage />} />
    <Route path="/tech/:tree" element={<TechTree />} />
    <Route path="/tech/" element={<TechTree />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/item/:name" element={<ItemWiki />} />
    <Route path="/wiki/" element={<Wiki />} />
    <Route path="/not-found" element={<NotFoundPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
