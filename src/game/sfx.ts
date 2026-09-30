let ctx: AudioContext | null = null;
const tone = (freq: number, start: number, dur: number) => {
  ctx ??= new AudioContext();
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = "sine"; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + start); o.stop(ctx.currentTime + start + dur + 0.05);
};
export const sfx = {
  tap: (m: boolean) => !m && tone(660, 0, 0.08),
  success: (m: boolean) => { if (m) return; [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.1, 0.25)); },
  retry: (m: boolean) => { if (m) return; tone(392, 0, 0.15); tone(330, 0.15, 0.25); },
};
