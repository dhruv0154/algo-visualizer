import React, { useEffect, useRef, useState } from "react";
import { Header } from "../components/Header";
import Controls from "../components/Controls";
import Button from "../components/Button";
import { useBeep, successChord } from "../utils/soundUtils";
import useResponsiveGrid from "../hooks/useResponsiveGrid";
import { createInitialGrid, neighbors, key, markVisited, markPath } from "../utils/gridUtils";

export default function PathfindingPage({ muted }) {
  const { rows, cols } = useResponsiveGrid();
  const [grid, setGrid] = useState(() => createInitialGrid(rows, cols));
  const [running, setRunning] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [speed, setSpeed] = useState(15);
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const [start, setStart] = useState({ r: Math.floor(rows / 2), c: Math.floor(cols / 6) });
  const [end, setEnd] = useState({ r: Math.floor(rows / 2), c: Math.floor(cols * 5 / 6) });
  const [dragging, setDragging] = useState(null);
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
    const startKey = key(start.r, start.c);
    q.push(start); visited.add(startKey);

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
          <div className="pointer-events-none absolute" />
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
