// Pronunciation analysis. Swap `analyzePronunciation` for a phoneme-level API later.
const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zñ\s]/g, "").replace(/\s+/g, " ").trim();

const levenshtein = (a: string, b: string) => {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...new Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
  return dp[a.length][b.length];
};

export const similarity = (heard: string, target: string) => {
  const A = normalize(heard), B = normalize(target);
  if (!A || !B) return 0;
  return Math.max(0, 1 - levenshtein(A, B) / Math.max(A.length, B.length));
};

export type Analysis = { heard: string; score: number };

/** Pick the best recognition alternative and score it 0–100. */
export const analyzePronunciation = async (alternatives: string[], target: string): Promise<Analysis> => {
  const best = alternatives
    .map((heard) => ({ heard, score: Math.round(similarity(heard, target) * 100) }))
    .sort((a, b) => b.score - a.score)[0];
  return best ?? { heard: "", score: 0 };
};

export const feedbackFor = (score: number) => {
  if (score >= 90) return "Excellent pronunciation!";
  if (score >= 80) return "Very good!";
  if (score >= 60) return "Almost there! Pay attention to the syllables.";
  if (score >= 30) return "Try again — listen carefully and repeat.";
  return "Try again. Listen carefully and repeat.";
};

export const getRecognizer = (): any =>
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
