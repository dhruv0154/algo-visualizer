import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo";


function LinkBtn({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        "px-3 py-2 rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-cyan-400/40 " +
        (isActive
          ? "bg-cyan-500/20 text-cyan-300 shadow-inner"
          : "text-gray-300 hover:text-cyan-300 hover:bg-white/5")
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar({ muted, setMuted }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-gray-900/80 border border-white/5 shadow-lg shadow-cyan-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <BrandLogo />
        </button>
        <nav className="flex items-center gap-2">
          <LinkBtn to="/sorting">Sorting</LinkBtn>
          <LinkBtn to="/searching">Searching</LinkBtn>
          <LinkBtn to="/pathfinding">Pathfinding</LinkBtn>
          {user ? (
        <LinkBtn to="/dashboard" className="text-cyan-400 font-bold hover:text-cyan-300">Dashboard</LinkBtn>
    ) : (
        <LinkBtn to="/auth" className="text-gray-300 hover:text-white">Login</LinkBtn>
    )}

          <button
            onClick={() => setMuted((m) => !m)}
            className={
              "ml-2 px-3 py-2 rounded-xl text-sm font-medium transition " +
              (muted ? "bg-white/5" : "bg-cyan-600 text-white hover:bg-cyan-500")
            }
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </nav>
      </div>
    </header>
  );
}
