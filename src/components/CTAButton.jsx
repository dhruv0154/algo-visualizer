import React from "react";

export default function CTAButton({ label, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      className={
        "px-5 py-3 rounded-2xl transition shadow-xl " +
        (primary ? "bg-cyan-600 hover:bg-cyan-500" : "bg-white/5 hover:bg-white/10 border border-white/10")
      }
    >
      {label}
    </button>
  );
}
