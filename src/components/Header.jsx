import React from "react";

export const Header = ({ title, subtitle }) => (
  <div className="flex flex-col gap-2">
    <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
    <p className="text-gray-400 max-w-3xl">{subtitle}</p>
  </div>
);
