import { Search, Volume2, Mic, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { words } from "@/data/dictionary";
import { cn } from "@/lib/utils";

interface Props { large?: boolean; defaultValue?: string }

export const SearchBar = ({ large, defaultValue = "" }: Props) => {
  const [q, setQ] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);

  const suggestions = q.trim()
    ? words.filter((w) => w.word.toLowerCase().includes(q.toLowerCase()) || w.english.toLowerCase().includes(q.toLowerCase())).slice(0, 5)
    : [];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const SR: any =
    typeof window !== "undefined"
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const stopListening = () => {
    recRef.current?.stop();
    setListening(false);
  };

  const startListening = () => {
    if (!SR) return;
    const rec = new SR();
    rec.lang = "fil-PH";
    rec.interimResults = true;
    rec.maxAlternatives = 3;
    rec.continuous = false;

    rec.onresult = (e: any) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      setQ(text.trim());
      setOpen(true);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => {
      setListening(false);
      recRef.current = null;
    };

    recRef.current = rec;
    setListening(true);
    try {
      rec.start();
    } catch {
      setListening(false);
    }
  };

  return (
    <div ref={ref} className="relative w-full">
      <form onSubmit={submit}>
        <div className={cn(
          "flex items-center gap-2 bg-card rounded-2xl shadow-soft border border-border transition-smooth focus-within:shadow-warm focus-within:border-primary/40",
          large ? "px-5 py-4 md:px-6 md:py-5" : "px-3 py-2.5 md:px-4 md:py-3"
        )}>
          <Search className={cn("text-primary shrink-0", large ? "w-6 h-6" : "w-5 h-5")} />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder={listening ? "Nakikinig... magsalita" : "Maghanap ng salita..."}
            className={cn(
              "flex-1 min-w-0 bg-transparent outline-none placeholder:text-muted-foreground",
              large ? "text-lg" : "text-sm"
            )}
          />
          {SR && (
            <button
              type="button"
              aria-label={listening ? "Stop listening" : "Speak to search"}
              title={listening ? "Stop listening" : "Speak to search"}
              onClick={listening ? stopListening : startListening}
              className={cn(
                "shrink-0 inline-flex items-center justify-center rounded-full transition-smooth",
                listening
                  ? "w-9 h-9 md:w-10 md:h-10 bg-destructive text-destructive-foreground animate-pulse"
                  : "w-9 h-9 md:w-10 md:h-10 text-muted-foreground hover:text-primary hover:bg-primary/10",
                large && !listening && "md:w-11 md:h-11"
              )}
            >
              {listening ? <Square className="w-4 h-4 fill-current" /> : <Mic className={cn(large ? "w-5 h-5" : "w-4 h-4")} />}
            </button>
          )}
          <button type="submit" className={cn(
            "rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary-glow transition-smooth shrink-0",
            large ? "px-6 py-2.5" : "px-4 py-1.5 text-sm"
          )}>
            Hanapin
          </button>
        </div>
      </form>

      {listening && (
        <div className="absolute left-0 right-0 mt-2 bg-popover rounded-2xl shadow-warm border border-border px-5 py-3 z-50 animate-fade-up text-sm text-muted-foreground flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-destructive animate-pulse shrink-0" />
          Nakikinig... sabihin ang salita. Pindutin ulit ang mic upang ihinto.
        </div>
      )}

      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-popover rounded-2xl shadow-warm border border-border overflow-hidden z-50 animate-fade-up">
          {suggestions.map((w) => (
            <button
              key={w.id}
              onClick={() => { setOpen(false); navigate(`/word/${w.id}`); }}
              className="w-full text-left px-5 py-3 hover:bg-muted transition-smooth flex items-center gap-3 border-b border-border last:border-0"
            >
              <Volume2 className="w-4 h-4 text-accent shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold">{w.word}</div>
                <div className="text-xs text-muted-foreground truncate">{w.definition}</div>
              </div>
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{w.partOfSpeech}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
