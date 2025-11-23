export function generateArray(n) {
  return Array.from({ length: n }, () => Math.floor(10 + Math.random() * 80));
}
export function generateSortedArray(n) {
  const arr = Array.from({ length: n }, () => Math.floor(1 + Math.random() * 80));
  arr.sort((a, b) => a - b);
  return arr;
}

async function safeSetLine(setCurrentLine, idx, tick) {
  if (!setCurrentLine) return;
  setCurrentLine(idx);
  await tick();
}


export async function bubbleSort(arr, setArray, setHi, tick, sounds = {}, setCurrentLine) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    await safeSetLine(setCurrentLine, 0, tick);
    for (let j = 0; j < n - i - 1; j++) {
      await safeSetLine(setCurrentLine, 1, tick);
      setHi([j, j + 1]); sounds.onCompare?.(); await tick();
      await safeSetLine(setCurrentLine, 2, tick);
      if (arr[j] > arr[j + 1]) {
        await safeSetLine(setCurrentLine, 3, tick);
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        setArray([...arr]); sounds.onSwap?.();
        await tick();
      }
    }
  }
  setHi([]); await safeSetLine(setCurrentLine, 4, tick);
  return arr;
}

export async function insertionSort(arr, setArray, setHi, tick, sounds = {}, setCurrentLine) {
  for (let i = 1; i < arr.length; i++) {
    await safeSetLine(setCurrentLine, 0, tick);
    let key = arr[i];
    await safeSetLine(setCurrentLine, 1, tick);
    let j = i - 1;
    await safeSetLine(setCurrentLine, 2, tick);
    while (j >= 0 && arr[j] > key) {
      await safeSetLine(setCurrentLine, 3, tick);
      setHi([j, j + 1]); sounds.onCompare?.(); await tick();
      arr[j + 1] = arr[j];
      setArray([...arr]); sounds.onSwap?.();
      j--;
      await tick();
    }
    arr[j + 1] = key;
    setArray([...arr]);
    await safeSetLine(setCurrentLine, 4, tick);
  }
  setHi([]); await safeSetLine(setCurrentLine, 5, tick);
  return arr;
}

export async function selectionSort(arr, setArray, setHi, tick, sounds = {}, setCurrentLine) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    await safeSetLine(setCurrentLine, 0, tick);
    let min = i;
    await safeSetLine(setCurrentLine, 1, tick);
    for (let j = i + 1; j < n; j++) {
      await safeSetLine(setCurrentLine, 2, tick);
      setHi([min, j]); sounds.onCompare?.(); await tick();
      await safeSetLine(setCurrentLine, 3, tick);
      if (arr[j] < arr[min]) min = j;
    }
    if (min !== i) {
      await safeSetLine(setCurrentLine, 4, tick);
      [arr[i], arr[min]] = [arr[min], arr[i]];
      setArray([...arr]); sounds.onSwap?.();
      await tick();
    }
  }
  setHi([]); await safeSetLine(setCurrentLine, 5, tick);
  return arr;
}

export async function mergeSort(arr, setArray, setHi, tick, sounds = {}, setCurrentLine, l = 0, r = null) {
  if (r === null) r = arr.length - 1;
  if (l >= r) return arr;
  await safeSetLine(setCurrentLine, 0, tick);
  const m = Math.floor((l + r) / 2);
  await safeSetLine(setCurrentLine, 1, tick);
  await mergeSort(arr, setArray, setHi, tick, sounds, setCurrentLine, l, m);
  await mergeSort(arr, setArray, setHi, tick, sounds, setCurrentLine, m + 1, r);

  await safeSetLine(setCurrentLine, 2, tick);
  const left = arr.slice(l, m + 1);
  const right = arr.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;
  while (i < left.length && j < right.length) {
    setHi([l + i, m + 1 + j]); sounds.onCompare?.(); await tick();
    if (left[i] <= right[j]) arr[k++] = left[i++]; else arr[k++] = right[j++];
    setArray([...arr]); sounds.onSwap?.(); await tick();
  }
  while (i < left.length) { arr[k++] = left[i++]; setArray([...arr]); sounds.onSwap?.(); await tick(); }
  while (j < right.length) { arr[k++] = right[j++]; setArray([...arr]); sounds.onSwap?.(); await tick(); }
  setHi([]); await safeSetLine(setCurrentLine, 3, tick);
  return arr;
}

export async function quickSort(arr, setArray, setHi, tick, setPivotIdx, sounds = {}, setCurrentLine, lo = 0, hi = null) {
  if (hi === null) hi = arr.length - 1;
  await safeSetLine(setCurrentLine, 0, tick);
  if (lo >= hi) { await safeSetLine(setCurrentLine, 1, tick); return arr; }
  await safeSetLine(setCurrentLine, 2, tick);
  const p = await partition(arr, setArray, setHi, tick, setPivotIdx, sounds, setCurrentLine, lo, hi);
  await safeSetLine(setCurrentLine, 3, tick);
  await quickSort(arr, setArray, setHi, tick, setPivotIdx, sounds, setCurrentLine, lo, p - 1);
  await safeSetLine(setCurrentLine, 4, tick);
  await quickSort(arr, setArray, setHi, tick, setPivotIdx, sounds, setCurrentLine, p + 1, hi);
  await safeSetLine(setCurrentLine, 5, tick);
  return arr;
}
async function partition(arr, setArray, setHi, tick, setPivotIdx, sounds, setCurrentLine, lo, hi) {
  await safeSetLine(setCurrentLine, 6, tick);
  const pivot = arr[hi]; await safeSetLine(setCurrentLine, 7, tick);
  setPivotIdx(hi);
  let i = lo; await safeSetLine(setCurrentLine, 8, tick);
  for (let j = lo; j < hi; j++) {
    await safeSetLine(setCurrentLine, 9, tick);
    setHi([j, hi]); await safeSetLine(setCurrentLine, 10, tick);
    sounds.onCompare?.(); await tick();
    if (arr[j] < pivot) {
      await safeSetLine(setCurrentLine, 11, tick);
      [arr[i], arr[j]] = [arr[j], arr[i]];
      setArray([...arr]); sounds.onSwap?.(); i++; await tick();
    }
  }
  await safeSetLine(setCurrentLine, 12, tick);
  [arr[i], arr[hi]] = [arr[hi], arr[i]]; setArray([...arr]); sounds.onSwap?.(); await tick();
  setPivotIdx(-1); setHi([]);
  return i;
}


export async function linearSearch(arr, target, setHi, tick, sounds = {}, setCurrentLine) {
  for (let i = 0; i < arr.length; i++) {
    await safeSetLine(setCurrentLine, 0, tick);
    setHi([i]); sounds.onProbe?.(); await tick();
    await safeSetLine(setCurrentLine, 1, tick);
    await tick();
    if (arr[i] === target) { await safeSetLine(setCurrentLine, 2, tick); return i; }
  }
  await safeSetLine(setCurrentLine, 4, tick);
  return -1;
}

export async function binarySearch(arr, target, setHi, tick, sounds = {}, setCurrentLine) {
  let lo = 0, hi = arr.length - 1;
  await safeSetLine(setCurrentLine, 0, tick);
  while (lo <= hi) {
    await safeSetLine(setCurrentLine, 1, tick);
    const mid = Math.floor((lo + hi) / 2);
    await safeSetLine(setCurrentLine, 2, tick);
    setHi([mid]); sounds.onProbe?.(); await tick();
    await safeSetLine(setCurrentLine, 3, tick);
    if (arr[mid] === target) { await safeSetLine(setCurrentLine, 4, tick); return mid; }
    else if (arr[mid] < target) { await safeSetLine(setCurrentLine, 5, tick); lo = mid + 1; await tick(); }
    else { await safeSetLine(setCurrentLine, 6, tick); hi = mid - 1; await tick(); }
  }
  await safeSetLine(setCurrentLine, 8, tick);
  return -1;
}


function key(r, c) { return `${r},${c}`; }

export async function bfsPath(grid, start, end, rows, cols, { markVisited, markPath, isWall }, tick, sounds = {}, setCurrentLine) {
  await safeSetLine(setCurrentLine, 0, tick);
  const visited = new Set(); const prev = new Map(); const q = [];
  q.push(start); visited.add(key(start.r, start.c));
  while (q.length) {
    await safeSetLine(setCurrentLine, 1, tick);
    const cur = q.shift();
    if (!(cur.r === start.r && cur.c === start.c)) { await safeSetLine(setCurrentLine, 2, tick); await markVisited(cur.r, cur.c); sounds.onVisit?.(); }
    if (cur.r === end.r && cur.c === end.c) break;
    await safeSetLine(setCurrentLine, 3, tick);
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const r = cur.r + dr, c = cur.c + dc;
      if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
      if (visited.has(key(r,c))) continue;
      if (isWall(r,c)) continue;
      visited.add(key(r,c)); prev.set(key(r,c), key(cur.r, cur.c)); q.push({ r, c });
    }
  }
  await safeSetLine(setCurrentLine, 4, tick);
  // reconstruct
  const path = []; let curKey = key(end.r, end.c);
  if (!prev.has(curKey) && curKey !== key(start.r, start.c)) { await safeSetLine(setCurrentLine, 6, tick); return false; }
  while (curKey !== key(start.r, start.c)) { const [r, c] = curKey.split(",").map(Number); path.push({ r, c }); curKey = prev.get(curKey); if (!curKey) break; }
  for (let i = path.length - 1; i >= 0; i--) { await safeSetLine(setCurrentLine, 5, tick); await markPath(path[i].r, path[i].c); sounds.onPath?.(); }
  await safeSetLine(setCurrentLine, 7, tick);
  return true;
}

export async function dfsPath(grid, start, end, rows, cols, { markVisited, markPath, isWall }, tick, sounds = {}, setCurrentLine) {
  await safeSetLine(setCurrentLine, 0, tick);
  const visited = new Set(); const prev = new Map(); const stack = [start];
  visited.add(key(start.r, start.c));
  while (stack.length) {
    await safeSetLine(setCurrentLine, 1, tick);
    const cur = stack.pop();
    if (!(cur.r === start.r && cur.c === start.c)) { await safeSetLine(setCurrentLine, 2, tick); await markVisited(cur.r, cur.c); sounds.onVisit?.(); }
    if (cur.r === end.r && cur.c === end.c) break;
    await safeSetLine(setCurrentLine, 3, tick);
    for (const [dr, dc] of [[0,1],[1,0],[0,-1],[-1,0]]) {
      const r = cur.r + dr, c = cur.c + dc;
      if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
      if (visited.has(key(r,c))) continue;
      if (isWall(r,c)) continue;
      visited.add(key(r,c)); prev.set(key(r,c), key(cur.r, cur.c)); stack.push({ r, c });
    }
  }
  await safeSetLine(setCurrentLine, 4, tick);
  const path = []; let curKey = key(end.r, end.c);
  if (!prev.has(curKey) && curKey !== key(start.r, start.c)) { await safeSetLine(setCurrentLine, 6, tick); return false; }
  while (curKey !== key(start.r, start.c)) { const [r, c] = curKey.split(",").map(Number); path.push({ r, c }); curKey = prev.get(curKey); if (!curKey) break; }
  for (let i = path.length - 1; i >= 0; i--) { await safeSetLine(setCurrentLine, 5, tick); await markPath(path[i].r, path[i].c); sounds.onPath?.(); }
  await safeSetLine(setCurrentLine, 7, tick);
  return true;
}

// Simple min-heap storing [priority, payload]
class MinHeap {
  constructor() { this.data = []; }
  push(item) { this.data.push(item); this._siftUp(); }
  pop() { if (!this.data.length) return null; const top = this.data[0]; const end = this.data.pop(); if (this.data.length) { this.data[0] = end; this._siftDown(); } return top; }
  _siftUp() { let idx = this.data.length - 1; const el = this.data[idx]; while (idx > 0) { const p = Math.floor((idx - 1) / 2); if (this.data[p][0] <= el[0]) break; this.data[idx] = this.data[p]; idx = p; } this.data[idx] = el; }
  _siftDown() { let idx = 0; const len = this.data.length; const el = this.data[0]; while (true) { let left = 2 * idx + 1; let right = left + 1; let swap = -1; if (left < len && this.data[left][0] < el[0]) swap = left; if (right < len && this.data[right][0] < (swap === -1 ? el[0] : this.data[left][0])) swap = right; if (swap === -1) break; this.data[idx] = this.data[swap]; idx = swap; } this.data[idx] = el; }
}

export async function dijkstraPath(grid, start, end, rows, cols, { markVisited, markPath, isWall }, tick, sounds = {}, setCurrentLine) {
  await safeSetLine(setCurrentLine, 0, tick);
  const dist = new Map(); const prev = new Map(); const pq = new MinHeap();
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) dist.set(key(r,c), Infinity);
  dist.set(key(start.r, start.c), 0); pq.push([0, start]);
  while (true) {
    await safeSetLine(setCurrentLine, 1, tick);
    const top = pq.pop(); if (!top) break;
    const [d, cur] = top; const k = key(cur.r, cur.c);
    if (d > dist.get(k)) continue;
    if (!(cur.r === start.r && cur.c === start.c)) { await safeSetLine(setCurrentLine, 2, tick); await markVisited(cur.r, cur.c); sounds.onVisit?.(); }
    if (cur.r === end.r && cur.c === end.c) break;
    await safeSetLine(setCurrentLine, 3, tick);
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const r = cur.r + dr, c = cur.c + dc; if (r < 0 || r >= rows || c < 0 || c >= cols) continue; if (isWall(r,c)) continue;
      const alt = d + 1; const k2 = key(r,c);
      if (alt < dist.get(k2)) { dist.set(k2, alt); prev.set(k2, k); pq.push([alt, { r, c }]); }
    }
  }
  await safeSetLine(setCurrentLine, 4, tick);
  const path = []; let curKey = key(end.r, end.c);
  if (!prev.has(curKey) && curKey !== key(start.r, start.c)) { await safeSetLine(setCurrentLine, 6, tick); return false; }
  while (curKey !== key(start.r, start.c)) { const [r, c] = curKey.split(",").map(Number); path.push({ r, c }); curKey = prev.get(curKey); if (!curKey) break; }
  for (let i = path.length - 1; i >= 0; i--) { await safeSetLine(setCurrentLine, 5, tick); await markPath(path[i].r, path[i].c); sounds.onPath?.(); }
  await safeSetLine(setCurrentLine, 7, tick);
  return true;
}

function manhattan(a, b) { return Math.abs(a.r - b.r) + Math.abs(a.c - b.c); }

export async function aStarPath(grid, start, end, rows, cols, { markVisited, markPath, isWall }, tick, sounds = {}, setCurrentLine) {
  await safeSetLine(setCurrentLine, 0, tick);
  const gScore = new Map(); const fScore = new Map(); const prev = new Map(); const open = new MinHeap();
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { gScore.set(key(r,c), Infinity); fScore.set(key(r,c), Infinity); }
  gScore.set(key(start.r, start.c), 0); fScore.set(key(start.r, start.c), manhattan(start, end));
  open.push([fScore.get(key(start.r, start.c)), start]);
  const openSet = new Set([key(start.r, start.c)]);
  while (true) {
    await safeSetLine(setCurrentLine, 1, tick);
    const top = open.pop(); if (!top) break;
    const [f, cur] = top; openSet.delete(key(cur.r, cur.c));
    if (!(cur.r === start.r && cur.c === start.c)) { await safeSetLine(setCurrentLine, 2, tick); await markVisited(cur.r, cur.c); sounds.onVisit?.(); }
    if (cur.r === end.r && cur.c === end.c) break;
    await safeSetLine(setCurrentLine, 3, tick);
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const r = cur.r + dr, c = cur.c + dc; if (r < 0 || r >= rows || c < 0 || c >= cols) continue; if (isWall(r,c)) continue;
      const tentative = gScore.get(key(cur.r, cur.c)) + 1; const k2 = key(r,c);
      if (tentative < gScore.get(k2)) {
        prev.set(k2, key(cur.r, cur.c)); gScore.set(k2, tentative);
        const fnew = tentative + manhattan({ r, c }, end); fScore.set(k2, fnew);
        if (!openSet.has(k2)) { open.push([fnew, { r, c }]); openSet.add(k2); }
      }
    }
  }
  await safeSetLine(setCurrentLine, 4, tick);
  const path = []; let curKey = key(end.r, end.c);
  if (!prev.has(curKey) && curKey !== key(start.r, start.c)) { await safeSetLine(setCurrentLine, 6, tick); return false; }
  while (curKey !== key(start.r, start.c)) { const [r, c] = curKey.split(",").map(Number); path.push({ r, c }); curKey = prev.get(curKey); if (!curKey) break; }
  for (let i = path.length - 1; i >= 0; i--) { await safeSetLine(setCurrentLine, 5, tick); await markPath(path[i].r, path[i].c); sounds.onPath?.(); }
  await safeSetLine(setCurrentLine, 7, tick);
  return true;
}