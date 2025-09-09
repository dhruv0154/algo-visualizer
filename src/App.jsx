// App.jsx — Single-file Interactive Algorithm Visualizer (React + Tailwind + react-three-fiber)
// Enhanced: techy neon UI, contained Three.js effects per section, movable start/end, live speed,
// sound cues with mute, extra sorting/searching algos, and polished visuals.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function App() {
  const [route, setRoute] = useState("home");
  const [muted, setMuted] = useState(false);
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar route={route} setRoute={setRoute} muted={muted} setMuted={setMuted} />
      <main className="pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {route === "home" && <HomePage setRoute={setRoute} />}
        {route === "sorting" && <SortingPage muted={muted} />}
        {route === "searching" && <SearchingPage muted={muted} />}
        {route === "pathfinding" && <PathfindingPage muted={muted} />}
      </main>
      <Footer setRoute={setRoute} />
    </div>
  );
}

/* --------------------------- Shared UI Components -------------------------- */
const BrandLogo = () => (
  <div className="flex items-center gap-2 font-semibold">
    <svg className="w-6 h-6 text-cyan-400 animate-pulse" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2 3 7v10l9 5 9-5V7l-9-5z" />
    </svg>
    <span className="tracking-wide">AlgoVisualizer</span>
  </div>
);

function Navbar({ route, setRoute, muted, setMuted }) {
  const Link = ({ to, children }) => (
    <button
      onClick={() => setRoute(to)}
      className={
        "px-3 py-2 rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-cyan-400/40 " +
        (route === to
          ? "bg-cyan-500/20 text-cyan-300 shadow-inner"
          : "text-gray-300 hover:text-cyan-300 hover:bg-white/5")
      }
    >
      {children}
    </button>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-gray-900/80 border-b border-white/5 shadow-lg shadow-cyan-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button onClick={() => setRoute("home")} className="flex items-center gap-2">
          <BrandLogo />
        </button>
        <nav className="flex items-center gap-2">
          <Link to="sorting">Sorting</Link>
          <Link to="searching">Searching</Link>
          <Link to="pathfinding">Pathfinding</Link>
          <button
            onClick={() => setMuted((m) => !m)}
            className={"ml-2 px-3 py-2 rounded-xl text-sm font-medium transition " + (muted ? "bg-white/5" : "bg-cyan-600 text-white hover:bg-cyan-500")}
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </nav>
      </div>
    </header>
  );
}

function Footer({ setRoute }) {
  return (
    <footer className="border-t border-white/5 bg-gray-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <BrandLogo />
          <span className="text-gray-500">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setRoute("home")} className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition">Home</button>
          <button onClick={() => setRoute("sorting")} className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition">Sorting</button>
          <button onClick={() => setRoute("searching")} className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition">Searching</button>
          <button onClick={() => setRoute("pathfinding")} className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition">Pathfinding</button>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ setRoute }) {
  return (
    <section className="relative space-y-16">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl mt-0 sm:p-12">
        <div className="grid mt-0 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Visualize <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-300">Complex Algorithms</span>
            </h1>
            <p className="mt-4 text-gray-400 text-lg">
              A single-file React app with neon vibes. Interactive 3D accents. Drag nodes, tweak speed mid-run, and hear the data dance.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <CTAButton onClick={() => setRoute("sorting")} label="Explore Sorting" primary />
              <CTAButton onClick={() => setRoute("searching")} label="Try Searching" />
              <CTAButton onClick={() => setRoute("pathfinding")} label="Run Pathfinding" />
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              <Badge>React Hooks</Badge>
              <Badge>Tailwind CSS</Badge>
              <Badge>Three.js</Badge>
              <Badge>Neon UI</Badge>
            </div>
          </div>
          {/* 3D sphere */}
          <div className="relative h-64 sm:h-80 lg:h-[40rem] ">
            <HeroSphere3D />
          </div>
        </div>

        {/* subtle aurora */}
        <div className="pointer-events-none absolute -z-10 inset-0 bg-[radial-gradient(60%_60%_at_10%_10%,rgba(34,211,238,0.12),transparent),radial-gradient(40%_40%_at_90%_20%,rgba(244,63,94,0.10),transparent),radial-gradient(50%_50%_at_50%_100%,rgba(250,204,21,0.10),transparent)]" />
      </div>

      {/* FEATURE GRID with per-card particles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Sorting Visuals", body: "Neon bars with compare, pivot, and merge highlights.", action: () => setRoute("sorting") },
          { title: "Smart Search", body: "Linear & Binary with auto-sorted arrays and status messaging.", action: () => setRoute("searching") },
          { title: "Pathfinding Playground", body: "Drag start/end nodes, paint walls, see BFS explore the grid.", action: () => setRoute("pathfinding") },
        ].map((f, i) => (
          <FeatureCard key={i} title={f.title} body={f.body} onClick={f.action} />
        ))}
      </div>

      {/* TECH MARQUEE */}
      <TechMarquee />

      {/* TIMELINE with wave grid */}
      <div className="grid lg:grid-cols-2 gap-6 items-center">
        <div className="space-y-5">
          <h3 className="text-2xl font-bold">How it works</h3>
          <Step title="Pick an algorithm" desc="Choose sorting, searching, or BFS pathfinding." />
          <Step title="Tune the controls" desc="Adjust speed live, drag nodes, set targets." />
          <Step title="Watch & learn" desc="Observe highlights, hear cues, and inspect steps." />
          <div className="pt-2">
            <CTAButton onClick={() => setRoute("sorting")} label="Start Now" primary />
          </div>
        </div>
        <div className="relative h-100 sm:h-100">
          <WaveGrid3D />
        </div>
      </div>

      {/* SHOWCASE */}
      <div className="grid md:grid-cols-2 gap-4">
        <ShowcaseCard title="Sorting in Action" subtitle="Bubble → Quick with neon pivots" onClick={() => setRoute("sorting")} />
        <ShowcaseCard title="Pathfinding Demo" subtitle="BFS with draggable start/end and walls" onClick={() => setRoute("pathfinding")} />
      </div>

      {/* CTA */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-12 text-center bg-gradient-to-br from-white/5 to-white/10">
        <div className="mx-auto max-w-xl">
          <h4 className="text-2xl sm:text-3xl font-bold">Ready to make algorithms click?</h4>
          <p className="text-gray-400 mt-2">Jump into visualizations with sound, speed, and 3D flair.</p>
        </div>
        <div className="mt-6 mx-auto max-w-xs relative">
          <Portal3D />
          <button onClick={() => setRoute("sorting")} className="relative z-10 w-full px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 shadow-xl">
            Launch Visualizer
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- SortingPage ------------------------------ */
function SortingPage({ muted }) {
  const algorithms = ["Bubble Sort", "Insertion Sort", "Selection Sort", "Merge Sort", "Quick Sort"];
  const [algorithm, setAlgorithm] = useState(algorithms[0]);
  const [array, setArray] = useState(() => generateArray(40));
  const [speed, setSpeed] = useState(50); // ms per step; LIVE adjustable
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const [running, setRunning] = useState(false);
  const [highlight, setHighlight] = useState([]);
  const [pivotIdx, setPivotIdx] = useState(-1);
  const [sorted, setSorted] = useState(false);
  const beep = useBeep(muted);

  function regenerate() {
    if (running) return;
    setArray(generateArray(responsiveBarCount()));
    setHighlight([]);
    setPivotIdx(-1);
    setSorted(false);
  }

  function responsiveBarCount() {
    if (typeof window === "undefined") return 40;
    const width = window.innerWidth;
    if (width < 420) return 24;
    if (width < 640) return 30;
    if (width < 1024) return 36;
    return 48;
  }

  const tick = () => new Promise((r) => setTimeout(r, Math.max(1, speedRef.current)));

  async function startSort() {
    if (running) return;
    setRunning(true);
    setHighlight([]);
    setPivotIdx(-1);
    setSorted(false);
    const arr = [...array];
    const sounds = {
      onCompare: () => beep(880, 0.02, "sine", 0.02),
      onSwap: () => beep(440, 0.04, "triangle", 0.03),
      onDone: () => successChord(beep),
    };
    switch (algorithm) {
      case "Bubble Sort":
        await bubbleSort(arr, setArray, setHighlight, tick, sounds);
        break;
      case "Insertion Sort":
        await insertionSort(arr, setArray, setHighlight, tick, sounds);
        break;
      case "Selection Sort":
        await selectionSort(arr, setArray, setHighlight, tick, sounds);
        break;
      case "Merge Sort":
        await mergeSort(arr, setArray, setHighlight, tick, sounds);
        break;
      case "Quick Sort":
        await quickSort(arr, setArray, setHighlight, tick, setPivotIdx, sounds);
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
  }

  return (
    <section className="space-y-6">
      <Header title={algorithm} subtitle="Choose an algorithm and watch neon bars dance through the data. Now with sound cues and completion glow." />

      <Controls>
        <Button onClick={regenerate} disabled={running}>Generate New Array</Button>
        <select
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          disabled={running}
        >
          {algorithms.map((alg) => <option key={alg}>{alg}</option>)}
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

      <div className="h-64 sm:h-72 md:h-80 lg:h-96 bg-gradient-to-b from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-3 flex items-end gap-1 relative overflow-hidden">
        {/* scanlines */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_0%,rgba(0,255,255,0.06)_2%,rgba(0,0,0,0)_4%)] bg-[length:100%_12px] opacity-40" />
        {array.map((val, idx) => {
          const isHi = highlight.includes(idx);
          const isPivot = idx === pivotIdx;
          const cls = sorted
            ? "bg-green-400 shadow-[0_0_14px_0_rgba(34,197,94,0.55)]"
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
        {sorted && (
          <div className="absolute inset-0 pointer-events-none animate-ping opacity-20 bg-green-400/10" />
        )}
      </div>
    </section>
  );
}



/* ------------------------------ SearchingPage ----------------------------- */
function SearchingPage({ muted }) {
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
    setArray(generateSortedArray(responsiveCellCount()));
    setHighlight([]);
    setMessage("Ready.");
  }

  function responsiveCellCount() {
    if (typeof window === "undefined") return 48;
    const width = window.innerWidth;
    if (width < 420) return 24;
    if (width < 640) return 36;
    if (width < 1024) return 48;
    return 72;
  }

  const tick = () => new Promise((r) => setTimeout(r, Math.max(1, speedRef.current)));

  async function startSearch() {
    if (running) return;
    setRunning(true);
    setHighlight([]);
    setMessage("Searching...");

    const sounds = {
      onProbe: () => beep(980, 0.02, "sine", 0.02),
      onFound: () => successChord(beep),
      onFail: () => beep(220, 0.15, "sawtooth", 0.02),
    };

    let idx = -1;
    if (algorithm === "Linear Search") {
      idx = await linearSearch(array, Number(target), setHighlight, tick, sounds);
    } else {
      // Ensure sorted before binary
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
        <select
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          disabled={running}
        >
          {algorithms.map((alg) => <option key={alg}>{alg}</option>)}
        </select>
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
          disabled={running}
          className="w-24 px-3 py-2 rounded-xl bg-white/5 border border-white/10"
        />
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
          <div
            key={idx}
            className={`aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition ${highlight.includes(idx) ? "bg-yellow-400 animate-pulse text-gray-900" : "bg-gray-800 text-gray-300"}`}
          >
            {num}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------- PathfindingPage ---------------------------- */
function PathfindingPage({ muted }) {
  const { rows, cols } = useResponsiveGrid();
  const [grid, setGrid] = useState(() => createInitialGrid(rows, cols));
  const [running, setRunning] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [speed, setSpeed] = useState(15);
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const [start, setStart] = useState({ r: Math.floor(rows / 2), c: Math.floor(cols / 6) });
  const [end, setEnd] = useState({ r: Math.floor(rows / 2), c: Math.floor(cols * 5 / 6) });
  const [dragging, setDragging] = useState(null); // 'start' | 'end' | null
  const beep = useBeep(muted);

  useEffect(() => { setGrid(createInitialGrid(rows, cols)); }, [rows, cols]);

  function toggleWall(r, c) {
    setGrid((g) => g.map((row, ri) => row.map((cell, ci) => (ri === r && ci === c ? { ...cell, wall: !cell.wall } : cell))));
  }
  function clearWalls() { if (running) return; setGrid((g) => g.map((row) => row.map((cell) => ({ ...cell, wall: false })))); }
  function clearPath() { if (running) return; setGrid((g) => g.map((row) => row.map((cell) => ({ ...cell, visited: false, inPath: false })))); }
  function resetGrid() { if (running) return; setGrid(createInitialGrid(rows, cols)); }

  async function visualizeBFS() {
    if (running) return; setRunning(true); clearPath();
    const visited = new Set(); const prev = new Map(); const q = [];
    const startKey = key(start.r, start.c); q.push(start); visited.add(startKey);

    while (q.length > 0) {
      const cur = q.shift();
      if (!(cur.r === start.r && cur.c === start.c)) {
        await markVisited(cur.r, cur.c, setGrid, () => speedRef.current);
        beep(520, 0.02, "square", 0.02);
      }
      if (cur.r === end.r && cur.c === end.c) break;
      for (const [nr, nc] of neighbors(cur.r, cur.c, rows, cols)) {
        if (visited.has(key(nr, nc))) continue; if (grid[nr][nc].wall) continue;
        visited.add(key(nr, nc)); prev.set(key(nr, nc), key(cur.r, cur.c)); q.push({ r: nr, c: nc });
      }
    }

    // Reconstruct path
    const path = [];
    let curKey = key(end.r, end.c);
    if (!prev.has(curKey) && curKey !== key(start.r, start.c)) { setRunning(false); return; }
    while (curKey !== key(start.r, start.c)) {
      const [r, c] = curKey.split(",").map(Number);
      path.push({ r, c });
      curKey = prev.get(curKey);
      if (!curKey) break;
    }
    for (let i = path.length - 1; i >= 0; i--) {
      await markPath(path[i].r, path[i].c, setGrid);
      beep(700, 0.02, "sine", 0.02);
    }
    successChord(beep);
    setRunning(false);
  }

  return (
    <section className="space-y-6 select-none">
      <Header title="Breadth-First Search (BFS)" subtitle="Drag Start (green) / End (red) or paint walls. Adjust speed while it runs." />

      <Controls>
        <Button onClick={visualizeBFS} disabled={running} intent="primary">Visualize BFS</Button>
        <Button onClick={clearWalls} disabled={running}>Clear Walls</Button>
        <Button onClick={clearPath} disabled={running}>Clear Path</Button>
        <Button onClick={resetGrid} disabled={running}>Reset Grid</Button>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400">Speed</label>
          <input type="range" min={5} max={60} step={1} value={speed} onChange={(e)=>setSpeed(Number(e.target.value))} className="w-40 accent-cyan-500" />
          <span className="text-xs text-gray-500 w-12">{speed}ms</span>
        </div>
      </Controls>

      <div
        className="rounded-2xl border border-white/10 overflow-hidden bg-white/5 p-2"
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => { setMouseDown(false); setDragging(null); }}
        onMouseLeave={() => { setMouseDown(false); setDragging(null); }}
      >
        <div className="grid relative" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {/* subtle grid glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.08),transparent_40%),radial-gradient(circle_at_80%_100%,rgba(250,204,21,0.08),transparent_40%)]" />
          {grid.map((row, r) => row.map((cell, c) => {
            const isStart = r === start.r && c === start.c;
            const isEnd = r === end.r && c === end.c;
            const base = "aspect-square border border-gray-800 text-[10px] flex items-center justify-center transition relative select-none";
            const bg = cell.wall ? "bg-gray-800"
              : cell.inPath ? "bg-yellow-400 animate-pulse"
              : cell.visited ? "bg-cyan-700/60"
              : "bg-gray-900";
            const special = isStart ? "bg-green-500 text-gray-900 font-bold"
              : isEnd ? "bg-red-500 text-gray-900 font-bold" : "";

            const handleMouseDown = () => {
              if (isStart) setDragging('start'); else if (isEnd) setDragging('end'); else toggleWall(r, c);
            };
            const handleMouseEnter = () => {
              if (!mouseDown) return;
              if (dragging === 'start' && !grid[r][c].wall && !(r === end.r && c === end.c)) setStart({ r, c });
              else if (dragging === 'end' && !grid[r][c].wall && !(r === start.r && c === start.c)) setEnd({ r, c });
              else if (!dragging && !isStart && !isEnd) toggleWall(r, c);
            };

            return (
              <div
                key={`${r}-${c}`}
                className={`${base} ${bg} ${special}`}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                title={isStart ? "Start" : isEnd ? "End" : ""}
              />
            );
          }))}
        </div>
      </div>
      <p className="text-xs text-gray-500">Tip: Drag green/red nodes to move Start/End. Click & drag elsewhere to draw walls.</p>
    </section>
  );
}

/* ------------------------------ Shared Pieces ----------------------------- */
const Header = ({ title, subtitle }) => (
  <div className="flex flex-col gap-2">
    <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
    <p className="text-gray-400 max-w-3xl">{subtitle}</p>
  </div>
);

const Controls = ({ children }) => (
  <div className="flex flex-wrap items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3">
    {children}
  </div>
);

function Button({ children, onClick, disabled, intent = "default" }) {
  const base = "px-4 py-2 rounded-xl text-sm font-medium transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = intent === "primary"
    ? "bg-cyan-600 text-white hover:bg-cyan-500 focus:ring-2 focus:ring-cyan-400/40 shadow-lg shadow-cyan-900/30"
    : "bg-white/5 border border-white/10 hover:bg-white/10";
  return (
    <button className={`${base} ${styles}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

const CTAButton = ({ label, onClick, primary }) => (
  <button
    onClick={onClick}
    className={
      "px-5 py-3 rounded-2xl transition shadow-xl " +
      (primary ? "bg-cyan-600 hover:bg-cyan-500" : "bg-white/5 hover:bg-white/10 border border-white/10")
    }
  >
    {label}
  </button>
);

const Badge = ({ children }) => (
  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">{children}</span>
);

const Step = ({ title, desc }) => (
  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
    <div className="text-cyan-300 font-semibold">{title}</div>
    <div className="text-gray-400 text-sm">{desc}</div>
  </div>
);

/* ------------------------------- ThreeJS Bits ------------------------------ */
function HeroSphere3D() {
  const [hovered, setHovered] = useState(false);
  return (
    <Canvas camera={{ position: [0, 0, 5] }} className="rounded-2xl">
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={1} />
      <WireSphere hovered={hovered} />
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      <mesh position={[0,0,0]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} visible={false}>
        <sphereGeometry args={[2.4, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </Canvas>
  );
}
function WireSphere({ hovered }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.25 + (hovered ? Math.sin(t * 2) * 0.1 : 0);
    ref.current.rotation.x = (hovered ? Math.cos(t * 2) * 0.08 : 0.1);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[2, 48, 48]} />
      <meshBasicMaterial wireframe color={hovered ? "#22d3ee" : "#a78bfa"} />
    </mesh>
  );
}

function FeatureCard({ title, body, onClick }) {
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

function Particles3D({ hovered }) {
  const count = 60;
  function Stars() {
    const group = useRef();
    const speeds = useMemo(() => new Array(count).fill().map(() => Math.random() * 0.01 + 0.003), []);
    const positions = useMemo(() => new Array(count).fill().map(() => [ (Math.random()-0.5)*6, (Math.random()-0.5)*4, (Math.random()-0.5)*5 ]), []);
    useFrame(() => {
      group.current.children.forEach((m, i) => {
        m.position.y += (hovered ? speeds[i]*6 : speeds[i]);
        if (m.position.y > 2) m.position.y = -2;
      });
    });
    return (
      <group ref={group}>
        {positions.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color={hovered ? "#22d3ee" : "#64748b"} />
          </mesh>
        ))}
      </group>
    );
  }
  return (
    <Canvas camera={{ position: [0, 0, 4] }}>
      <ambientLight intensity={0.5} />
      <Stars />
    </Canvas>
  );
}

function WaveGrid3D() {
  const [hovered, setHovered] = useState(false);
  function Plane() {
    const ref = useRef();
    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      const w = ref.current.geometry.parameters.widthSegments + 1;
      const h = ref.current.geometry.parameters.heightSegments + 1;
      const pos = ref.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = (i % w);
        const y = Math.floor(i / w);
        pos.setZ(i, Math.sin((x + t * 3) / 2) * 0.15 + Math.cos((y + t * 2) / 2) * 0.15 * (hovered ? 1.8 : 1));
      }
      pos.needsUpdate = true;
      ref.current.rotation.x = -Math.PI / 3;
    });
    return (
      <mesh ref={ref} position={[.3, 0.6, 0]}>
        <planeGeometry args={[6, 4, 40, 30]} />
        <meshStandardMaterial color="#22d3ee" wireframe />
      </mesh>
    );
  }
  return (
    <Canvas camera={{ position: [0, 2.5, 3.5] }} onCreated={({ gl }) => { gl.setClearColor("#000000", 0); }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} />
      <Plane />
      <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} position={[0,0,0]} visible={false}>
        <boxGeometry args={[10,10,10]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </Canvas>
  );
}

function ShowcaseCard({ title, subtitle, onClick }) {
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
function RotatingCube3D({ hovered }) {
  const Box = () => {
    const ref = useRef();
    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      if (!ref.current) return;
      ref.current.rotation.x = t * (hovered ? 1.2 : 0.4);
      ref.current.rotation.y = t * (hovered ? 1.4 : 0.5);
    });
    return (
      <mesh ref={ref}>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshStandardMaterial color={hovered ? "#fde047" : "#22d3ee"} wireframe />
      </mesh>
    );
  };
  return (
    <Canvas camera={{ position: [0, 0, 4] }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} />
      <Box />
    </Canvas>
  );
}

function Portal3D() {
  const [hovered, setHovered] = useState(false);
  function Ring() {
    const ref = useRef();
    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      if (!ref.current) return;
      ref.current.scale.setScalar(1 + Math.sin(t * (hovered ? 4 : 2)) * 0.05 + 0.05);
    });
    return (
      <mesh ref={ref}>
        <ringGeometry args={[0.9, 1.2, 64]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} />
      </mesh>
    );
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.8} />
        <Ring />
      </Canvas>
    </div>
  );
}

function TechMarquee() {
  const items = ["React", "Tailwind", "Three.js", "Sorting", "Searching", "BFS", "Hooks", "Single-File"];
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="animate-[marquee_18s_linear_infinite] whitespace-nowrap py-3 px-4 text-sm text-gray-300">
        {items.map((t, i) => (
          <span key={i} className="mx-6 opacity-80">{t}</span>
        ))}
      </div>
      <style>{`@keyframes marquee {0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

/* --------------------------------- Utils ---------------------------------- */
function generateArray(n) { return Array.from({ length: n }, () => Math.floor(10 + Math.random() * 90)); }
function generateSortedArray(n) { const arr = Array.from({ length: n }, () => Math.floor(1 + Math.random() * 99)); arr.sort((a,b)=>a-b); return arr; }

function useResponsiveGrid() {
  const [size, setSize] = useState({ rows: 20, cols: 35 });
  useEffect(() => {
    function calc() {
      const w = window.innerWidth;
      if (w < 420) return { rows: 16, cols: 12 };
      if (w < 640) return { rows: 18, cols: 18 };
      if (w < 1024) return { rows: 20, cols: 26 };
      return { rows: 22, cols: 36 };
    }
    function onResize() { setSize(calc()); }
    setSize(calc());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

function createInitialGrid(rows, cols) {
  return Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => ({ r, c, wall: false, visited: false, inPath: false })));
}
function neighbors(r, c, rows, cols) {
  const ds = [[1,0],[-1,0],[0,1],[0,-1]]; const out = [];
  for (const [dr, dc] of ds) { const nr = r + dr, nc = c + dc; if (nr>=0&&nr<rows&&nc>=0&&nc<cols) out.push([nr,nc]); }
  return out;
}
function key(r, c) { return `${r},${c}`; }

// Grid mutation helpers with animation delay
function markVisited(r, c, setGrid, getSpeed) {
  return new Promise((res) => {
    setGrid((g) => { const copy = g.map((row) => row.slice()); copy[r][c] = { ...copy[r][c], visited: true }; return copy; });
    setTimeout(res, Math.max(1, getSpeed()));
  });
}
function markPath(r, c, setGrid) {
  return new Promise((res) => {
    setGrid((g) => { const copy = g.map((row) => row.slice()); copy[r][c] = { ...copy[r][c], inPath: true }; return copy; });
    setTimeout(res, 25);
  });
}

/* ------------------------------- Sound Utils ------------------------------ */
function useBeep(muted) {
  const ctxRef = useRef(null);
  const ensure = () => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return ctxRef.current;
  };
  return (freq = 440, duration = 0.06, type = 'sine', volume = 0.02) => {
    if (muted) return;
    const ctx = ensure();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + duration + 0.02);
  };
}
function successChord(beep) {
  beep(523.25, 0.08, 'sine', 0.03); // C5
  setTimeout(() => beep(659.25, 0.08, 'sine', 0.03), 80); // E5
  setTimeout(() => beep(783.99, 0.1, 'sine', 0.03), 160); // G5
}

/* --------------------------- Sorting Algorithms --------------------------- */
async function bubbleSort(arr, setArray, setHi, tick, sounds={}) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      setHi([j, j + 1]); sounds.onCompare?.(); await tick();
      if (arr[j] > arr[j + 1]) { [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; setArray([...arr]); sounds.onSwap?.(); }
    }
  }
  setHi([]); return arr;
}
async function insertionSort(arr, setArray, setHi, tick, sounds={}) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i]; let j = i - 1;
    while (j >= 0 && arr[j] > key) { setHi([j, j + 1]); sounds.onCompare?.(); await tick(); arr[j + 1] = arr[j]; setArray([...arr]); sounds.onSwap?.(); j--; }
    arr[j + 1] = key; setArray([...arr]); await tick();
  }
  setHi([]); return arr;
}
async function selectionSort(arr, setArray, setHi, tick, sounds={}) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) { setHi([min, j]); sounds.onCompare?.(); await tick(); if (arr[j] < arr[min]) min = j; }
    if (min !== i) { [arr[i], arr[min]] = [arr[min], arr[i]]; setArray([...arr]); sounds.onSwap?.(); await tick(); }
  }
  setHi([]); return arr;
}
async function mergeSort(arr, setArray, setHi, tick, sounds={}, l = 0, r = arr.length - 1) {
  if (l >= r) return arr;
  const m = Math.floor((l + r) / 2);
  await mergeSort(arr, setArray, setHi, tick, sounds, l, m);
  await mergeSort(arr, setArray, setHi, tick, sounds, m + 1, r);
  const left = arr.slice(l, m + 1); const right = arr.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;
  while (i < left.length && j < right.length) {
    setHi([l + i, m + 1 + j]); sounds.onCompare?.(); await tick();
    if (left[i] <= right[j]) arr[k++] = left[i++]; else arr[k++] = right[j++];
    setArray([...arr]); sounds.onSwap?.();
  }
  while (i < left.length) { arr[k++] = left[i++]; setArray([...arr]); sounds.onSwap?.(); await tick(); }
  while (j < right.length) { arr[k++] = right[j++]; setArray([...arr]); sounds.onSwap?.(); await tick(); }
  return arr;
}
async function quickSort(arr, setArray, setHi, tick, setPivotIdx, sounds={}, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr;
  const p = await partition(arr, setArray, setHi, tick, setPivotIdx, sounds, lo, hi);
  await quickSort(arr, setArray, setHi, tick, setPivotIdx, sounds, lo, p - 1);
  await quickSort(arr, setArray, setHi, tick, setPivotIdx, sounds, p + 1, hi);
  return arr;
}
async function partition(arr, setArray, setHi, tick, setPivotIdx, sounds, lo, hi) {
  const pivot = arr[hi]; setPivotIdx(hi); let i = lo;
  for (let j = lo; j < hi; j++) { setHi([j, hi]); sounds.onCompare?.(); await tick(); if (arr[j] < pivot) { [arr[i], arr[j]] = [arr[j], arr[i]]; setArray([...arr]); sounds.onSwap?.(); i++; } }
  [arr[i], arr[hi]] = [arr[hi], arr[i]]; setArray([...arr]); sounds.onSwap?.(); await tick(); setPivotIdx(-1); return i;
}

/* --------------------------- Searching Algorithms ------------------------- */
async function linearSearch(arr, target, setHi, tick, sounds={}) {
  for (let i = 0; i < arr.length; i++) { setHi([i]); sounds.onProbe?.(); await tick(); if (arr[i] === target) return i; }
  return -1;
}
async function binarySearch(arr, target, setHi, tick, sounds={}) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2); setHi([mid]); sounds.onProbe?.(); await tick();
    if (arr[mid] === target) return mid; if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return -1;
}
