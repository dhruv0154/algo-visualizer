import React from "react";
import { useNavigate } from "react-router-dom";
import CTAButton from "../components/CTAButton";
import Badge from "../components/Badge";
import FeatureCard from "../pages/_shared/FeatureCard";
import HeroSphere3D from "../three/HeroSphere3D";
import WaveGrid3D from "../three/WaveGrid3D";
import Portal3D from "../three/Portal3D";
import ShowcaseCard from "../pages/_shared/ShowcaseCard";
import Step from "../components/Step";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <section className="relative space-y-16">
      <div className="relative overflow-hidden rounded-3xl mt-0 sm:p-12">
        <div className="grid mt-0 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Visualize <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-300">Complex Algorithms</span>
            </h1>
            <p className="mt-4 text-gray-400 text-lg">Drag nodes, tweak speed and hear the data dance.</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <CTAButton onClick={() => navigate("/sorting")} label="Explore Sorting" primary />
              <CTAButton onClick={() => navigate("/searching")} label="Try Searching" />
              <CTAButton onClick={() => navigate("/pathfinding")} label="Run Pathfinding" />
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              <Badge>React Hooks</Badge>
              <Badge>Tailwind CSS</Badge>
              <Badge>Three.js</Badge>
            </div>
          </div>

          <div className="relative h-64 sm:h-80 lg:h-[40rem] ">
            <HeroSphere3D />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeatureCard title="Sorting Visuals" body="Neon bars with compare, pivot, and merge highlights." onClick={() => navigate("/sorting")} />
        <FeatureCard title="Smart Search" body="Linear & Binary with auto-sorted arrays and status messaging." onClick={() => navigate("/searching")} />
        <FeatureCard title="Pathfinding Playground" body="Drag start/end nodes, paint walls, see BFS explore the grid." onClick={() => navigate("/pathfinding")} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-center">
        <div className="space-y-5">
          <h3 className="text-2xl font-bold">How it works</h3>
          <Step title="Pick an algorithm" desc="Choose sorting, searching, or BFS pathfinding." />
          <Step title="Tune the controls" desc="Adjust speed live, drag nodes, set targets." />
          <Step title="Watch & learn" desc="Observe highlights, hear cues, and inspect steps." />
          <div className="pt-2">
            <CTAButton onClick={() => navigate("/sorting")} label="Start Now" primary />
          </div>
        </div>
        <div className="relative h-100 sm:h-100">
          <WaveGrid3D />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <ShowcaseCard title="Sorting in Action" subtitle="Bubble, Insertion Quick" onClick={() => navigate("/sorting")} />
        <ShowcaseCard title="Pathfinding Demo" subtitle="BFS with draggable start/end and walls" onClick={() => navigate("/pathfinding")} />
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-12 text-center bg-gradient-to-br from-white/5 to-white/10">
        <div className="mx-auto max-w-xl">
          <h4 className="text-2xl sm:text-3xl font-bold">Ready to make algorithms click?</h4>
          <p className="text-gray-400 mt-2">Jump into visualizations with sound, speed, and 3D flair.</p>
        </div>
        <div className="mt-6 mx-auto max-w-xs relative">
          <Portal3D />
          <button onClick={() => navigate("/sorting")} className="relative z-10 w-full px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 shadow-xl">
            Launch Visualizer
          </button>
        </div>
      </div>

    </section>
  );
}
