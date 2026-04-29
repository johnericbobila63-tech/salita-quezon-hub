import { Layout } from "@/components/Layout";
import { categories, words } from "@/data/dictionary";
import { WordCard } from "@/components/WordCard";
import { useSearchParams } from "react-router-dom";

const Categories = () => {
  const [params, setParams] = useSearchParams();
  const active = params.get("c");
  const list = active ? words.filter((w) => w.category === active) : words;

  return (
    <Layout>
      <section className="container py-12 md:py-16">
        <span className="text-xs uppercase tracking-[0.3em] text-accent font-bold">Mga Kategorya</span>
        <h1 className="font-display text-4xl md:text-5xl mt-2 mb-8">Categories</h1>

        <div className="flex flex-wrap gap-2 mb-10">
          <button onClick={() => setParams({})} className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${!active ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted"}`}>All</button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setParams({ c: c.id })} className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${active === c.id ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted"}`}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((w) => <WordCard key={w.id} word={w} />)}
        </div>
      </section>
    </Layout>
  );
};

export default Categories;
