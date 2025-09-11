import { useEffect, useState } from "react";

export default function useResponsiveGrid() {
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
