import { Mic, Square, CheckCircle2, XCircle, Target } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

// Lightweight string similarity (Levenshtein-based) for pronunciation matching
const normalize = (s: string) =>
  s.toLowerCase().replace(/[^a-zñ\s]/gi, "").trim();

const levenshtein = (a: string, b: string) => {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
};

const similarity = (a: string, b: string) => {
  const A = normalize(a), B = normalize(b);
  if (!A || !B) return 0;
  const dist = levenshtein(A, B);
  return Math.max(0, 1 - dist / Math.max(A.length, B.length));
};

type Result = { heard: string; score: number } | null;

export const PracticePronunciation = ({ target }: { target: string }) => {
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const recRef = useRef<any>(null);

  const start = () => {
    const SR: any =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error("Speech recognition is not supported on this browser. Try Chrome.");
      return;
    }
    const rec = new SR();
    rec.lang = "fil-PH";
    rec.interimResults = false;
    rec.maxAlternatives = 3;

    rec.onresult = (e: any) => {
      const alts: string[] = [];
      for (let i = 0; i < e.results[0].length; i++) alts.push(e.results[0][i].transcript);
      const best = alts
        .map((t) => ({ heard: t, score: similarity(t, target) }))
        .sort((a, b) => b.score - a.score)[0];
      setResult(best);
    };
    rec.onerror = (e: any) => {
      toast.error(`Mic error: ${e.error || "unknown"}`);
      setListening(false);
    };
    rec.onend = () => setListening(false);

    recRef.current = rec;
    setResult(null);
    setListening(true);
    rec.start();
  };

  const stop = () => recRef.current?.stop();

  const pct = result ? Math.round(result.score * 100) : 0;
  const passed = pct >= 70;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-5 h-5 text-accent" />
        <h3 className="font-display text-lg">Practice Pronunciation</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Tap the mic and say <span className="font-semibold text-foreground">"{target}"</span>. We'll compare it to the reference pronunciation.
      </p>

      <div className="flex items-center gap-3">
        {listening ? (
          <button onClick={stop} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-destructive text-destructive-foreground animate-pulse">
            <Square className="w-4 h-4 fill-current" /> Stop
          </button>
        ) : (
          <button onClick={start} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary-glow transition-smooth">
            <Mic className="w-4 h-4" /> Start practice
          </button>
        )}
        {result && (
          <div className="flex items-center gap-2 text-sm">
            {passed ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-destructive" />}
            <span className="font-semibold">{pct}% match</span>
          </div>
        )}
      </div>

      {result && (
        <div className="mt-4 text-sm">
          <div className="text-muted-foreground">You said:</div>
          <div className="font-display text-base">"{result.heard}"</div>
          <div className={`mt-2 font-medium ${passed ? "text-emerald-600" : "text-destructive"}`}>
            {passed ? "Magaling! Tama ang bigkas." : "Subukan ulit — pakinggan muli ang Listen button."}
          </div>
        </div>
      )}
    </div>
  );
};
