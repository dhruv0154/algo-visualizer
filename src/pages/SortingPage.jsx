// src/pages/SortingPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { Header } from "../components/Header";
import Controls from "../components/Controls";
import Button from "../components/Button";
import { useBeep, successChord } from "../utils/soundUtils";
import {
  bubbleSort,
  insertionSort,
  selectionSort,
  mergeSort,
  quickSort,
  generateArray,
} from "../utils/algorithms"; 

function responsiveBarCount() {
  if (typeof window === "undefined") return 40;
  const width = window.innerWidth;
  if (width < 420) return 24;
  if (width < 640) return 30;
  if (width < 1024) return 36;
  return 48;
}

export default function SortingPage({ muted }) {
  const algorithms = ["Bubble Sort", "Insertion Sort", "Selection Sort", "Merge Sort", "Quick Sort"];
  const [algorithm, setAlgorithm] = useState(algorithms[0]);
  const [array, setArray] = useState(() => generateArray(40));
  const [speed, setSpeed] = useState(50);
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const [running, setRunning] = useState(false);
  const [highlight, setHighlight] = useState([]);
  const [pivotIdx, setPivotIdx] = useState(-1);
  const [sorted, setSorted] = useState(false);
  const [currentLine, setCurrentLine] = useState(null); 
  const beep = useBeep(muted);

  function regenerate() {
    if (running) return;
    setArray(generateArray(responsiveBarCount()));
    setHighlight([]);
    setPivotIdx(-1);
    setSorted(false);
    setCurrentLine(null);
  }

  const tick = () => new Promise((r) => setTimeout(r, Math.max(1, speedRef.current)));

  // Pseudocode for highlighting each algorithm
  const pseudocode = {
    "Bubble Sort": [
      "for i = 0 to n-2",
      "  for j = 0 to n-i-2",
      "    compare array[j] and array[j+1]",
      "    if array[j] > array[j+1] then swap",
      "end"
    ],
    "Insertion Sort": [
      "for i = 1 to n-1",
      "  key = array[i]",
      "  j = i - 1",
      "  while j >= 0 and array[j] > key",
      "    array[j+1] = array[j]; j--",
      "  array[j+1] = key",
      "end"
    ],
    "Selection Sort": [
      "for i = 0 to n-2",
      "  min = i",
      "  for j = i+1 to n-1",
      "    if array[j] < array[min] then min = j",
      "  if min != i swap array[i], array[min]",
      "end"
    ],
    "Merge Sort": [
      "mergeSort(l, r)",
      "  if l >= r return",
      "  m = floor((l + r) / 2)",
      "  mergeSort(l, m)",
      "  mergeSort(m+1, r)",
      "  merge left and right",
      "end"
    ],
    "Quick Sort": [
  "quickSort(lo, hi)",
  "if lo >= hi return",
  "p = partition(lo, hi)",
  "quickSort(lo, p-1)",
  "quickSort(p+1, hi)",
  "partition(lo, hi):",
  "pivot = arr[hi]",
  "i = lo",
  "for j = lo to hi-1",
  "if arr[j] < pivot swap",
  "swap arr[i] and arr[hi]; return i"
]
  };

  async function startSort() {
    if (running) return;
    setRunning(true);
    setHighlight([]); setPivotIdx(-1); setSorted(false); setCurrentLine(null);

    const sounds = {
      onCompare: () => beep(880, 0.02, "sine", 0.02),
      onSwap: () => beep(440, 0.04, "triangle", 0.03),
      onDone: () => successChord(beep),
    };

    const arr = [...array];
    switch (algorithm) {
      case "Bubble Sort":
        await bubbleSort(arr, setArray, setHighlight, tick, sounds, setCurrentLine);
        break;
      case "Insertion Sort":
        await insertionSort(arr, setArray, setHighlight, tick, sounds, setCurrentLine);
        break;
      case "Selection Sort":
        await selectionSort(arr, setArray, setHighlight, tick, sounds, setCurrentLine);
        break;
      case "Merge Sort":
        await mergeSort(arr, setArray, setHighlight, tick, sounds, setCurrentLine, 0, arr.length - 1);
        break;
      case "Quick Sort":
        await quickSort(arr, setArray, setHighlight, tick, setPivotIdx, sounds, setCurrentLine, 0, arr.length - 1);
        setPivotIdx(-1);
        break;
      default:
        break;
    }

    setHighlight([]); setSorted(true);
    sounds.onDone?.();
    await new Promise((r) => setTimeout(r, 150));
    setRunning(false);
    setCurrentLine(null);
  }

  return (
    <section className="space-y-6">
      <Header title={algorithm} subtitle="Choose an algorithm and bars dance through the data. Pseudocode highlights the current step." />
      <Controls>
        <Button onClick={regenerate} disabled={running}>Generate New Array</Button>
        <select className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm" value={algorithm} onChange={(e)=>setAlgorithm(e.target.value)} disabled={running}>
          {algorithms.map((alg) => <option className="bg-gray-800" key={alg}>{alg}</option>)}
        </select>
        <Button onClick={startSort} disabled={running} intent="primary">Start</Button>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400">Speed</label>
          <input type="range" min={1} max={200} step={1} value={speed} onChange={(e)=>setSpeed(Number(e.target.value))} className="w-40 accent-cyan-500" />
          <span className="text-xs text-gray-500 w-12">{speed}ms</span>
        </div>
      </Controls>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* PSEUDOCODE PANEL */}
        <div className=" p-3 bg-white/5 border border-white/10 rounded-2xl">
          <div className="text-sm text-gray-300 font-medium mb-2">Pseudocode</div>
          <pre className="text-xs font-mono leading-6">
            {pseudocode[algorithm].map((line, i) => (
              <div
                key={i}
                className={`px-2 py-1 rounded ${currentLine === i ? "bg-cyan-500/30 text-cyan-300" : "text-gray-400"}`}
              >
                {i + 1}. {line}
              </div>
            ))}
          </pre>
        </div>

        {/* VISUALIZER */}
        <div className="col-span-2 p-3 bg-white/5 border border-white/10 rounded-2xl">
          <div className="h-64 sm:h-72 md:h-80 lg:h-96 bg-gradient-to-b from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-3 flex items-end gap-1 relative overflow-hidden">
            {array.map((val, idx) => {
              const isHi = highlight.includes(idx);
              const isPivot = idx === pivotIdx;
              const cls = sorted ? "bg-green-400" : isPivot ? "bg-fuchsia-500" : isHi ? "bg-yellow-400 animate-pulse" : "bg-cyan-500";
              return (
                <div key={idx} className={"flex-1 rounded-t-lg transition-all duration-150 " + cls} style={{ height: `${5 + val}%` }} />
              );
            })}
            {sorted && <div className="absolute inset-0 pointer-events-none animate-ping opacity-20 bg-green-400/10" />}
          </div>
        </div>
      </div>
    </section>
  );
}
