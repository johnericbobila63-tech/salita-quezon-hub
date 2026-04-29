import { Search, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { words } from "@/data/dictionary";
import { cn } from "@/lib/utils";

interface Props { large?: boolean; defaultValue?: string }

export const SearchBar = ({ large, defaultValue = "" }: Props) => {
  const [q, setQ] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

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

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div ref={ref} className="relative w-full">
      <form onSubmit={submit}>
        <div className={cn(
          "flex items-center gap-3 bg-card rounded-2xl shadow-soft border border-border transition-smooth focus-within:shadow-warm focus-within:border-primary/40",
          large ? "px-6 py-5" : "px-4 py-3"
        )}>
          <Search className={cn("text-primary shrink-0", large ? "w-6 h-6" : "w-5 h-5")} />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Maghanap ng salita... e.g. Pahiyas, Niyog, Kiping"
            className={cn(
              "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
              large ? "text-lg" : "text-sm"
            )}
          />
          <button type="submit" className={cn(
            "rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary-glow transition-smooth",
            large ? "px-6 py-2.5" : "px-4 py-1.5 text-sm"
          )}>
            Hanapin
          </button>
        </div>
      </form>

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
