import React, { useState } from "react";
import Particles3D from "../../three/Particles3D";


export default function FeatureCard({ title, body, onClick }) {
const [hovered, setHovered] = useState(false);
return (
<div
className="relative rounded-2xl p-5 border border-white/10 bg-gradient-to-br from-white/5 to-white/10 hover:to-white/20 transition overflow-hidden"
onMouseEnter={() => setHovered(true)}
onMouseLeave={() => setHovered(false)}
>
<div className="absolute inset-0 opacity-60 pointer-events-none">
<Particles3D hovered={hovered} />
</div>
<div className="relative z-10">
<div className="flex items-center gap-3 text-cyan-300">
<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20h4V4H3v16zm7 0h4V10h-4v10zm7 0h4V6h-4v14z"/></svg>
<span className="font-semibold">{title}</span>
</div>
<p className="mt-2 text-sm text-gray-400">{body}</p>
<div className="mt-4">
<button onClick={onClick} className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 transition">Visualize</button>
</div>
</div>
</div>
);
}