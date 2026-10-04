import { useCallback, useEffect, useMemo, useState } from "react";
import { CONFIG, levels, Level } from "./data";

const KEY = "qq-progress-v1";
export type QuestProgress = {
  best: Record<number, number>; // level -> best stars (0-3)
  gatesUnlocked: number[]; gatesCompleted: number[];
  answered: number; correct: number; wordCorrect: number; cityCorrect: number;
  perfectRun: number; maxPerfectRun: number;
  streak: number; lastPlayed: string; achievements: string[]; frame: string;
};
const empty: QuestProgress = { best: {}, gatesUnlocked: [], gatesCompleted: [], answered: 0, correct: 0, wordCorrect: 0, cityCorrect: 0,
  perfectRun: 0, maxPerfectRun: 0, streak: 0, lastPlayed: "", achievements: [], frame: "none" };
const load = (): QuestProgress => { try { return { ...empty, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return empty; } };
const today = () => new Date().toISOString().slice(0, 10);

export const totalStars = (p: QuestProgress) =>
  Object.values(p.best).reduce((a, b) => a + b, 0) + p.gatesCompleted.length * CONFIG.GATE_BONUS_STARS;

type Stats = ReturnType<typeof computeStats>;
const computeStats = (p: QuestProgress) => {
  const stars = totalStars(p);
  const completed = Object.values(p.best).filter((s) => s > 0).length;
  const perfect = Object.values(p.best).filter((s) => s === 3).length;
  return { stars, completed, perfect, accuracy: p.answered ? Math.round((p.correct / p.answered) * 1000) / 10 : 0,
    overall: Math.round((completed / levels.length) * 100) };
};

export const ACHIEVEMENTS: { id: string; icon: string; name: string; desc: string; goal: number; value: (p: QuestProgress, s: Stats) => number }[] = [
  { id: "first", icon: "🧭", name: "First Explorer", desc: "Complete your first quest.", goal: 1, value: (_, s) => s.completed },
  { id: "star10", icon: "⭐", name: "Star Seeker", desc: "Collect 10 stars.", goal: 10, value: (_, s) => s.stars },
  { id: "star25", icon: "🌟", name: "Star Hunter", desc: "Collect 25 stars.", goal: 25, value: (_, s) => s.stars },
  { id: "star50", icon: "👑", name: "Quezon Master", desc: "Collect 50 stars.", goal: 50, value: (_, s) => s.stars },
  { id: "lv10", icon: "🗺️", name: "Pathfinder", desc: "Complete 10 levels.", goal: 10, value: (_, s) => s.completed },
  { id: "gate1", icon: "🏆", name: "Quest Champion", desc: "Complete your first Quest Gate.", goal: 1, value: (p) => p.gatesCompleted.length },
  { id: "run5", icon: "🔥", name: "Unstoppable", desc: "Complete 5 levels in a row without losing a heart.", goal: 5, value: (p) => p.maxPerfectRun },
  { id: "run3", icon: "❤️", name: "Flawless Journey", desc: "3 consecutive levels with 3 hearts.", goal: 3, value: (p) => p.maxPerfectRun },
  { id: "c50", icon: "🧠", name: "Local Scholar", desc: "Answer 50 questions correctly.", goal: 50, value: (p) => p.correct },
  { id: "w10", icon: "🗣️", name: "Word Keeper", desc: "Get 10 local-word questions right.", goal: 10, value: (p) => p.wordCorrect },
  { id: "city10", icon: "🏙️", name: "City Explorer", desc: "Correctly identify 10 towns or cities.", goal: 10, value: (p) => p.cityCorrect },
  { id: "lv25", icon: "📚", name: "Knowledge Seeker", desc: "Complete 25 levels.", goal: 25, value: (_, s) => s.completed },
  { id: "perf10", icon: "💎", name: "Perfect Quest", desc: "Earn 3 stars on 10 levels.", goal: 10, value: (_, s) => s.perfect },
  { id: "star100", icon: "🏅", name: "Quezon Legend", desc: "Earn 100 total stars.", goal: 100, value: (_, s) => s.stars },
  { id: "gate3", icon: "🔓", name: "Gate Breaker", desc: "Unlock 3 Quest Gates.", goal: 3, value: (p) => p.gatesUnlocked.length },
  { id: "all", icon: "👑", name: "Ultimate Quest Master", desc: "Complete every available level.", goal: levels.length, value: (_, s) => s.completed },
];

export const TITLES = [
  { name: "New Explorer", stars: 0 }, { name: "Quezon Seeker", stars: 10 }, { name: "Local Scholar", stars: 30 },
  { name: "Quezon Master", stars: 60 }, { name: "Quezon Legend", stars: 100 },
];
export const FRAMES = [
  { id: "none", name: "Plain", stars: 0 }, { id: "green", name: "Banahaw Green", stars: 10 },
  { id: "ocean", name: "Pacific Blue", stars: 25 }, { id: "gold", name: "Pahiyas Gold", stars: 50 },
];
export const titleFor = (stars: number) => [...TITLES].reverse().find((t) => stars >= t.stars)!.name;

export const useQuestProgress = () => {
  const [p, setP] = useState<QuestProgress>(load);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(p)); }, [p]);
  const stats = useMemo(() => computeStats(p), [p]);

  const isUnlocked = useCallback((lv: Level) => {
    if (lv.number === 1) return true;
    const prevDone = (p.best[lv.number - 1] || 0) > 0;
    if (!lv.isMilestone) return prevDone;
    return prevDone && (p.gatesUnlocked.includes(lv.number) || stats.stars >= lv.requiredStars);
  }, [p, stats.stars]);

  // Gates stay unlocked permanently once the star requirement is reached
  useEffect(() => {
    const newly = levels.filter((l) => l.isMilestone && !p.gatesUnlocked.includes(l.number) && stats.stars >= l.requiredStars && (p.best[l.number - 1] || 0) > 0);
    if (newly.length) setP((x) => ({ ...x, gatesUnlocked: [...x.gatesUnlocked, ...newly.map((l) => l.number)] }));
  }, [p.best, p.gatesUnlocked, stats.stars]);

  const answer = useCallback((correct: boolean, category: string) => setP((x) => ({
    ...x, answered: x.answered + 1, correct: x.correct + (correct ? 1 : 0),
    wordCorrect: x.wordCorrect + (correct && ["word", "meaning", "voice"].includes(category) ? 1 : 0),
    cityCorrect: x.cityCorrect + (correct && ["city", "district", "where"].includes(category) ? 1 : 0),
  })), []);

  /** Returns previous best so the UI can show NEW BEST */
  const finish = useCallback((lv: Level, stars: number) => {
    const prev = p.best[lv.number] || 0;
    setP((x) => {
      const d = today(); const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
      const streak = x.lastPlayed === d ? x.streak : x.lastPlayed === y ? x.streak + 1 : 1;
      const perfectRun = stars === 3 ? x.perfectRun + 1 : 0;
      return { ...x, streak, lastPlayed: d, perfectRun, maxPerfectRun: Math.max(x.maxPerfectRun, perfectRun),
        best: { ...x.best, [lv.number]: Math.max(x.best[lv.number] || 0, stars) },
        gatesCompleted: lv.isMilestone && stars > 0 && !x.gatesCompleted.includes(lv.number) ? [...x.gatesCompleted, lv.number] : x.gatesCompleted };
    });
    return prev;
  }, [p.best]);

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => a.value(p, stats) >= a.goal).map((a) => a.id);
  const newAchievements = unlockedAchievements.filter((id) => !p.achievements.includes(id));
  const ackAchievements = useCallback(() => setP((x) => ({ ...x, achievements: Array.from(new Set([...x.achievements, ...newAchievements])) })), [newAchievements.join()]);
  const setFrame = (frame: string) => setP((x) => ({ ...x, frame }));
  const reset = () => setP(empty);

  return { p, stats, isUnlocked, answer, finish, unlockedAchievements, newAchievements, ackAchievements, setFrame, reset };
};
