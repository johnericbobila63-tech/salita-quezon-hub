import { Layout } from "@/components/Layout";
import { SearchBar } from "@/components/SearchBar";
import { WordCard } from "@/components/WordCard";
import { categories, words } from "@/data/dictionary";
import { useSearchParams } from "react-router-dom";

const Search = () => {
  const [params] = useSearchParams();
  const q = params.get("q")?.toLowerCase() ?? "";
  const results = words.filter((w) => {
    const district = categories.find((c) => c.id === w.category);
    const text = [w.word, w.english, w.definition, w.filipino, w.city, district?.name, district?.english].filter(Boolean).join(" ").toLowerCase();
    return text.includes(q);
  });

  return (
    <Layout>
      <section className="container py-12 md:py-16">
        <h1 className="font-display text-4xl md:text-5xl mb-6">Search</h1>
        <div className="max-w-2xl mb-8">
          <SearchBar defaultValue={q} />
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          {results.length} {results.length === 1 ? "result" : "results"} for <span className="font-semibold text-foreground">"{q}"</span>
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((w) => <WordCard key={w.id} word={w} />)}
        </div>
        {results.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            Walang nahanap. Try a different word.
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Search;
