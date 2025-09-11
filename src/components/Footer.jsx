import React from "react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="border-t border-white/5 bg-gray-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <BrandLogo />
          <span className="text-gray-500">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => navigate("/")} className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition">Home</button>
          <button onClick={() => navigate("/sorting")} className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition">Sorting</button>
          <button onClick={() => navigate("/searching")} className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition">Searching</button>
          <button onClick={() => navigate("/pathfinding")} className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition">Pathfinding</button>
        </div>
      </div>
    </footer>
  );
}
