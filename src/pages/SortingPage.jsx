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
  const [running, setRunning] = useState(false);
  const [highlight, setHighlight] = useState([]);
  const [pivotIdx, setPivotIdx] = useState(-1);
  const [sorted, setSorted] = useState(false);
  const [currentLine, setCurrentLine] = useState(null);
  const [tab, setTab] = useState("Overview");

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const beep = useBeep(muted);

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

  const DESCRIPTIONS = {
    "Bubble Sort": {
      title: "Bubble Sort",
      overview:
        "Bubble Sort repeatedly compares adjacent elements and swaps them if out of order. It is intuitive but inefficient for large datasets.",
      history:
        "Popularized academically because of its simplicity. Often used to introduce basic swap-based sorting logic.",
      complexity: { time: "O(n²)", space: "O(1)" },
      code: `repeat until no swaps:
  swapped = false
  for j = 0..n-2:
    if a[j] > a[j+1]:
      swap
      swapped = true`,
      resources: [
        { label: "Bubble Sort – Khan Academy", href: "https://www.khanacademy.org/computing/computer-science/algorithms" },
        { label: "Visualization (YouTube)", href: "https://www.youtube.com/watch?v=xli_FI7CuzA" }
      ]
    },
    "Insertion Sort": {
      title: "Insertion Sort",
      overview:
        "Insertion Sort builds the final sorted array one element at a time by shifting elements and inserting the key at the correct position.",
      history:
        "Inspired by how humans sort cards manually. Efficient for nearly-sorted lists.",
      complexity: { time: "O(n²) average", space: "O(1)" },
      code: `for i = 1..n-1:
  key = a[i]
  j = i-1
  while j >= 0 and a[j] > key:
    a[j+1] = a[j]
    j--
  a[j+1] = key`,
      resources: [
        { label: "Insertion Sort Explained", href: "https://www.youtube.com/watch?v=JU767SDMDvA" },
        { label: "GeeksForGeeks Article", href: "https://www.geeksforgeeks.org/insertion-sort/" }
      ]
    },
    "Selection Sort": {
      title: "Selection Sort",
      overview:
        "Selection Sort repeatedly selects the minimum element from the unsorted portion and places it at the beginning.",
      history:
        "Often taught early due to conceptual simplicity: find min and place it.",
      complexity: { time: "O(n²)", space: "O(1)" },
      code: `for i = 0..n-2:
  min = i
  for j = i+1..n-1:
    if a[j] < a[min]:
      min = j
  swap a[i], a[min]`,
      resources: [
        { label: "Selection Sort Visualization", href: "https://www.youtube.com/watch?v=g-PGLbMth_g" },
        { label: "Wikipedia", href: "https://en.wikipedia.org/wiki/Selection_sort" }
      ]
    },
    "Merge Sort": {
      title: "Merge Sort",
      overview:
        "Merge Sort is a divide-and-conquer algorithm that recursively splits the array and merges the sorted halves.",
      history:
        "Invented by John von Neumann in 1945. One of the earliest efficient sorting algorithms.",
      complexity: { time: "O(n log n)", space: "O(n)" },
      code: `mergeSort(l, r):
  if l >= r return
  mid = (l+r)/2
  mergeSort(l, mid)
  mergeSort(mid+1, r)
  merge(left, right)`,
      resources: [
        { label: "Merge Sort Animation", href: "https://www.youtube.com/watch?v=4VqmGXwpLqc" },
        { label: "Merge Sort – CS50", href: "https://cs50.harvard.edu" }
      ]
    },
    "Quick Sort": {
      title: "Quick Sort",
      overview:
        "Quick Sort partitions the array around a pivot and recursively sorts the left and right partitions.",
      history:
        "Developed by Tony Hoare in 1959. Fundamentally changed algorithmic thinking with its divide-and-conquer partitioning.",
      complexity: { time: "O(n log n) average, O(n²) worst-case", space: "O(log n) recursion" },
      code: `quickSort(lo, hi):
  if lo >= hi return
  p = partition(lo, hi)
  quickSort(lo, p-1)
  quickSort(p+1, hi)`,
      resources: [
        { label: "Quick Sort Visualization", href: "https://www.youtube.com/watch?v=PgBzjlCcFvc" },
        { label: "Wikipedia", href: "https://en.wikipedia.org/wiki/Quicksort" }
      ]
    },
  };

  function regenerate() {
    if (running) return;
    setArray(generateArray(responsiveBarCount()));
    setHighlight([]);
    setPivotIdx(-1);
    setSorted(false);
    setCurrentLine(null);
  }

  const tick = () => new Promise((r) => setTimeout(r, Math.max(1, speedRef.current)));

  async function startSort() {
    if (running) return;
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        fetch('http://localhost:5000/log-activity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, type: 'Sorting', name: algorithm })
        }).catch(e => console.error(e));
    }
    setRunning(true);
    setHighlight([]); 
    setPivotIdx(-1);
    setSorted(false); 
    setCurrentLine(null);

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

    setHighlight([]); 
    setSorted(true);
    sounds.onDone?.();
    await new Promise((r) => setTimeout(r, 150));
    setRunning(false);
    setCurrentLine(null);
  }

  const currentDescription = DESCRIPTIONS[algorithm];

  return (
    <section className="space-y-6">
      <Header title={algorithm} subtitle="Choose an algorithm and see it animate with highlighted steps." />

      <Controls>
        <Button onClick={regenerate} disabled={running}>Generate New Array</Button>

        <select
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          disabled={running}
        >
          {algorithms.map((alg) => (
            <option className="bg-gray-800" key={alg}>{alg}</option>
          ))}
        </select>

        <Button onClick={startSort} disabled={running} intent="primary">Start</Button>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400">Speed</label>
          <input
            type="range"
            min={1}
            max={200}
            step={1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-40 accent-cyan-500"
          />
          <span className="text-xs text-gray-500 w-12">{speed}ms</span>
        </div>
      </Controls>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
          <div className="text-lg text-gray-200 font-semibold mb-3">Pseudocode</div>
          <pre className="text-xs font-mono leading-6">
            {pseudocode[algorithm].map((line, i) => (
              <div
                key={i}
                className={`px-2 py-1 rounded ${
                  currentLine === i ? "bg-cyan-600/20 text-cyan-300" : "text-gray-400"
                }`}
              >
                {i + 1}. {line}
              </div>
            ))}
          </pre>
        </div>

        <div className="col-span-2 p-3 bg-white/5 border border-white/10 rounded-2xl">
          <div className="h-64 sm:h-72 md:h-80 lg:h-96 bg-gradient-to-b from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-3 flex items-end gap-1 relative overflow-hidden">
            {array.map((val, idx) => {
              const isHi = highlight.includes(idx);
              const isPivot = idx === pivotIdx;
              const cls = sorted
                ? "bg-green-400"
                : isPivot
                ? "bg-fuchsia-500"
                : isHi
                ? "bg-yellow-400 animate-pulse"
                : "bg-cyan-500";

              return (
                <div
                  key={idx}
                  className={"flex-1 rounded-t-lg transition-all duration-150 " + cls}
                  style={{ height: `${5 + val}%` }}
                />
              );
            })}

            {sorted && <div className="absolute inset-0 pointer-events-none animate-ping opacity-20 bg-green-400/10" />}
          </div>
        </div>
      </div>

      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xl text-gray-200 font-semibold">{currentDescription.title}</div>
            <div className="text-sm text-gray-400">{currentDescription.overview}</div>
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
              <div><strong>History:</strong> {currentDescription.history}</div>
              <div><strong>Use cases:</strong> Each sorting algorithm excels under specific constraints such as nearly-sorted input, in-place memory, divide-and-conquer needs, or average-case speed.</div>
            </div>
          )}

          {tab === "Complexity" && (
            <div>
              <div className="mb-2"><strong>Time:</strong> {currentDescription.complexity.time}</div>
              <div><strong>Space:</strong> {currentDescription.complexity.space}</div>
              <div className="text-xs text-gray-400 mt-2">n is the number of elements. Recursive algorithms have stack overhead.</div>
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
                <a key={i} href={r.href} target="_blank" rel="noreferrer" className="text-cyan-300 underline block">
                  {r.label}
                </a>
              ))}
              <div className="text-xs text-gray-400 mt-2">Recommended path: Understand stable vs unstable sorts → recursive sorts → in-place partitioning.</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
