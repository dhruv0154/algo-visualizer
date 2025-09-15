export function generateArray(n) { return Array.from({ length: n }, () => Math.floor(10 + Math.random() * 90)); }
export function generateSortedArray(n) { const arr = Array.from({ length: n }, () => Math.floor(1 + Math.random() * 99)); arr.sort((a,b)=>a-b); return arr; }

/* Sorting algorithms */
export async function bubbleSort(arr, setArray, setHi, tick, sounds={}) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      setHi([j, j + 1]); sounds.onCompare?.(); await tick();
      if (arr[j] > arr[j + 1]) { [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; setArray([...arr]); sounds.onSwap?.(); }
    }
  }
  setHi([]); return arr;
}

export async function insertionSort(arr, setArray, setHi, tick, sounds={}) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i]; let j = i - 1;
    while (j >= 0 && arr[j] > key) { setHi([j, j + 1]); sounds.onCompare?.(); await tick(); arr[j + 1] = arr[j]; setArray([...arr]); sounds.onSwap?.(); j--; }
    arr[j + 1] = key; setArray([...arr]); await tick();
  }
  setHi([]); return arr;
}

export async function selectionSort(arr, setArray, setHi, tick, sounds={}) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) { setHi([min, j]); sounds.onCompare?.(); await tick(); if (arr[j] < arr[min]) min = j; }
    if (min !== i) { [arr[i], arr[min]] = [arr[min], arr[i]]; setArray([...arr]); sounds.onSwap?.(); await tick(); }
  }
  setHi([]); return arr;
}

export async function mergeSort(arr, setArray, setHi, tick, sounds={}, l = 0, r = arr.length - 1) {
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

export async function quickSort(arr, setArray, setHi, tick, setPivotIdx, sounds={}, lo = 0, hi = arr.length - 1) {
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

export async function linearSearch(arr, target, setHi, tick, sounds = {}, setCurrentLine) {
  for (let i = 0; i < arr.length; i++) {
    setCurrentLine?.(0); // for i = 0 to n-1
    setHi([i]);
    sounds.onProbe?.();
    await tick();

    setCurrentLine?.(1); // probe array[i]
    await tick();

    if (arr[i] === target) {
      setCurrentLine?.(2); // if array[i] == target then return i
      await tick();
      return i;
    }
  }
  setCurrentLine?.(4); // return -1
  return -1;
}

export async function binarySearch(arr, target, setHi, tick, sounds = {}, setCurrentLine) {
  let lo = 0, hi = arr.length - 1;

  setCurrentLine?.(0); // low = 0, high = n - 1
  await tick();

  while (lo <= hi) {
    setCurrentLine?.(1); // while low <= high
    const mid = Math.floor((lo + hi) / 2);

    setCurrentLine?.(2); // mid = floor((low + high) / 2)
    setHi([mid]);
    sounds.onProbe?.();
    await tick();

    setCurrentLine?.(3); // probe array[mid]
    await tick();

    if (arr[mid] === target) {
      setCurrentLine?.(4); // if array[mid] == target then return mid
      await tick();
      return mid;
    } else if (arr[mid] < target) {
      setCurrentLine?.(5); // array[mid] < target then low = mid + 1
      lo = mid + 1;
      await tick();
    } else {
      setCurrentLine?.(6); // else high = mid - 1
      hi = mid - 1;
      await tick();
    }
  }
  setCurrentLine?.(8); // return -1
  return -1;
}