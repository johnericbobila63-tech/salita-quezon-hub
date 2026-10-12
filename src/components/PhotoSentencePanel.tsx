import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Volume2, Bookmark, BookmarkCheck, ArrowRight, Camera, Sparkles } from "lucide-react";
import { categories, words, type WordEntry } from "@/data/dictionary";
import { speak } from "@/lib/speak";
import { useSavedWords } from "@/lib/saved";
import { cn } from "@/lib/utils";

export const PHOTO_SCAN_KEY = "photo-scan-sentence";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/** Find dictionary words appearing in the text (longest first, whole-word). */
export const findDialectWords = (text: string) => {
  const t = norm(text);
  const found: WordEntry[] = [];
  const sorted = [...words].sort((a, b) => b.word.length - a.word.length);
  for (const w of sorted) {
    const key = norm(w.word).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (key.length < 3) continue;
    if (new RegExp(`(^|[^a-z])${key}([^a-z]|$)`, "i").test(t) && !found.some((f) => norm(f.word) === norm(w.word))) {
      found.push(w);
    }
  }
  return found;
};

interface Props { text: string; onClose: () => void }

export const PhotoSentencePanel = ({ text, onClose }: Props) => {
  const navigate = useNavigate();
  const { isSaved, toggle } = useSavedWords();
  const matches = useMemo(() => findDialectWords(text), [text]);
  const [active, setActive] = useState<WordEntry | null>(null);

  const parts = useMemo(() => {
    if (!matches.length) return [{ text, word: null as WordEntry | null }];
    const escaped = matches.map((m) => m.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const re = new RegExp(`(${escaped.join("|")})`, "gi");
    return text.split(re).filter(Boolean).map((p) => ({
      text: p,
      word: matches.find((m) => norm(m.word) === norm(p)) ?? null,
    }));
  }, [text, matches]);

  const district = active ? categories.find((c) => c.id === active.category) : null;

  const openCategory = (w: WordEntry) => {
    const q = new URLSearchParams({ c: w.category });
    if (w.city) q.set("city", w.city);
    navigate(`/categories?${q.toString()}`);
  };

  return (
    <div className="mt-2 bg-popover rounded-2xl shadow-warm border border-border p-4 md:p-5 animate-fade-up relative text-foreground">
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-accent">
          <Camera className="w-3.5 h-3.5" /> Nabasa mula sa larawan
        </span>
        <button onClick={onClose} aria-label="Isara" className="w-8 h-8 grid place-items-center rounded-full hover:bg-muted text-muted-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm md:text-base leading-relaxed">
        {parts.map((p, i) =>
          p.word ? (
            <button
              key={i}
              onClick={() => setActive(p.word)}
              className="font-bold italic text-destructive underline decoration-dotted underline-offset-4 hover:bg-destructive/10 rounded px-0.5"
            >
              {p.text}
            </button>
          ) : (
            <span key={i}>{p.text}</span>
          )
        )}
      </p>

      <div className="mt-4 pt-3 border-t border-border">
        {matches.length > 0 ? (
          <>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <Sparkles className="w-3.5 h-3.5 text-saffron" />
              {matches.length} salitang Quezonian ang nakita — pindutin para makita ang kahulugan
            </div>
            <div className="flex flex-wrap gap-2">
              {matches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActive(m)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-semibold border transition-smooth",
                    active?.id === m.id ? "bg-destructive text-destructive-foreground border-destructive" : "border-destructive/40 text-destructive hover:bg-destructive/10"
                  )}
                >
                  {m.word}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">Walang salitang Quezonian na nakita sa pangungusap na ito.</p>
        )}
      </div>

      {active && (
        <div className="mt-4 rounded-2xl border border-primary/30 bg-card shadow-soft p-4 animate-fade-up">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-widest font-bold text-accent">
                {active.partOfSpeech} · {district?.name ?? active.category}{active.city ? ` · ${active.city}` : ""}
              </span>
              <h3 className="font-display text-2xl font-semibold mt-1">{active.word}</h3>
              <div className="text-xs text-muted-foreground">/{active.pronunciation}/</div>
            </div>
            <button
              onClick={() => openCategory(active)}
              className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary-glow transition-smooth"
            >
              Tingnan <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <button onClick={() => speak(active.word)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs">
              <Volume2 className="w-3.5 h-3.5" /> Listen
            </button>
            <button onClick={() => toggle(active.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs hover:bg-muted">
              {isSaved(active.id) ? <BookmarkCheck className="w-3.5 h-3.5 text-primary" /> : <Bookmark className="w-3.5 h-3.5" />}
              {isSaved(active.id) ? "Saved" : "Save"}
            </button>
            <button onClick={() => navigate(`/word/${active.id}`)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs hover:bg-muted">
              Buong entry →
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{active.definition}</p>
          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-border text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Filipino</div>
              <div className="font-medium">{active.filipino}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">English</div>
              <div className="font-medium">{active.english}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
