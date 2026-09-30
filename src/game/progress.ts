import { useCallback, useEffect, useState } from "react";
import { districts, levels, TOTAL_LOCALITIES } from "./data";

const KEY = "qvq-progress-v1";
export type Progress = {
  completed: Record<string, number>; // locality -> highest level passed
  best: Record<string, number>; // "locality|level" -> best score
  bestScore: number;
  muted: boolean;
  tutorialSeen: boolean;
};
const empty: Progress = { completed: {}, best: {}, bestScore: 0, muted: false, tutorialSeen: false };

const load = (): Progress => {
  try { return { ...empty, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return empty; }
};

export const useProgress = () => {
  const [p, setP] = useState<Progress>(load);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(p)); }, [p]);

  const update = useCallback((fn: (p: Progress) => Progress) => setP((prev) => fn(prev)), []);
  const record = useCallback((loc: string, level: number, score: number, passed: boolean) =>
    update((prev) => {
      const k = `${loc}|${level}`;
      return {
        ...prev,
        best: { ...prev.best, [k]: Math.max(prev.best[k] || 0, score) },
        bestScore: Math.max(prev.bestScore, score),
        completed: passed ? { ...prev.completed, [loc]: Math.max(prev.completed[loc] || 0, level) } : prev.completed,
      };
    }), [update]);
  const reset = useCallback(() => setP((prev) => ({ ...empty, muted: prev.muted, tutorialSeen: true })), []);

  const levelsCompleted = Object.values(p.completed).reduce((a, b) => a + b, 0);
  const mastered = Object.values(p.completed).filter((l) => l >= levels.length).length;
  const explored = districts.filter((d) => d.localities.some((l) => p.completed[l.name])).length;
  const districtMaster = districts.filter((d) => d.localities.every((l) => (p.completed[l.name] || 0) >= 1)).map((d) => d.id);
  const overall = Math.round((levelsCompleted / (TOTAL_LOCALITIES * levels.length)) * 100);

  return { p, update, record, reset, stats: { levelsCompleted, mastered, explored, districtMaster, overall } };
};
