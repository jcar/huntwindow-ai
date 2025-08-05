// src/lib/moon.ts
export function getMoonPhase(date: Date): number {
  const lp = 2551443; // Lunar period (in seconds)
  const now = date.getTime() / 1000; // seconds since Unix epoch
  const newMoon = new Date("2001-01-01T00:00:00Z").getTime() / 1000; // known new moon
  const phase = ((now - newMoon) % lp) / lp;

  return phase < 0 ? phase + 1 : phase;
}

export function getMoonPhaseName(phase: number): string {
  if (phase < 0.03 || phase > 0.97) return "New Moon";
  if (phase < 0.22) return "Waxing Crescent";
  if (phase < 0.28) return "First Quarter";
  if (phase < 0.47) return "Waxing Gibbous";
  if (phase < 0.53) return "Full Moon";
  if (phase < 0.72) return "Waning Gibbous";
  if (phase < 0.78) return "Last Quarter";
  return "Waning Crescent";
}