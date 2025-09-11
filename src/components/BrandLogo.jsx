import React from "react";

export default function BrandLogo() {
  return (
    <div className="flex items-center gap-2 font-semibold">
      <svg className="w-6 h-6 text-cyan-400 animate-pulse" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2 3 7v10l9 5 9-5V7l-9-5z" />
      </svg>
      <span className="tracking-wide">AlgoViz</span>
    </div>
  );
}
