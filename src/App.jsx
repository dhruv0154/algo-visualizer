import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import SortingPage from "./pages/SortingPage";
import SearchingPage from "./pages/SearchingPage";
import PathfindingPage from "./pages/PathfindingPage";

export default function App() {
  const [muted, setMuted] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar muted={muted} setMuted={setMuted} />
      <main className="pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sorting" element={<SortingPage muted={muted} />} />
          <Route path="/searching" element={<SearchingPage muted={muted} />} />
          <Route path="/pathfinding" element={<PathfindingPage muted={muted} />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}