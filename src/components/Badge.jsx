import React from "react";

export default function Badge({ children }) {
  return (
    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">{children}</span>
  );
}
