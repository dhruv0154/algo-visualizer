export function createInitialGrid(rows, cols) {
  return Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => ({ r, c, wall: false, visited: false, inPath: false })));
}
export function neighbors(r, c, rows, cols) {
  const ds = [[1,0],[-1,0],[0,1],[0,-1]]; const out = [];
  for (const [dr, dc] of ds) { const nr = r + dr, nc = c + dc; if (nr>=0&&nr<rows&&nc>=0&&nc<cols) out.push([nr,nc]); }
  return out;
}
export function key(r, c) { return `${r},${c}`; }

export function markVisited(r, c, setGrid, getSpeed) {
  return new Promise((res) => {
    setGrid((g) => { const copy = g.map((row) => row.slice()); copy[r][c] = { ...copy[r][c], visited: true }; return copy; });
    setTimeout(res, Math.max(1, getSpeed()));
  });
}
export function markPath(r, c, setGrid) {
  return new Promise((res) => {
    setGrid((g) => { const copy = g.map((row) => row.slice()); copy[r][c] = { ...copy[r][c], inPath: true }; return copy; });
    setTimeout(res, 25);
  });
}
