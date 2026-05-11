import { Layout } from "@/components/Layout";
import { useSavedWords } from "@/lib/saved";
import { words } from "@/data/dictionary";
import { WordCard } from "@/components/WordCard";
import { BookmarkX, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

const Saved = () => {
  const { ids } = useSavedWords();
  const saved = words.filter((w) => ids.includes(w.id));

  return (
    <Layout>
      <section className="container py-10 max-w-4xl">
        <div className="flex items-center gap-3 mb-2">
          <Bookmark className="w-6 h-6 text-primary" />
          <h1 className="font-display text-3xl">Saved Words</h1>
        </div>
        <p className="text-muted-foreground mb-8">Iyong mga naka-save na salita para sa mabilis na pag-balik-aral.</p>

        {saved.length === 0 ? (
          <div className="bg-card rounded-3xl border border-border p-10 text-center">
            <BookmarkX className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">Wala ka pang naka-save na salita.</p>
            <Link to="/categories" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary-glow transition-smooth">
              Browse words
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {saved.map((w) => <WordCard key={w.id} word={w} />)}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Saved;
