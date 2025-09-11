import React from "react";

export default function Step({ title, desc }) {
  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
      <div className="text-cyan-300 font-semibold">{title}</div>
      <div className="text-gray-400 text-sm">{desc}</div>
    </div>
  );
}
