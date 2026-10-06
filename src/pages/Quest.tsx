import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Swords, Trophy, BarChart3, User, Lock, Mic, Volume2, Check, X, Flame, Star, Heart, Settings as Cog } from "lucide-react";
import { CATEGORIES, CONFIG, Level, levels, MAX_STARS } from "@/quest/data";
import { ACHIEVEMENTS, FRAMES, TITLES, titleFor, useQuestProgress } from "@/quest/progress";
import { speak } from "@/lib/speak";
import { sfx } from "@/game/sfx";

type Tab = "home" | "quests" | "achievements" | "progress" | "profile";

const Stars = ({ n, max = 3, size = "w-4 h-4" }: { n: number; max?: number; size?: string }) => (
  <span className="inline-flex gap-0.5">{Array.from({ length: max }).map((_, i) =>
    <Star key={i} className={`${size} ${i < n ? "fill-current text-saffron qq-pop" : "text-muted-foreground/40"}`} style={{ animationDelay: `${i * 0.15}s` }} />)}</span>
);
const Hearts = ({ n }: { n: number }) => (
  <span className="inline-flex gap-1">{Array.from({ length: CONFIG.HEARTS }).map((_, i) =>
    <Heart key={`${i}-${i < n}`} className={`w-5 h-5 ${i < n ? "fill-current text-destructive" : "text-muted-foreground/40 qq-shake"}`} />)}</span>
);
const Bar = ({ v }: { v: number }) => <div className="h-2.5 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary transition-all duration-700" style={{ width: `${Math.min(100, v)}%` }} /></div>;

const Quest = () => {
  const nav = useNavigate();
  const q = useQuestProgress();
  const { p, stats } = q;
  const [tab, setTab] = useState<Tab>("home");
  const [playing, setPlaying] = useState<Level | null>(null);
  const [lockInfo, setLockInfo] = useState<Level | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (!q.newAchievements.length || playing) return;
    const a = ACHIEVEMENTS.find((x) => x.id === q.newAchievements[0])!;
    setToast(`${a.icon} New Achievement Unlocked! ${a.name}`); q.ackAchievements();
    const t = setTimeout(() => setToast(null), 3200); return () => clearTimeout(t);
  }, [q.newAchievements.join(), playing]);

  const title = titleFor(stats.stars);
  const nextLevel = levels.find((l) => !p.best[l.number] && q.isUnlocked(l)) || levels[0];

  if (playing) return (
    <div className="game-root min-h-dvh flex flex-col pt-safe pb-safe">
      <PlayLevel key={`${playing.id}-${runId}`} lv={playing} q={q}
        onExit={() => setPlaying(null)}
        onNext={() => { const n = levels[playing.number]; if (n && q.isUnlocked(n)) setPlaying({ ...n }); else { setPlaying(null); setTab("quests"); } }}
        onReplay={() => { setRunId((r) => r + 1); setPlaying({ ...playing }); }} />
    </div>
  );

  return (
    <div className="game-root min-h-dvh flex flex-col pt-safe">
      <header className="flex items-center justify-between px-4 h-14">
        <button onClick={() => nav(-1)} className="game-icon-btn" aria-label="Back"><ArrowLeft className="w-5 h-5" /></button>
        <span className="font-display font-bold tracking-wide text-sm">QUEZON QUEST</span>
        <div className="flex items-center gap-1.5 text-sm font-bold"><Star className="w-4 h-4 fill-current text-saffron" />{stats.stars}</div>
      </header>

      <main className="flex-1 px-4 pb-24 max-w-2xl w-full mx-auto">
        {tab === "home" && (
          <div className="flex flex-col items-center text-center gap-5 pt-4 animate-fade-up">
            <div className="game-orb animate-float"><Swords className="w-14 h-14" /></div>
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold">QUEZON QUEST</h1>
              <p className="text-muted-foreground mt-1">Explore. Answer. Discover Quezon.</p>
            </div>
            <button className="game-cta" onClick={() => { sfx.tap(false); setPlaying(nextLevel); }}>START QUEST</button>
            <div className="w-full max-w-sm space-y-1 text-left">
              <div className="flex justify-between text-sm font-bold"><span>Overall Progress</span><span>{stats.overall}%</span></div>
              <Bar v={stats.overall} />
            </div>
            <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
              <MiniStat icon={<Star className="w-5 h-5 fill-current text-saffron" />} v={`${stats.stars}`} l="Stars" />
              <MiniStat icon={<Flame className="w-5 h-5 text-destructive" />} v={`${p.streak}`} l="Day Streak" />
              <MiniStat icon={<Heart className="w-5 h-5 fill-current text-destructive" />} v={`${CONFIG.HEARTS}`} l="Hearts / Level" />
            </div>
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              <button onClick={() => setTab("achievements")} className="game-secondary justify-center"><Trophy className="w-4 h-4" />Achievements</button>
              <button onClick={() => setTab("profile")} className="game-secondary justify-center"><Cog className="w-4 h-4" />Settings</button>
            </div>
            <Link to="/game" className="game-level w-full max-w-sm text-left">
              <div className="game-level-badge bg-ocean text-ocean-foreground"><Mic className="w-5 h-5" /></div>
              <div className="flex-1"><div className="font-bold">Quezon Voice Quest</div><div className="text-xs text-muted-foreground">The original pronunciation game with the map</div></div>
            </Link>
          </div>
        )}

        {tab === "quests" && (
          <div className="animate-fade-up">
            <h2 className="font-display text-2xl font-bold text-center">QUESTS</h2>
            <p className="text-center text-sm text-muted-foreground mb-4">⭐ {stats.stars} / {MAX_STARS} stars collected</p>
            <div className="space-y-3">
              {levels.map((lv) => {
                const un = q.isUnlocked(lv); const best = p.best[lv.number] || 0; const cat = CATEGORIES[lv.category];
                return (
                  <button key={lv.id} onClick={() => un ? setPlaying(lv) : setLockInfo(lv)}
                    className={`game-level w-full text-left ${lv.isMilestone ? "qq-gate" : ""} ${un ? "" : "opacity-60"}`}>
                    <div className={`game-level-badge w-12 h-12 text-lg ${lv.isMilestone ? "bg-saffron text-foreground" : ""}`}>{un ? (lv.isMilestone ? "🏆" : cat.icon) : <Lock className="w-5 h-5" />}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground">LEVEL {lv.number} · {lv.difficulty.toUpperCase()}{lv.isMilestone && " · QUEST GATE"}</div>
                      <div className="font-bold truncate">{lv.name}</div>
                      <div className="text-xs text-muted-foreground">{lv.isMilestone ? `${lv.questions.length} questions · +${CONFIG.GATE_BONUS_STARS}⭐ bonus` : cat.label}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <Stars n={best} />
                      <div className="text-[10px] font-bold mt-1 text-muted-foreground">{!un ? (lv.isMilestone ? `REQUIRES ${lv.requiredStars}⭐` : "🔒 LOCKED") : best ? "COMPLETED" : "NEW"}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {tab === "achievements" && (
          <div className="animate-fade-up">
            <h2 className="font-display text-2xl font-bold text-center mb-4">ACHIEVEMENTS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACHIEVEMENTS.map((a) => {
                const v = Math.min(a.goal, a.value(p, stats)); const has = v >= a.goal;
                return (
                  <div key={a.id} className={`game-level ${has ? "" : "opacity-60 grayscale"}`}>
                    <div className={`grid place-items-center w-12 h-12 rounded-2xl text-2xl shrink-0 ${has ? "bg-saffron/30 qq-pop" : "bg-muted"}`}>{has ? a.icon : "🔒"}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm">{a.name.toUpperCase()}</div>
                      <div className="text-xs text-muted-foreground mb-1.5">{a.desc}</div>
                      <Bar v={(v / a.goal) * 100} /><div className="text-[10px] text-muted-foreground mt-1">{v} / {a.goal}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "progress" && (
          <div className="animate-fade-up space-y-3">
            <h2 className="font-display text-2xl font-bold text-center">QUEST PROGRESS</h2>
            <div className="rounded-2xl bg-card border border-border p-4"><div className="flex justify-between text-sm font-bold mb-1"><span>Level Progress</span><span>{stats.overall}%</span></div><Bar v={stats.overall} /></div>
            <div className="grid grid-cols-2 gap-3">
              <Big l="Stars" v={`⭐ ${stats.stars} / ${MAX_STARS}`} />
              <Big l="Levels Completed" v={`${stats.completed} / ${levels.length}`} />
              <Big l="Perfect Levels" v={`${stats.perfect}`} />
              <Big l="Questions Answered" v={`${p.answered}`} />
              <Big l="Correct Answers" v={`${p.correct}`} />
              <Big l="Accuracy" v={`${stats.accuracy}%`} />
              <Big l="Current Streak" v={`🔥 ${p.streak}`} />
              <Big l="Quest Gates" v={`${p.gatesCompleted.length} cleared`} />
            </div>
            <div className="text-xs font-bold text-muted-foreground pt-2">RECENTLY UNLOCKED</div>
            <div className="flex flex-wrap gap-2">
              {p.achievements.length ? p.achievements.slice(-5).reverse().map((id) => { const a = ACHIEVEMENTS.find((x) => x.id === id)!; return <span key={id} className="game-chip text-xs">{a.icon} {a.name}</span>; })
                : <span className="text-sm text-muted-foreground">Play a quest to earn your first achievement!</span>}
            </div>
          </div>
        )}

        {tab === "profile" && (
          <div className="animate-fade-up flex flex-col items-center gap-4 text-center">
            <div className={`qq-avatar qq-frame-${p.frame}`}><User className="w-12 h-12" /></div>
            <div><div className="font-display text-2xl font-bold">Quezon Player</div><div className="text-sm font-bold text-primary">{title.toUpperCase()}</div></div>
            <div className="w-full text-left">
              <div className="text-xs font-bold text-muted-foreground mb-2">TITLES</div>
              <div className="flex flex-wrap gap-2">{TITLES.map((t) => <span key={t.name} className={`game-chip text-xs ${stats.stars >= t.stars ? "" : "opacity-40"}`}>{stats.stars >= t.stars ? "🏅" : "🔒"} {t.name} · {t.stars}⭐</span>)}</div>
              <div className="text-xs font-bold text-muted-foreground mt-4 mb-2">AVATAR FRAMES</div>
              <div className="grid grid-cols-2 gap-2">{FRAMES.map((f) => {
                const ok = stats.stars >= f.stars;
                return <button key={f.id} disabled={!ok} onClick={() => q.setFrame(f.id)} className={`game-secondary justify-center disabled:opacity-40 ${p.frame === f.id ? "border-primary" : ""}`}>{ok ? "" : "🔒 "}{f.name}{!ok && ` · ${f.stars}⭐`}</button>;
              })}</div>
              <div className="text-xs font-bold text-muted-foreground mt-4 mb-2">BADGES</div>
              <div className="flex flex-wrap gap-2">{q.unlockedAchievements.length ? q.unlockedAchievements.map((id) => { const a = ACHIEVEMENTS.find((x) => x.id === id)!; return <span key={id} className="game-chip text-xs">{a.icon} {a.name}</span>; }) : <span className="text-sm text-muted-foreground">No badges yet.</span>}</div>
              <p className="text-xs text-muted-foreground mt-4">Progress is saved on this device.</p>
              <button onClick={() => { if (confirm("Reset all Quezon Quest progress?")) q.reset(); }} className="game-secondary w-full justify-center mt-3 text-destructive">Reset progress</button>
            </div>
          </div>
        )}
      </main>

      {lockInfo && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 animate-fade-in" onClick={() => setLockInfo(null)}>
          <div className="w-full max-w-sm rounded-3xl bg-card p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <Lock className="w-10 h-10 mx-auto text-muted-foreground" />
            <h3 className="font-display text-xl font-bold mt-2">LEVEL {lockInfo.number} LOCKED</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {(p.best[lockInfo.number - 1] || 0) === 0 ? `Complete Level ${lockInfo.number - 1} first.` : ""}
              {lockInfo.isMilestone && <><br />This Quest Gate requires {lockInfo.requiredStars} ⭐<br /><b className="text-foreground">Current Stars: {stats.stars} / {lockInfo.requiredStars} ⭐</b></>}
            </p>
            <button onClick={() => setLockInfo(null)} className="game-cta mt-4 px-8 py-3 text-base">OK</button>
          </div>
        </div>
      )}

      {toast && <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 rounded-full bg-card border border-border shadow-xl px-4 py-2 text-sm font-bold qq-pop">{toast}</div>}

      <nav className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border pb-safe">
        <div className="grid grid-cols-5 max-w-2xl mx-auto">
          {([["home", Home, "Home"], ["quests", Swords, "Quests"], ["achievements", Trophy, "Achievements"], ["progress", BarChart3, "Progress"], ["profile", User, "Profile"]] as const).map(([id, I, l]) => (
            <button key={id} onClick={() => setTab(id)} className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-bold ${tab === id ? "text-primary" : "text-muted-foreground"}`}>
              <I className={`w-5 h-5 ${tab === id ? "scale-110" : ""} transition-transform`} />{l.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

const MiniStat = ({ icon, v, l }: { icon: React.ReactNode; v: string; l: string }) => (
  <div className="rounded-2xl bg-card border border-border p-3 flex flex-col items-center">{icon}<div className="font-display text-xl font-bold">{v}</div><div className="text-[10px] text-muted-foreground">{l}</div></div>
);
const Big = ({ l, v }: { l: string; v: string }) => (
  <div className="rounded-2xl bg-card border border-border p-3"><div className="text-xs text-muted-foreground">{l}</div><div className="font-display text-lg font-bold">{v}</div></div>
);

const CHEERS = ["Excellent!", "Great job!", "Galing!", "You're on fire!"];

const PlayLevel = ({ lv, q, onExit, onNext, onReplay }: { lv: Level; q: ReturnType<typeof useQuestProgress>; onExit: () => void; onNext: () => void; onReplay: () => void }) => {
  const [i, setI] = useState(0);
  const [hearts, setHearts] = useState(CONFIG.HEARTS);
  const [picked, setPicked] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [end, setEnd] = useState<null | { stars: number; prev: number }>(null);
  const qs = lv.questions; const cur = qs[i];
  const cheer = useMemo(() => CHEERS[Math.floor(Math.random() * CHEERS.length)], [i]);

  useEffect(() => { if (cur?.audio) setTimeout(() => speak(cur.audio!), 300); }, [i]);

  const choose = (o: string) => {
    if (picked) return;
    setPicked(o); const ok = o === cur.answer;
    q.answer(ok, cur.category);
    if (ok) { setCorrectCount((c) => c + 1); sfx.success(false); } else { setHearts((h) => h - 1); sfx.retry(false); }
  };
  const next = () => {
    if (hearts <= 0) { setEnd({ stars: 0, prev: q.p.best[lv.number] || 0 }); return; }
    if (i + 1 >= qs.length) { const stars = hearts; const prev = q.finish(lv, stars); setEnd({ stars, prev }); return; }
    setI(i + 1); setPicked(null);
  };

  if (end) {
    const failed = end.stars === 0; const newBest = !failed && end.stars > end.prev;
    const label = end.stars === 3 ? "PERFECT QUEST!" : end.stars === 2 ? "GREAT QUEST!" : "QUEST COMPLETE!";
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-4 max-w-md mx-auto w-full animate-fade-up">
        {!failed && end.stars === 3 && <Confetti />}
        <div className="text-6xl qq-pop">{failed ? "💔" : lv.isMilestone ? "🏆" : "🎉"}</div>
        <h2 className="font-display text-3xl font-bold">{failed ? "QUEST FAILED" : lv.isMilestone ? "GATE CLEARED!" : "QUEST COMPLETE!"}</h2>
        <div className="text-muted-foreground">{lv.name}</div>
        {failed ? <p className="text-sm">You ran out of hearts. You're getting closer — try again!</p> : <>
          <div className="text-sm">You finished with <b>{hearts}/{CONFIG.HEARTS}</b> hearts!</div><Hearts n={hearts} />
          <div className="text-xs font-bold tracking-[0.25em] text-muted-foreground mt-2">YOUR REWARD</div>
          <Stars n={end.stars} size="w-10 h-10" />
          <div className="font-display text-xl font-bold text-primary">{label}</div>
          {lv.isMilestone && <div className="text-sm font-bold text-saffron qq-pop">✨ +{CONFIG.GATE_BONUS_STARS} bonus stars!</div>}
          {newBest && <div className="rounded-full bg-saffron/25 px-4 py-1 text-sm font-bold qq-pop">✨ NEW BEST! ⭐ +{end.stars - end.prev} Star{end.stars - end.prev > 1 ? "s" : ""}</div>}
        </>}
        <div className="w-full rounded-2xl bg-card border border-border p-4 text-sm grid grid-cols-3">
          <div><div className="text-muted-foreground text-xs">Questions</div><b>{failed ? i + 1 : qs.length}/{qs.length}</b></div>
          <div><div className="text-muted-foreground text-xs">Correct</div><b>{correctCount}</b></div>
          <div><div className="text-muted-foreground text-xs">Accuracy</div><b>{Math.round((correctCount / (failed ? i + 1 : qs.length)) * 100)}%</b></div>
        </div>
        <div className="grid grid-cols-3 gap-2 w-full">
          {failed ? <button onClick={onReplay} className="game-secondary justify-center col-span-2">TRY AGAIN</button>
            : <button onClick={onNext} className="game-secondary justify-center bg-primary text-primary-foreground border-primary">NEXT LEVEL</button>}
          {!failed && <button onClick={onReplay} className="game-secondary justify-center">REPLAY</button>}
          <button onClick={onExit} className="game-secondary justify-center">{failed ? "BACK TO LEVELS" : "LEVELS"}</button>
        </div>
      </div>
    );
  }

  const ok = picked === cur.answer;
  return (
    <div className={`flex-1 flex flex-col px-4 pb-4 max-w-md mx-auto w-full ${lv.isMilestone ? "qq-gate-play" : ""}`}>
      <header className="flex items-center justify-between h-14">
        <button onClick={onExit} className="game-icon-btn" aria-label="Quit"><X className="w-5 h-5" /></button>
        <div className="text-xs font-bold tracking-widest">{lv.isMilestone ? "🏆 " : ""}LEVEL {lv.number}</div>
        <Hearts n={hearts} />
      </header>
      <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary transition-all" style={{ width: `${((i + (picked ? 1 : 0)) / qs.length) * 100}%` }} /></div>
      <div key={i} className="flex-1 flex flex-col gap-4 pt-5 animate-fade-up">
        <div className="flex justify-between text-xs font-bold text-muted-foreground"><span>QUESTION {i + 1}/{qs.length}</span><span>{CATEGORIES[cur.category].icon} {CATEGORIES[cur.category].label}</span></div>
        <h2 className="font-display text-2xl font-bold leading-snug">{cur.question}</h2>
        {cur.audio && <button onClick={() => speak(cur.audio!)} className="game-secondary self-start"><Volume2 className="w-5 h-5" /> PLAY AGAIN</button>}
        <div className="space-y-2.5">
          {cur.options.map((o, k) => {
            const state = !picked ? "" : o === cur.answer ? "qq-opt-right" : o === picked ? "qq-opt-wrong qq-shake" : "opacity-50";
            return (
              <button key={o} onClick={() => choose(o)} disabled={!!picked} className={`qq-opt ${state}`}>
                <span className="qq-opt-letter">{"ABCD"[k]}</span><span className="flex-1 text-left">{o}</span>
                {picked && o === cur.answer && <Check className="w-5 h-5" />}{picked && o === picked && o !== cur.answer && <X className="w-5 h-5" />}
              </button>
            );
          })}
        </div>
        {picked && (
          <div className={`rounded-2xl p-4 qq-pop ${ok ? "bg-primary/15" : "bg-destructive/10"}`}>
            <div className={`font-display text-lg font-bold ${ok ? "text-primary" : "text-destructive"}`}>{ok ? `✓ CORRECT! ${cheer}` : "✕ WRONG ANSWER"}</div>
            {!ok && <div className="text-sm">Correct answer: <b>{cur.answer}</b></div>}
            <div className="text-sm text-muted-foreground mt-1">{cur.explanation}</div>
            <button onClick={next} className="game-cta w-full mt-3 py-3 text-base">{hearts <= 0 ? "SEE RESULT" : i + 1 >= qs.length ? "FINISH" : "CONTINUE"}</button>
          </div>
        )}
      </div>
    </div>
  );
};

const Confetti = () => (
  <div className="pointer-events-none fixed inset-0 overflow-hidden z-40">
    {Array.from({ length: 40 }).map((_, i) => <span key={i} className="game-confetti" style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 10) * 0.08}s`, background: `hsl(var(--game-d${(i % 4) + 1}))` }} />)}
  </div>
);

export default Quest;
