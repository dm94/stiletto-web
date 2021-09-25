import React from "react";
import { Switch, Route } from "react-router";
import ModalMessage from "./components/ModalMessage";
import Crafter from "./pages/Crafter";
import DiscordConnection from "./pages/DiscordConnection";
import ClanList from "./pages/ClanList";
import MemberList from "./pages/MemberList";
import WalkerList from "./pages/WalkerList";
import ClanMaps from "./pages/ClanMaps";
import Home from "./pages/Home";
import TradeSystem from "./pages/TradeSystem";
import Diplomacy from "./pages/Diplomacy";
import AuctionTimers from "./pages/AuctionTimers";
import Others from "./pages/Others";
import Map from "./pages/Map";
import TechTree from "./pages/TechTree";
import QualityCalculator from "./pages/QualityCalculator";
import Privacy from "./pages/Privacy";
import ResourceMapNoLog from "./components/ResourceMapNoLog";
import ItemWiki from "./pages/ItemWiki";

export default (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/profile" component={DiscordConnection} />
    <Route path="/crafter" component={Crafter} />
    <Route path="/members" component={MemberList} />
    <Route path="/clanlist" component={ClanList} />
    <Route path="/walkerlist" component={WalkerList} />
    <Route path="/maps" component={ClanMaps} />
    <Route path="/trades" component={TradeSystem} />
    <Route path="/diplomacy" component={Diplomacy} />
    <Route path="/auctions" component={AuctionTimers} />
    <Route path="/others" component={Others} />
    <Route path="/map/:id" component={ResourceMapNoLog} />
    <Route path="/map" component={Map} />
    <Route path="/quality" component={QualityCalculator} />
    <Route path="/tech/:tree" component={TechTree} />
    <Route path="/tech/" component={TechTree} />
    <Route path="/privacy" component={Privacy} />
    <Route path="/item/:name" component={ItemWiki} />
    <Route path="*">
      <ModalMessage
        message={{
          isError: true,
          text: "The page you are looking for does not exist",
          redirectPage: "/",
        }}
      />
    </Route>
  </Switch>
);
