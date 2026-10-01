import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, HelpCircle, Lock, Map as MapIcon, Mic, RotateCcw, Trophy, Volume2, VolumeX, ArrowRight, Star, Award, X, Square,
} from "lucide-react";
import { districts, District, levels, PASS_SCORE, TOTAL_LOCALITIES } from "@/game/data";
import { analyzePronunciation, feedbackFor, getRecognizer } from "@/game/scoring";
import { useProgress } from "@/game/progress";
import { QuezonMap } from "@/game/QuezonMap";
import { sfx } from "@/game/sfx";
import { speak } from "@/lib/speak";

type Screen = "home" | "map" | "levels" | "play";
type Phase = "idle" | "listening" | "analyzing" | "result";

const Game = () => {
  const nav = useNavigate();
  const { p, update, record, reset, stats } = useProgress();
  const [screen, setScreen] = useState<Screen>("home");
  const [district, setDistrict] = useState<District | null>(null);
  const [loc, setLoc] = useState<string>("");
  const [level, setLevel] = useState(1);
  const [showHelp, setShowHelp] = useState(!p.tutorialSeen);
  const [showStats, setShowStats] = useState(false);
  const m = p.muted;

  const openLocality = (name: string) => { sfx.tap(m); setLoc(name); setScreen("levels"); };

  return (
    <div className="game-root min-h-dvh flex flex-col pt-safe pb-safe">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 h-14">
        <button onClick={() => {
          if (screen === "home") nav(-1);
          else if (screen === "map" && district) setDistrict(null);
          else if (screen === "map") setScreen("home");
          else if (screen === "levels") setScreen("map");
          else setScreen("levels");
        }} className="game-icon-btn" aria-label="Back"><ArrowLeft className="w-5 h-5" /></button>
        <span className="font-display font-bold tracking-wide text-sm">QUEZON VOICE QUEST</span>
        <div className="flex gap-2">
          <button className="game-icon-btn" onClick={() => setShowStats(true)} aria-label="Progress"><Trophy className="w-5 h-5" /></button>
          <button className="game-icon-btn" onClick={() => setShowHelp(true)} aria-label="How to play"><HelpCircle className="w-5 h-5" /></button>
          <button className="game-icon-btn" onClick={() => update((x) => ({ ...x, muted: !x.muted }))} aria-label={m ? "Unmute" : "Mute"}>
            {m ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-4 pb-4 max-w-2xl w-full mx-auto">
        {screen === "home" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 animate-fade-up">
            <div className="game-orb animate-float"><Mic className="w-14 h-14" /></div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">QUEZON<br />VOICE QUEST</h1>
            <p className="text-muted-foreground text-base max-w-xs">Explore Quezon. Speak. Learn. Master the Pronunciation.</p>
            <button onClick={() => { sfx.tap(m); setScreen("map"); }} className="game-cta">START GAME</button>
            <div className="text-sm text-muted-foreground">Overall progress: {stats.overall}%</div>
          </div>
        )}

        {screen === "map" && (
          <div className="flex-1 flex flex-col animate-fade-up">
            <div className="text-center mb-2">
              <h2 className="font-display text-2xl font-bold">{district ? district.name.toUpperCase() : "EXPLORE QUEZON"}</h2>
              <p className="text-sm text-muted-foreground">
                {district ? "Tap a city or municipality." : "Choose a district to begin your pronunciation adventure."}
              </p>
            </div>
            <div className="game-map flex-1 min-h-[360px] max-h-[62vh]">
              <QuezonMap selected={district} completed={p.completed}
                onDistrict={(d) => { sfx.tap(m); setDistrict(d); }} onLocality={openLocality} />
            </div>
            {district ? (
              <>
                <div className="flex flex-wrap gap-2 justify-center mt-3">
                  {district.localities.map((l) => (
                    <button key={l.name} onClick={() => openLocality(l.name)} className="game-chip">
                      {(p.completed[l.name] || 0) > 0 && <Star className="w-3.5 h-3.5 fill-current text-saffron" />}{l.name}
                    </button>
                  ))}
                </div>
                <button onClick={() => setDistrict(null)} className="game-secondary mt-4 self-center">
                  <MapIcon className="w-4 h-4" /> BACK TO QUEZON MAP
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 mt-3">
                {districts.map((d) => (
                  <button key={d.id} onClick={() => setDistrict(d)} className="game-chip justify-center py-3"
                    style={{ borderColor: `hsl(${d.color})` }}>
                    <span className="w-3 h-3 rounded-full" style={{ background: `hsl(${d.color})` }} />{d.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {screen === "levels" && (
          <div className="flex-1 animate-fade-up">
            <div className="text-center mb-5">
              <div className="text-xs font-bold tracking-[0.25em] text-muted-foreground">PRONUNCIATION LEVELS</div>
              <h2 className="font-display text-3xl font-bold mt-1">{loc}</h2>
            </div>
            <div className="space-y-3">
              {levels.map((lv) => {
                const unlocked = lv.n <= (p.completed[loc] || 0) + 1;
                const done = lv.n <= (p.completed[loc] || 0);
                const best = p.best[`${loc}|${lv.n}`] || 0;
                return (
                  <button key={lv.n} disabled={!unlocked}
                    onClick={() => { sfx.tap(m); setLevel(lv.n); setScreen("play"); }}
                    className="game-level w-full disabled:opacity-50">
                    <div className="game-level-badge">{unlocked ? lv.n : <Lock className="w-4 h-4" />}</div>
                    <div className="flex-1 text-left">
                      <div className="font-bold">Level {lv.n} — {lv.title}</div>
                      <div className="text-xs text-muted-foreground">{lv.description}</div>
                      <div className="h-1.5 rounded-full bg-muted mt-2 overflow-hidden">
                        <div className="h-full bg-primary transition-all" style={{ width: `${best}%` }} />
                      </div>
                    </div>
                    {done ? <Star className="w-5 h-5 fill-current text-saffron" /> : <span className="text-xs text-muted-foreground">{best ? `${best}%` : ""}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {screen === "play" && (
          <Play key={`${loc}-${level}`} loc={loc} level={level} muted={m}
            onDone={(score, passed) => record(loc, level, score, passed)}
            onNext={() => level < levels.length ? setLevel(level + 1) : setScreen("levels")}
            onMap={() => setScreen("map")} />
        )}
      </main>

      {showHelp && (
        <Modal onClose={() => { setShowHelp(false); update((x) => ({ ...x, tutorialSeen: true })); }} title="How to play">
          <ol className="space-y-2 text-sm">
            {["Choose a district.", "Select a city or municipality.", "Listen to the pronunciation.", "Tap the microphone.", "Say the word.", "Get your pronunciation score!"].map((s, i) => (
              <li key={s} className="flex gap-3 items-center"><span className="game-level-badge w-7 h-7 text-xs">{i + 1}</span>{s}</li>
            ))}
          </ol>
          <p className="text-xs text-muted-foreground mt-4">Score {PASS_SCORE}% or higher to unlock the next level. Works best in Chrome with microphone allowed.</p>
        </Modal>
      )}

      {showStats && (
        <Modal onClose={() => setShowStats(false)} title="Quezon Explorer">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Stat label="Districts" value={`${stats.explored}/4`} />
            <Stat label="Locations mastered" value={`${stats.mastered}/${TOTAL_LOCALITIES}`} />
            <Stat label="Levels completed" value={`${stats.levelsCompleted}`} />
            <Stat label="Best score" value={`${p.bestScore}%`} />
          </div>
          <div className="mt-4 text-xs font-bold text-muted-foreground">OVERALL PROGRESS</div>
          <div className="h-2.5 rounded-full bg-muted mt-1 overflow-hidden"><div className="h-full bg-primary" style={{ width: `${stats.overall}%` }} /></div>
          <div className="mt-4 text-xs font-bold text-muted-foreground">BADGES</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {districts.map((d) => {
              const has = stats.districtMaster.includes(d.id);
              return <span key={d.id} className={`game-chip text-xs ${has ? "" : "opacity-40"}`}><Award className="w-4 h-4" style={{ color: `hsl(${d.color})` }} />{d.name} Master</span>;
            })}
            <span className={`game-chip text-xs ${p.bestScore >= 95 ? "" : "opacity-40"}`}><Star className="w-4 h-4 text-saffron" />Golden Voice (95%+)</span>
          </div>
          <button onClick={() => { if (confirm("Reset all game progress?")) reset(); }} className="game-secondary mt-5 w-full justify-center text-destructive">
            <RotateCcw className="w-4 h-4" /> Reset progress
          </button>
        </Modal>
      )}
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl bg-muted p-3"><div className="text-xs text-muted-foreground">{label}</div><div className="font-display text-xl font-bold">{value}</div></div>
);

const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 animate-fade-in" onClick={onClose}>
    <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-display text-xl font-bold">{title}</h3>
        <button onClick={onClose} aria-label="Close"><X className="w-5 h-5" /></button>
      </div>
      {children}
    </div>
  </div>
);

const Play = ({ loc, level, muted, onDone, onNext, onMap }: {
  loc: string; level: number; muted: boolean;
  onDone: (score: number, passed: boolean) => void; onNext: () => void; onMap: () => void;
}) => {
  const lv = levels[level - 1];
  const target = lv.phrase(loc);
  const [phase, setPhase] = useState<Phase>("idle");
  const [rep, setRep] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [heard, setHeard] = useState("");
  const [final, setFinal] = useState(0);
  const [secs, setSecs] = useState(0);
  const [error, setError] = useState("");
  const recRef = useRef<any>(null);

  useEffect(() => {
    if (phase !== "listening") return;
    setSecs(0);
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const start = async () => {
    setError("");
    const SR = getRecognizer();
    if (!SR) { setError("Speech recognition isn't supported in this browser. Please try Chrome on Android or desktop."); return; }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      s.getTracks().forEach((t) => t.stop());
    } catch {
      setError("Microphone permission is required to play. Please allow microphone access and try again."); return;
    }
    const rec = new SR();
    rec.lang = "fil-PH"; rec.interimResults = false; rec.maxAlternatives = 5;
    let got = false;
    rec.onresult = async (e: any) => {
      got = true;
      const alts: string[] = [];
      for (let i = 0; i < e.results[0].length; i++) alts.push(e.results[0][i].transcript);
      setPhase("analyzing");
      const a = await analyzePronunciation(alts, target);
      await new Promise((r) => setTimeout(r, 700));
      setHeard(a.heard);
      const all = [...scores, a.score];
      if (all.length < lv.reps) { setScores(all); setRep(all.length); setPhase("idle"); return; }
      const avg = Math.round(all.reduce((x, y) => x + y, 0) / all.length);
      setScores(all); setFinal(avg); setPhase("result");
      const passed = avg >= PASS_SCORE;
      onDone(avg, passed);
      passed ? sfx.success(muted) : sfx.retry(muted);
    };
    rec.onerror = (e: any) => {
      setError(e.error === "no-speech" ? "We didn't hear anything. Tap the mic and speak clearly." :
        e.error === "not-allowed" ? "Microphone permission is required to play." : `Mic error: ${e.error}`);
      setPhase("idle");
    };
    rec.onend = () => { if (!got) setPhase((ph) => (ph === "listening" ? "idle" : ph)); };
    recRef.current = rec;
    setPhase("listening");
    rec.start();
  };

  const retry = () => { setScores([]); setRep(0); setHeard(""); setPhase("idle"); };
  const passed = final >= PASS_SCORE;

  if (phase === "result") {
    const C = 2 * Math.PI * 54;
    return (
      <div className="flex-1 flex flex-col items-center text-center gap-4 animate-fade-up relative">
        {final >= 90 && <Confetti />}
        <div className="text-xs font-bold tracking-[0.25em] text-muted-foreground">YOUR RESULT</div>
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
            <circle cx="60" cy="60" r="54" fill="none" stroke={passed ? "hsl(var(--primary))" : "hsl(var(--saffron))"} strokeWidth="10"
              strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C} className="game-ring" style={{ ["--ring-to" as any]: C * (1 - final / 100) }} />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div><div className="font-display text-4xl font-bold">{final}%</div><div className="text-[10px] tracking-widest text-muted-foreground">SCORE</div></div>
          </div>
        </div>
        <div className="font-display text-xl font-bold">{feedbackFor(final)}</div>
        <div className="w-full rounded-2xl bg-card border border-border p-4 text-sm text-left space-y-2">
          <div><span className="text-muted-foreground">Target: </span><b>{target}</b></div>
          <div><span className="text-muted-foreground">Your pronunciation: </span><b>{heard || "—"}</b></div>
          {lv.reps > 1 && <div className="text-muted-foreground">Attempts: {scores.join("%, ")}%</div>}
          <div className="text-muted-foreground">
            {passed ? (level < levels.length ? "Level passed! Next level unlocked." : "You mastered this location!") :
              final >= 60 ? "So close — give it another try!" : "Listen again and try once more. You've got this!"}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 w-full">
          <button onClick={retry} className="game-secondary justify-center flex-col py-3"><RotateCcw className="w-5 h-5" />TRY AGAIN</button>
          <button onClick={onNext} disabled={!passed} className="game-secondary justify-center flex-col py-3 disabled:opacity-40"><ArrowRight className="w-5 h-5" />NEXT LEVEL</button>
          <button onClick={onMap} className="game-secondary justify-center flex-col py-3"><MapIcon className="w-5 h-5" />MAP</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center text-center gap-5 animate-fade-up">
      <div className="text-xs text-muted-foreground">Level {level} — {lv.title}{lv.reps > 1 && ` · Attempt ${rep + 1}/${lv.reps}`}</div>
      <div className="text-xs font-bold tracking-[0.25em] text-muted-foreground">SAY THIS {target === loc ? "WORD" : "PHRASE"}</div>
      <div className={`font-display font-bold leading-tight ${target.length > 20 ? "text-3xl" : "text-5xl"}`}>{target.toUpperCase()}</div>
      {lv.showListen ? (
        <button onClick={() => speak(target)} className="game-secondary"><Volume2 className="w-5 h-5" /> LISTEN</button>
      ) : <div className="text-xs text-muted-foreground">No listening help at this level.</div>}

      <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-[260px]">
        <button
          onClick={() => (phase === "listening" ? recRef.current?.stop() : phase === "idle" && start())}
          disabled={phase === "analyzing"}
          className={`game-mic ${phase === "listening" ? "is-live" : ""}`}
          aria-label={phase === "listening" ? "Stop recording" : "Tap to speak"}>
          {phase === "listening" ? <Square className="w-12 h-12 fill-current" /> : <Mic className="w-16 h-16" />}
        </button>
        {phase === "listening" && (
          <div className="flex items-end gap-1 h-8">{Array.from({ length: 9 }).map((_, i) => <span key={i} className="game-wave" style={{ animationDelay: `${i * 0.08}s` }} />)}</div>
        )}
        <div className="font-bold tracking-wide">
          {phase === "idle" && "🎤 TAP TO SPEAK"}
          {phase === "listening" && `🔴 LISTENING... 0:${String(secs).padStart(2, "0")}`}
          {phase === "analyzing" && <span className="animate-pulse">ANALYZING PRONUNCIATION...</span>}
        </div>
        {heard && phase === "idle" && lv.reps > 1 && <div className="text-sm text-muted-foreground">Last: "{heard}" — {scores[scores.length - 1]}%</div>}
        {error && <div className="text-sm text-destructive max-w-xs">{error}</div>}
      </div>
    </div>
  );
};

const Confetti = () => (
  <div className="pointer-events-none fixed inset-0 overflow-hidden z-40">
    {Array.from({ length: 40 }).map((_, i) => (
      <span key={i} className="game-confetti" style={{
        left: `${(i * 37) % 100}%`, animationDelay: `${(i % 10) * 0.08}s`,
        background: `hsl(var(--game-d${(i % 4) + 1}))`,
      }} />
    ))}
  </div>
);

export default Game;
