import { Volume2, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { WordEntry } from "@/data/dictionary";
import { speak } from "@/lib/speak";

export const WordCard = ({ word }: { word: WordEntry }) => (
  <Link
    to={`/word/${word.id}`}
    className="group block bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-warm transition-smooth hover:-translate-y-1"
  >
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="font-display text-2xl font-semibold text-foreground">{word.word}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">/{word.pronunciation}/</p>
      </div>
      <button
        onClick={(e) => { e.preventDefault(); speak(word.word); }}
        className="grid place-items-center w-9 h-9 rounded-full bg-secondary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
        aria-label="Listen"
      >
        <Volume2 className="w-4 h-4" />
      </button>
    </div>
    <span className="inline-block text-[10px] uppercase tracking-widest font-semibold text-accent mb-2">
      {word.partOfSpeech}
    </span>
    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{word.definition}</p>
    <div className="flex items-center gap-1 text-sm text-primary font-medium">
      Read more <ArrowUpRight className="w-4 h-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </div>
  </Link>
);
