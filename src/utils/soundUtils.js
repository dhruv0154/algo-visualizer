export function useBeep(muted) {
  const ctxRef = { current: null };

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

export function successChord(beep) {
  beep(523.25, 0.08, 'sine', 0.03); // C5
  setTimeout(() => beep(659.25, 0.08, 'sine', 0.03), 80); // E5
  setTimeout(() => beep(783.99, 0.1, 'sine', 0.03), 160); // G5
}
