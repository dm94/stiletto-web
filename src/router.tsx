import type React from "react";
import { Routes, Route } from "react-router";
import TechTree from "./pages/TechTree";
import ResourceMapNoLog from "./components/ClanMaps/ResourceMapNoLog";
import ItemWiki from "./pages/ItemWiki";
import NotFoundPage from "./pages/NotFound";

const AppRoutes: React.ReactElement = (
  <Routes>
    <Route path="/map/:id" element={<ResourceMapNoLog />} />
    <Route path="/tech/:tree" element={<TechTree />} />
    <Route path="/tech/" element={<TechTree />} />
    <Route path="/item/:name" element={<ItemWiki />} />
    <Route path="/not-found" element={<NotFoundPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
