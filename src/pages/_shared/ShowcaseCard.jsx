import React, { useState } from "react";
import RotatingCube3D from "../../three/RotatingCube3D";


export default function ShowcaseCard({ title, subtitle, onClick }) {
const [hovered, setHovered] = useState(false);
return (
<div className="relative rounded-2xl p-5 border border-white/10 bg-white/5 overflow-hidden">
<div className="absolute inset-0 opacity-70 pointer-events-none">
<RotatingCube3D hovered={hovered} />
</div>
<div className="relative z-10">
<div className="text-lg font-semibold text-cyan-300">{title}</div>
<div className="text-sm text-gray-400">{subtitle}</div>
<div className="mt-4">
<button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500">Open</button>
</div>
</div>
</div>
);
}