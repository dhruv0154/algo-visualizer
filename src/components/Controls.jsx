import React from "react";

export default function Controls({ children }) {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3">
      {children}
    </div>
  );
}
