import React, { useEffect, useRef, useState } from "react";
import { Header } from "../components/Header";
import Controls from "../components/Controls";
import Button from "../components/Button";
import { linearSearch, binarySearch, generateSortedArray, generateArray } from "../utils/algorithms";
import { useBeep, successChord } from "../utils/soundUtils";

function responsiveCellCount() {
  if (typeof window === "undefined") return 48;
  const width = window.innerWidth;
  if (width < 420) return 24;
  if (width < 640) return 36;
  if (width < 1024) return 48;
  return 72;
}

export default function SearchingPage({ muted }) {
  const algorithms = ["Linear Search", "Binary Search"];
  const [algorithm, setAlgorithm] = useState(algorithms[0]);
  const [array, setArray] = useState(() => generateSortedArray(48));
  const [target, setTarget] = useState(42);
  const [running, setRunning] = useState(false);
  const [highlight, setHighlight] = useState([]);
  const [message, setMessage] = useState("Ready.");
  const [speed, setSpeed] = useState(40);
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  const beep = useBeep(muted);

  function regenerate() {
    if (running) return;
    if (algorithm === "Linear Search") setArray(generateArray(responsiveCellCount()));
    else setArray(generateSortedArray(responsiveCellCount()));
    setHighlight([]); setMessage("Ready.");
  }

  const tick = () => new Promise((r) => setTimeout(r, Math.max(1, speedRef.current)));

  async function startSearch() {
    if (running) return;
    setRunning(true); setHighlight([]); setMessage("Searching...");

    const sounds = {
      onProbe: () => beep(980, 0.02, "sine", 0.02),
      onFound: () => successChord(beep),
      onFail: () => beep(220, 0.15, "sawtooth", 0.02),
    };

    let idx = -1;
    if (algorithm === "Linear Search") {
      idx = await linearSearch(array, Number(target), setHighlight, tick, sounds);
    } else {
      const sorted = [...array].sort((a, b) => a - b);
      setArray(sorted);
      await tick();
      idx = await binarySearch(sorted, Number(target), setHighlight, tick, sounds);
    }

    setMessage(idx >= 0 ? `Target ${target} found at index ${idx}.` : "Target not found.");
    if (idx >= 0) sounds.onFound?.(); else sounds.onFail?.();
    setRunning(false);
  }

  return (
    <section className="space-y-6">
      <Header title={algorithm} subtitle="Switch between Linear and Binary. Binary auto-sorts the array first." />
      <Controls>
        <Button onClick={regenerate} disabled={running}>Generate New Array</Button>
        <select className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm" value={algorithm} onChange={(e)=>setAlgorithm(e.target.value)} disabled={running}>
          {algorithms.map((alg)=>(<option className=" bg-gray-800 "key={alg}>{alg}</option>))}
        </select>
        <input type="number" value={target} onChange={(e)=>setTarget(Number(e.target.value))} disabled={running} className="w-24 px-3 py-2 rounded-xl bg-white/5 border border-white/10" />
        <Button onClick={startSearch} disabled={running} intent="primary">Start</Button>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400">Speed</label>
          <input type="range" min={1} max={200} step={1} value={speed} onChange={(e)=>setSpeed(Number(e.target.value))} className="w-40 accent-cyan-500" />
          <span className="text-xs text-gray-500 w-12">{speed}ms</span>
        </div>
        <div className="text-sm text-gray-400">{message}</div>
      </Controls>

      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-2 p-3 bg-white/5 border border-white/10 rounded-2xl">
        {array.map((num, idx) => (
          <div key={idx} className={`aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition ${highlight.includes(idx) ? "bg-yellow-400 animate-pulse text-gray-900" : "bg-gray-800 text-gray-300"}`}>
            {num}
          </div>
        ))}
      </div>
    </section>
  );
}
