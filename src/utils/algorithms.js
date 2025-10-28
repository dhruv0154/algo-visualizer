export function generateArray(n) {
  return Array.from({ length: n }, () => Math.floor(10 + Math.random() * 80));
}
export function generateSortedArray(n) {
  const arr = Array.from({ length: n }, () => Math.floor(1 + Math.random() * 80));
  arr.sort((a, b) => a - b);
  return arr;
}

export async function bubbleSort(arr, setArray, setHi, tick, sounds = {}, setCurrentLine) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    setCurrentLine?.(0); // for i = 0 to n-2
    for (let j = 0; j < n - i - 1; j++) {
      setCurrentLine?.(1); // inner loop
      setHi([j, j + 1]); sounds.onCompare?.(); await tick();
      setCurrentLine?.(2); // compare array[j] and array[j+1]
      if (arr[j] > arr[j + 1]) {
        setCurrentLine?.(3); // swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        setArray([...arr]); sounds.onSwap?.();
        await tick();
      }
    }
  }
  setHi([]); setCurrentLine?.(4); // done
  return arr;
}

export async function insertionSort(arr, setArray, setHi, tick, sounds = {}, setCurrentLine) {
  for (let i = 1; i < arr.length; i++) {
    setCurrentLine?.(0); // for i = 1 to n-1
    let key = arr[i];
    setCurrentLine?.(1); // key = array[i]
    let j = i - 1;
    setCurrentLine?.(2); // j = i - 1
    while (j >= 0 && arr[j] > key) {
      setCurrentLine?.(3); // while condition and shifting
      setHi([j, j + 1]); sounds.onCompare?.(); await tick();
      arr[j + 1] = arr[j];
      setArray([...arr]); sounds.onSwap?.();
      j--;
      await tick();
    }
    arr[j + 1] = key;
    setArray([...arr]);
    setCurrentLine?.(4); // place key
    await tick();
  }
  setHi([]); setCurrentLine?.(5); // done
  return arr;
}

export async function selectionSort(arr, setArray, setHi, tick, sounds = {}, setCurrentLine) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    setCurrentLine?.(0); // for i = 0 to n-2
    let min = i;
    setCurrentLine?.(1); // min = i
    for (let j = i + 1; j < n; j++) {
      setCurrentLine?.(2); // inner loop
      setHi([min, j]); sounds.onCompare?.(); await tick();
      setCurrentLine?.(3); // compare array[j] < array[min]
      if (arr[j] < arr[min]) min = j;
    }
    if (min !== i) {
      setCurrentLine?.(4); // swap
      [arr[i], arr[min]] = [arr[min], arr[i]];
      setArray([...arr]); sounds.onSwap?.();
      await tick();
    }
  }
  setHi([]); setCurrentLine?.(5); // done
  return arr;
}

export async function mergeSort(arr, setArray, setHi, tick, sounds = {}, setCurrentLine, l = 0, r = null) {
  if (r === null) r = arr.length - 1;
  if (l >= r) return arr;
  setCurrentLine?.(0); // mergeSort(l, r)
  const m = Math.floor((l + r) / 2);
  setCurrentLine?.(1); // m = floor((l + r)/2)
  await mergeSort(arr, setArray, setHi, tick, sounds, setCurrentLine, l, m);
  await mergeSort(arr, setArray, setHi, tick, sounds, setCurrentLine, m + 1, r);

  // Merge step
  setCurrentLine?.(2); // merging left and right
  const left = arr.slice(l, m + 1);
  const right = arr.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;
  while (i < left.length && j < right.length) {
    setHi([l + i, m + 1 + j]); sounds.onCompare?.(); await tick();
    if (left[i] <= right[j]) arr[k++] = left[i++]; else arr[k++] = right[j++];
    setArray([...arr]); sounds.onSwap?.();
    await tick();
  }
  while (i < left.length) {
    arr[k++] = left[i++];
    setArray([...arr]); sounds.onSwap?.();
    await tick();
  }
  while (j < right.length) {
    arr[k++] = right[j++];
    setArray([...arr]); sounds.onSwap?.();
    await tick();
  }
  setHi([]); setCurrentLine?.(3); // merged
  return arr;
}

export async function quickSort(arr, setArray, setHi, tick, setPivotIdx, sounds = {}, setCurrentLine, lo = 0, hi = null) {
  if (hi === null) hi = arr.length - 1;
  setCurrentLine?.(0); // quickSort(lo, hi)
  if (lo >= hi) {
    setCurrentLine?.(1); // if lo >= hi return
    return arr;
  }
  setCurrentLine?.(2); // p = partition(lo, hi)
  const p = await partition(arr, setArray, setHi, tick, setPivotIdx, sounds, setCurrentLine, lo, hi);
  setCurrentLine?.(3); // quickSort(lo, p-1)
  await quickSort(arr, setArray, setHi, tick, setPivotIdx, sounds, setCurrentLine, lo, p - 1);
  setCurrentLine?.(4); // quickSort(p+1, hi)
  await quickSort(arr, setArray, setHi, tick, setPivotIdx, sounds, setCurrentLine, p + 1, hi);
  setCurrentLine?.(0); // back to function line (finished)
  return arr;
}

async function partition(arr, setArray, setHi, tick, setPivotIdx, sounds, setCurrentLine, lo, hi) {
  setCurrentLine?.(5); // partition(lo, hi):
  const pivot = arr[hi];
  setCurrentLine?.(6); // pivot = arr[hi]
  setPivotIdx(hi);
  let i = lo;
  setCurrentLine?.(7); // i = lo
  for (let j = lo; j < hi; j++) {
    setCurrentLine?.(8); // for j = lo to hi-1
    setHi([j, hi]);
    setCurrentLine?.(9); // compare arr[j] with pivot
    sounds.onCompare?.(); await tick();
    if (arr[j] < pivot) {
      setCurrentLine?.(10); // if arr[j] < pivot swap
      [arr[i], arr[j]] = [arr[j], arr[i]];
      setArray([...arr]); sounds.onSwap?.();
      i++;
      await tick();
    }
  }
  setCurrentLine?.(10); // swap arr[i] and arr[hi]; return i
  [arr[i], arr[hi]] = [arr[hi], arr[i]];
  setArray([...arr]); sounds.onSwap?.();
  await tick();
  setPivotIdx(-1);
  setHi([]); 
  return i;
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