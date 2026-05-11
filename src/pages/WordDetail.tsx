import { Layout } from "@/components/Layout";
import { words } from "@/data/dictionary";
import { useParams, Link } from "react-router-dom";
import { Volume2, ArrowLeft, Sparkles, Bookmark, BookmarkCheck } from "lucide-react";
import { speak } from "@/lib/speak";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { useSavedWords } from "@/lib/saved";
import { toast } from "sonner";

const WordDetail = () => {
  const { id } = useParams();
  const word = words.find((w) => w.id === id);
  const { isSaved, toggle } = useSavedWords();
  if (!word) return <Layout><div className="container py-20 text-center">Word not found.</div></Layout>;
  const saved = isSaved(word.id);
  const handleSave = () => {
    toggle(word.id);
    toast.success(saved ? `Removed "${word.word}" from saved` : `Saved "${word.word}"`);
  };

  return (
    <Layout>
      <article className="container py-12 md:py-16 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <header className="bg-card rounded-3xl border border-border shadow-soft p-8 md:p-12 mb-8">
          <span className="text-[10px] uppercase tracking-widest font-bold text-accent">{word.partOfSpeech} · {word.category}</span>
          <h1 className="font-display text-5xl md:text-7xl mt-3 mb-3">{word.word}</h1>
          <p className="text-lg text-muted-foreground mb-6">/{word.pronunciation}/</p>

          <div className="flex flex-wrap gap-3 mb-6">
            <VoiceRecorder wordKey={`word-${word.id}`} label="My Voice" />
            <button onClick={() => speak(word.word, "female")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary-glow transition-smooth">
              <Volume2 className="w-4 h-4" /> AI (Babae)
            </button>
            <button onClick={() => speak(word.word, "male")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ocean text-ocean-foreground hover:opacity-90 transition-smooth">
              <Volume2 className="w-4 h-4" /> AI (Lalaki)
            </button>
            <button
              onClick={handleSave}
              aria-pressed={saved}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border transition-smooth ${saved ? "bg-saffron text-saffron-foreground border-transparent" : "border-border hover:bg-muted"}`}
            >
              {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {saved ? "Saved" : "Save"}
            </button>
          </div>

          <p className="text-xl leading-relaxed text-foreground">{word.definition}</p>

          <div className="grid sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-border">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Filipino</div>
              <div className="font-display text-lg">{word.filipino}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">English</div>
              <div className="font-display text-lg">{word.english}</div>
            </div>
          </div>
        </header>

        <section className="bg-card rounded-3xl border border-border p-8 md:p-10 mb-8">
          <h2 className="font-display text-2xl mb-6">Halimbawa · Examples</h2>
          <div className="space-y-6">
            {word.examples.map((ex, i) => (
              <div key={i} className="border-l-4 border-saffron pl-5 py-1">
                <p className="font-display text-lg italic mb-2">"{ex.local}"</p>
                <p className="text-sm text-muted-foreground">🇵🇭 {ex.filipino}</p>
                <p className="text-sm text-muted-foreground">🇬🇧 {ex.english}</p>
              </div>
            ))}
          </div>
        </section>

        {word.synonyms.length > 0 && (
          <section className="bg-card rounded-3xl border border-border p-8 mb-8">
            <h2 className="font-display text-2xl mb-4">Kahalintulad · Related</h2>
            <div className="flex flex-wrap gap-2">
              {word.synonyms.map((s) => (
                <span key={s} className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">{s}</span>
              ))}
            </div>
          </section>
        )}

        {word.culturalNote && (
          <section className="rounded-3xl bg-gradient-warm text-accent-foreground p-8 md:p-10">
            <Sparkles className="w-6 h-6 mb-3" />
            <h2 className="font-display text-2xl mb-3">Cultural Note</h2>
            <p className="leading-relaxed">{word.culturalNote}</p>
          </section>
        )}
      </article>
    </Layout>
  );
};

export default WordDetail;
