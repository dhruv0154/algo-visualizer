// src/pages/PathfindingPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { Header } from "../components/Header";
import Controls from "../components/Controls";
import Button from "../components/Button";
import { useBeep, successChord } from "../utils/soundUtils";
import { createInitialGrid } from "../utils/gridUtils";
import { bfsPath, dfsPath, dijkstraPath, aStarPath } from "../utils/algorithms";

const ALGORITHMS = [
  "Breadth-First Search (BFS)",
  "Depth-First Search (DFS)",
  "Dijkstra",
  "A* (A-Star)",
];

const PSEUDOCODE = {
  "Breadth-First Search (BFS)": [
    "init queue with start",
    "pop queue",
    "mark visited",
    "enqueue neighbors",
    "reconstruct path",
    "mark path step",
    "no path",
    "done",
  ],
  "Depth-First Search (DFS)": [
    "init stack with start",
    "pop stack",
    "mark visited",
    "push neighbors",
    "reconstruct path",
    "mark path step",
    "no path",
    "done",
  ],
  Dijkstra: [
    "init distances & pq",
    "pop smallest",
    "mark visited",
    "relax neighbours",
    "reconstruct path",
    "mark path step",
    "no path",
    "done",
  ],
  "A* (A-Star)": [
    "init g/f scores & open set",
    "pop lowest f",
    "mark visited",
    "relax neighbours (with heuristic)",
    "reconstruct path",
    "mark path step",
    "no path",
    "done",
  ],
};

const DESCRIPTIONS = {
  "Breadth-First Search (BFS)": {
    title: "Breadth-First Search (BFS)",
    overview:
      "BFS expands nodes in layers from the start. In uniform-cost grids (each move costs 1) it finds the shortest path and explores uniformly outward.",
    history:
      "Published in early algorithm texts; BFS is standard for shortest-path in unweighted graphs, level-order traversals, and reachability.",
    complexity: { time: "O(V + E)", space: "O(V)" },
    code: `queue = [start]
visited.add(start)
while queue:
  cur = queue.shift()
  if cur == goal: break
  for n in neighbors(cur):
    if not visited.has(n) and not isWall(n):
      visited.add(n)
      prev[n] = cur
      queue.push(n)`,
    resources: [
      { label: "Visually: BFS (YouTube)", href: "https://www.youtube.com/watch?v=oDqjPvD54Ss" },
      { label: "BFS — Wikipedia", href: "https://en.wikipedia.org/wiki/Breadth-first_search" },
    ],
  },
  "Depth-First Search (DFS)": {
    title: "Depth-First Search (DFS)",
    overview:
      "DFS follows one path as deep as possible before backtracking. It is great for full explorations and maze-style behavior, but does not guarantee shortest path.",
    history:
      "DFS underpins many algorithms (topological sort, SCCs). The traversal is simple but neighbor ordering heavily impacts traversal shape.",
    complexity: { time: "O(V + E)", space: "O(V)" },
    code: `stack = [start]
visited.add(start)
while stack:
  cur = stack.pop()
  if cur == goal: break
  for n in neighbors(cur):
    if not visited.has(n) and not isWall(n):
      visited.add(n)
      prev[n] = cur
      stack.push(n)`,
    resources: [
      { label: "DFS overview (YouTube)", href: "https://www.youtube.com/watch?v=Urx87-NMm6c" },
      { label: "DFS — Wikipedia", href: "https://en.wikipedia.org/wiki/Depth-first_search" },
    ],
  },
  Dijkstra: {
    title: "Dijkstra",
    overview:
      "Dijkstra computes shortest paths on non-negative weighted graphs using a min-priority queue. It generalizes BFS to weighted costs.",
    history:
      "Introduced by Edsger W. Dijkstra (1959). Used extensively in routing and path planning.",
    complexity: { time: "O((V + E) log V)", space: "O(V)" },
    code: `dist[start] = 0
pq.push([0, start])
while pq:
  d, cur = pq.pop()
  if cur == goal: break
  for n in neighbors(cur):
    alt = d + cost(cur, n)
    if alt < dist[n]:
      dist[n] = alt
      prev[n] = cur
      pq.push([alt, n])`,
    resources: [
      { label: "Dijkstra explained (YouTube)", href: "https://www.youtube.com/watch?v=bZkzH5x0SKU" },
      { label: "Dijkstra — Wikipedia", href: "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm" },
    ],
  },
  "A* (A-Star)": {
    title: "A* (A-Star)",
    overview:
      "A* prioritizes nodes by f = g + h, where g is cost so far and h is a heuristic estimate to the goal. With an admissible heuristic A* is optimal and usually faster than Dijkstra for goal-directed searches.",
    history:
      "Formalized in the late 1960s (Hart, Nilsson, Raphael). Standard in AI and game pathfinding.",
    complexity: { time: "Varies; worst-case like Dijkstra", space: "O(V)" },
    code: `g[start] = 0
f[start] = h(start)
open.push([f[start], start])
while open:
  f, cur = open.pop()
  if cur == goal: break
  for n in neighbors(cur):
    tentative = g[cur] + cost(cur, n)
    if tentative < g[n]:
      g[n] = tentative
      f[n] = tentative + h(n)
      prev[n] = cur
      open.push([f[n], n])`,
    resources: [
      { label: "A* explained (YouTube)", href: "https://www.youtube.com/watch?v=kEY1OxOj_CY" },
      { label: "A* — Wikipedia", href: "https://en.wikipedia.org/wiki/A*_search_algorithm" },
    ],
  },
};

export default function PathfindingPage({ muted }) {
  // Fixed smaller grid for clearer cells that fill the panel
  const rows = 22;
  const cols = 42;

  const [grid, setGrid] = useState(() => createInitialGrid(rows, cols));
  const [running, setRunning] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [speed, setSpeed] = useState(18);
  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const [start, setStart] = useState({ r: Math.floor(rows / 2), c: Math.floor(cols / 6) });
  const [end, setEnd] = useState({ r: Math.floor(rows / 2), c: Math.floor((cols * 5) / 6) });
  const [dragging, setDragging] = useState(null);
  const [algorithm, setAlgorithm] = useState(ALGORITHMS[0]);
  const [currentLine, setCurrentLine] = useState(null);
  const [tab, setTab] = useState("Overview");

  const beep = useBeep(muted);

  useEffect(() => {
    setGrid(createInitialGrid(rows, cols));
  }, [rows, cols]);

  function toggleWall(r, c) {
    setGrid((g) =>
      g.map((row, ri) =>
        row.map((cell, ci) => (ri === r && ci === c ? { ...cell, wall: !cell.wall } : cell))
      )
    );
  }

  function clearWalls() {
    if (running) return;
    setGrid((g) => g.map((row) => row.map((cell) => ({ ...cell, wall: false }))));
  }

  function clearPath() {
    if (running) return;
    setGrid((g) => g.map((row) => row.map((cell) => ({ ...cell, visited: false, inPath: false }))));
  }

  function resetGrid() {
    if (running) return;
    setGrid(createInitialGrid(rows, cols));
  }

  const markVisited = (r, c) =>
    new Promise((res) => {
      setGrid((g) => {
        const copy = g.map((row) => row.slice());
        copy[r][c] = { ...copy[r][c], visited: true };
        return copy;
      });
      setTimeout(res, Math.max(1, speedRef.current));
    });

  const markPath = (r, c) =>
    new Promise((res) => {
      setGrid((g) => {
        const copy = g.map((row) => row.slice());
        copy[r][c] = { ...copy[r][c], inPath: true };
        return copy;
      });
      setTimeout(res, 30);
    });

  const isWall = (r, c) => grid[r][c].wall;

  const tick = () => new Promise((r) => setTimeout(r, Math.max(1, speedRef.current)));

  async function visualize() {
    if (running) return;
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        fetch('http://localhost:5000/log-activity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, type: 'Pathfinding', name: algorithm })
        }).catch(e => console.error(e));
    }
    setRunning(true);
    clearPath();
    setCurrentLine(null);

    const sounds = {
      onVisit: () => beep(560, 0.02, "square", 0.02),
      onPath: () => beep(720, 0.02, "sine", 0.02),
    };

    let ok = false;
    switch (algorithm) {
      case "Breadth-First Search (BFS)":
        ok = await bfsPath(grid, start, end, rows, cols, { markVisited, markPath, isWall }, tick, sounds, setCurrentLine);
        break;
      case "Depth-First Search (DFS)":
        ok = await dfsPath(grid, start, end, rows, cols, { markVisited, markPath, isWall }, tick, sounds, setCurrentLine);
        break;
      case "Dijkstra":
        ok = await dijkstraPath(grid, start, end, rows, cols, { markVisited, markPath, isWall }, tick, sounds, setCurrentLine);
        break;
      case "A* (A-Star)":
        ok = await aStarPath(grid, start, end, rows, cols, { markVisited, markPath, isWall }, tick, sounds, setCurrentLine);
        break;
      default:
        break;
    }

    if (ok) successChord(beep);
    setRunning(false);
    setCurrentLine(null);
  }

  // sizing logic: fixed visual height, cells auto-scale to fill horizontally
  const wrapperRef = useRef(null);
  const FIXED_HEIGHT = 420;
  const [cellSize, setCellSize] = useState(18);

  useEffect(() => {
    function computeSize() {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const style = getComputedStyle(wrapper);
      const padLeft = parseFloat(style.paddingLeft || 0);
      const padRight = parseFloat(style.paddingRight || 0);
      const availableWidth = Math.max(0, wrapper.clientWidth - padLeft - padRight);
      const availableHeight = FIXED_HEIGHT;
      const sizeW = availableWidth / cols;
      const sizeH = availableHeight / rows;
      const size = Math.max(8, Math.floor(Math.min(sizeW, sizeH)));
      setCellSize(size);
    }
    computeSize();
    window.addEventListener("resize", computeSize);
    return () => window.removeEventListener("resize", computeSize);
  }, [cols, rows]);

  const totalGridWidth = cols * cellSize;
  const totalGridHeight = rows * cellSize;
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: `${totalGridWidth}px`,
    height: `${totalGridHeight}px`,
  };

  const currentDescription = DESCRIPTIONS[algorithm];

  return (
    <section className="space-y-6 select-none">
      <Header title={algorithm} subtitle="Drag Start/End, paint walls, adjust speed, and visualize." />

      <Controls className="items-center">
        <div className="flex gap-2 items-center">
          <Button onClick={visualize} disabled={running} intent="primary">Visualize</Button>

          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={running}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm"
          >
            {ALGORITHMS.map((a) => <option key={a} className="bg-gray-800">{a}</option>)}
          </select>

          <Button onClick={clearWalls} disabled={running}>Clear Walls</Button>
          <Button onClick={clearPath} disabled={running}>Clear Path</Button>
          <Button onClick={resetGrid} disabled={running}>Reset Grid</Button>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400 mr-1">Speed</label>
          <input type="range" min={5} max={300} step={1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-40 accent-cyan-500" />
          <span className="text-xs text-gray-500 w-16 text-right">{speed}ms</span>
        </div>
      </Controls>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* pseudocode panel */}
        <div className="p-4 bg-white/5 border border-white/8 rounded-2xl shadow-sm">
          <div className="text-lg text-gray-200 font-semibold mb-3">Pseudocode</div>
          <div className="space-y-1 text-sm">
            {PSEUDOCODE[algorithm].map((line, i) => (
              <div key={i} className={`px-2 py-1 rounded-md ${currentLine === i ? "bg-cyan-600/20 text-cyan-200" : "text-gray-300"}`}>
                <span className="font-mono text-xs mr-2 text-gray-400">{i + 1}.</span>
                <span className="font-mono text-sm">{line}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-gray-400">
            Tip: Highlight follows the active execution step. Lower speed to inspect each step.
          </div>
        </div>

        {/* grid visualizer */}
        <div className="col-span-2">
          <div ref={wrapperRef} style={{ height: `${FIXED_HEIGHT}px` }} className="w-full h-full flex justify-center items-center">
            <div style={gridStyle} onMouseDown={() => setMouseDown(true)} onMouseUp={() => { setMouseDown(false); setDragging(null); }} onMouseLeave={() => { setMouseDown(false); setDragging(null); }}>
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  const isStart = r === start.r && c === start.c;
                  const isEnd = r === end.r && c === end.c;
                  const base = "border border-gray-800 flex items-center justify-center transition-all select-none";
                  const bg = cell.wall ? "bg-gray-800" : cell.inPath ? "bg-yellow-400 animate-pulse" : cell.visited ? "bg-cyan-600/60" : "bg-gray-900";
                  const special = isStart ? "bg-green-500 text-gray-900 font-bold" : isEnd ? "bg-red-500 text-gray-900 font-bold" : "";

                  const handleMouseDown = () => {
                    if (isStart) setDragging("start");
                    else if (isEnd) setDragging("end");
                    else toggleWall(r, c);
                  };

                  const handleMouseEnter = () => {
                    if (!mouseDown) return;
                    if (dragging === "start" && !cell.wall && !(r === end.r && c === end.c)) setStart({ r, c });
                    else if (dragging === "end" && !cell.wall && !(r === start.r && c === start.c)) setEnd({ r, c });
                    else if (!dragging && !isStart && !isEnd) toggleWall(r, c);
                  };

                  return (
                    <div
                      key={`${r}-${c}`}
                      style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                      className={`${base} ${bg} ${special}`}
                      onMouseDown={handleMouseDown}
                      onMouseEnter={handleMouseEnter}
                      title={isStart ? "Start" : isEnd ? "End" : ""}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* description / tabs */}
      <div className="p-4 bg-white/5 border border-white/8 rounded-2xl shadow-sm">
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
                className={`px-3 py-1 rounded-md text-sm ${tab === t ? "bg-cyan-600 text-black" : "bg-white/3 text-gray-200"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[120px]">
          {tab === "Overview" && (
            <div className="text-sm text-gray-200 space-y-3">
              <div><strong>History</strong>: {currentDescription.history}</div>
              <div><strong>When to use</strong>: Use BFS for unweighted shortest paths, DFS for exhaustive traversal and maze generation, Dijkstra for weighted shortest path, and A* when you have a heuristic that guides the search.</div>
              <div><strong>Practical tips</strong>: Lower speed for debugging, try different neighbor orders to see DFS variation, and use Manhattan heuristic on 4-neighbor grids for A*.</div>
            </div>
          )}

          {tab === "Complexity" && (
            <div className="text-sm text-gray-200">
              <div className="mb-2"><strong>Time</strong>: {currentDescription.complexity.time}</div>
              <div><strong>Space</strong>: {currentDescription.complexity.space}</div>
              <div className="mt-2 text-sm text-gray-400">Notes: V is number of nodes, E is edges. Grid graphs have E ≈ 4V for 4-neighbor connectivity.</div>
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
              <div className="text-xs text-gray-400 mt-2">Recommended sequence: BFS/DFS intuition videos → Dijkstra theory → A* heuristic examples.</div>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500">Tip: Drag start/end to move nodes. Click & drag to draw walls. Hold to paint multiple walls.</p>
    </section>
  );
}
