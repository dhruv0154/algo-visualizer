import React, { useEffect, useRef, useState } from "react";
import { Header } from "../components/Header";
import Controls from "../components/Controls";
import Button from "../components/Button";
import {
  linearSearch,
  binarySearch,
  generateSortedArray,
  generateArray,
} from "../utils/algorithms";
import { useBeep, successChord } from "../utils/soundUtils";

function responsiveCellCount() {
  if (typeof window === "undefined") return 48;
  const width = window.innerWidth;
  if (width < 420) return 24;
  if (width < 640) return 48;
  if (width < 1024) return 68;
  return 96;
}

export default function SearchingPage({ muted }) {
  const algorithms = ["Linear Search", "Binary Search"];
  const [algorithm, setAlgorithm] = useState(algorithms[0]);
  const [array, setArray] = useState(() => generateSortedArray(48));
  const [target, setTarget] = useState(42);
  const [running, setRunning] = useState(false);
  const [highlight, setHighlight] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  const [message, setMessage] = useState("Ready.");
  const [speed, setSpeed] = useState(40);
  const speedRef = useRef(speed);
  const [tab, setTab] = useState("Overview");

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const beep = useBeep(muted);

  const pseudocode = {
    "Linear Search": [
      "for i = 0 to n-1",
      "  check array[i]",
      "  if array[i] == target then return i",
      "end for",
      "return -1",
    ],
    "Binary Search": [
      "low = 0, high = n - 1",
      "while low <= high",
      "  mid = floor((low + high) / 2)",
      "  check array[mid]",
      "  if array[mid] == target then return mid",
      "  else if array[mid] < target then low = mid + 1",
      "  else high = mid - 1",
      "end while",
      "return -1",
    ],
  };

  const DESCRIPTIONS = {
    "Linear Search": {
      title: "Linear Search",
      overview:
        "Linear Search scans each element from left to right until the target is found. It works on any array (sorted or unsorted) and is the simplest searching algorithm.",
      history:
        "Linear scanning is as old as computing itself — a primitive but universal operation found in hardware, assembly loops, and high-level languages.",
      complexity: {
        time: "O(n)",
        space: "O(1)",
      },
      code: `for i = 0..n-1:
  if arr[i] == target:
    return i
return -1`,
      resources: [
        {
          label: "Linear Search (YouTube)",
          href: "https://www.youtube.com/watch?v=C46QfTjVCNU",
        },
        {
          label: "Linear Search – GeeksForGeeks",
          href: "https://www.geeksforgeeks.org/linear-search/",
        },
      ],
    },
    "Binary Search": {
      title: "Binary Search",
      overview:
        "Binary Search repeatedly halves the search range and is far faster than linear search — but only works on sorted arrays.",
      history:
        "Binary Search was formalized by John Mauchly and others in early computing. Surprisingly, many early published versions had off-by-one bugs.",
      complexity: {
        time: "O(log n)",
        space: "O(1)",
      },
      code: `low = 0, high = n - 1
while low <= high:
  mid = (low + high) // 2
  if arr[mid] == target: return mid
  elif arr[mid] < target: low = mid + 1
  else: high = mid - 1
return -1`,
      resources: [
        {
          label: "Binary Search Visualization (YouTube)",
          href: "https://www.youtube.com/watch?v=V_T5NuccwRA",
        },
        {
          label: "Binary Search – Wikipedia",
          href: "https://en.wikipedia.org/wiki/Binary_search_algorithm",
        },
      ],
    },
  };

  function regenerate() {
    if (running) return;
    if (algorithm === "Linear Search")
      setArray(generateArray(responsiveCellCount()));
    else setArray(generateSortedArray(responsiveCellCount()));
    setHighlight([]);
    setCurrentLine(null);
    setMessage("Ready.");
  }

  const tick = () =>
    new Promise((r) => setTimeout(r, Math.max(1, speedRef.current)));

  async function startSearch() {
    if (running) return;
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        fetch('http://localhost:5000/log-activity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                userId: user.id, 
                type: 'Searching', 
                name: algorithm 
            })
        }).catch(e => console.error(e));
    }
    setRunning(true);
    setHighlight([]);
    setCurrentLine(null);
    setMessage("Searching...");

    const sounds = {
      onProbe: () => beep(980, 0.02, "sine", 0.02),
      onFound: () => successChord(beep),
      onFail: () => beep(220, 0.15, "sawtooth", 0.02),
    };

    let idx = -1;

    if (algorithm === "Linear Search") {
      idx = await linearSearch(
        array,
        Number(target),
        setHighlight,
        tick,
        sounds,
        setCurrentLine
      );
    } else {
      const sorted = [...array].sort((a, b) => a - b);
      setArray(sorted);
      await tick();
      idx = await binarySearch(
        sorted,
        Number(target),
        setHighlight,
        tick,
        sounds,
        setCurrentLine
      );
    }

    setMessage(
      idx >= 0 ? `Target ${target} found at index ${idx}.` : "Target not found."
    );
    if (idx >= 0) sounds.onFound?.();
    else sounds.onFail?.();
    setRunning(false);
  }

  const currentDescription = DESCRIPTIONS[algorithm];

  return (
    <section className="space-y-6">
      <Header
        title={algorithm}
        subtitle="Switch between Linear and Binary Search. Binary auto-sorts the array."
      />

      <Controls>
        <Button onClick={regenerate} disabled={running}>
          Generate New Array
        </Button>

        <select
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          disabled={running}
        >
          {algorithms.map((alg) => (
            <option className="bg-gray-800" key={alg}>
              {alg}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
          disabled={running}
          className="w-24 px-3 py-2 rounded-xl bg-white/5 border border-white/10"
        />

        <Button onClick={startSearch} disabled={running} intent="primary">
          Start
        </Button>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400">Speed</label>
          <input
            type="range"
            min={1}
            max={500}
            step={1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-40 accent-cyan-500"
          />
          <span className="text-xs text-gray-500 w-12">{speed}ms</span>
        </div>

        <div className="text-sm text-gray-400">{message}</div>
      </Controls>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="text-lg text-gray-200 font-semibold mb-3">
            Pseudocode
          </div>
          <pre className="text-xs font-mono leading-6">
            {pseudocode[algorithm].map((line, i) => (
              <div
                key={i}
                className={`px-2 py-1 rounded ${
                  currentLine === i
                    ? "bg-cyan-600/20 text-cyan-300"
                    : "text-gray-400"
                }`}
              >
                {i + 1}. {line}
              </div>
            ))}
          </pre>
        </div>

        <div className="col-span-2 p-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-2">
            {array.map((num, idx) => (
              <div
                key={idx}
                className={`aspect-square flex items-center justify-center rounded-xl transition ${
                  highlight.includes(idx)
                    ? "bg-yellow-400 animate-pulse text-gray-900"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <input
                  type="text"
                  value={String(num)}
                  disabled={running}
                  onChange={(e) => {
                    let value = Number(e.target.value);
                    if (isNaN(value)) value = 0;
                    if (value > 200) value = 200;
                    if (value < -200) value = -200;
                    const newArray = [...array];
                    newArray[idx] = value;
                    setArray(newArray);
                  }}
                  className="w-10/12 h-10 text-center rounded-lg text-sm font-medium px-0 focus:outline-none bg-transparent"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xl text-gray-200 font-semibold">
              {currentDescription.title}
            </div>
            <div className="text-sm text-gray-400">
              {currentDescription.overview}
            </div>
          </div>

          <div className="flex gap-2">
            {["Overview", "Complexity", "Code", "Resources"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 rounded-md text-sm ${
                  tab === t ? "bg-cyan-600 text-black" : "bg-white/10 text-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[120px] text-sm text-gray-200">
          {tab === "Overview" && (
            <div className="space-y-3">
              <div>
                <strong>History:</strong> {currentDescription.history}
              </div>
              <div>
                <strong>Use Cases:</strong> Linear Search works everywhere;
                Binary Search is ideal for large sorted datasets.
              </div>
            </div>
          )}

          {tab === "Complexity" && (
            <div>
              <div className="mb-2">
                <strong>Time:</strong> {currentDescription.complexity.time}
              </div>
              <div>
                <strong>Space:</strong> {currentDescription.complexity.space}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                For Binary Search, O(log n) comparisons is exponentially faster
                than Linear’s O(n).
              </div>
            </div>
          )}

          {tab === "Code" && (
            <pre className="text-sm font-mono p-3 bg-gray-900/60 rounded text-gray-200 whitespace-pre-wrap">
              {currentDescription.code}
            </pre>
          )}

          {tab === "Resources" && (
            <div className="space-y-2">
              {currentDescription.resources.map((r, i) => (
                <a
                  key={i}
                  href={r.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-300 underline block"
                >
                  {r.label}
                </a>
              ))}
              <div className="text-xs text-gray-400 mt-2">
                Suggested learning flow: Linear Search basics → Binary Search
                intuition → practice off-by-one patterns.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
