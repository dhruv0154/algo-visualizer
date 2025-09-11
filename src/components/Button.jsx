import React from "react";

export default function Button({ children, onClick, disabled, intent = "default" }) {
  const base = "px-4 py-2 rounded-xl text-sm font-medium transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = intent === "primary"
    ? "bg-cyan-600 text-white hover:bg-cyan-500 focus:ring-2 focus:ring-cyan-400/40 shadow-lg shadow-cyan-900/30"
    : "bg-white/5 border border-white/10 hover:bg-white/10";
  return (
    <button className={`${base} ${styles}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
