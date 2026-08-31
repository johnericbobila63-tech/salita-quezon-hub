import { Layout } from "@/components/Layout";
import { categories, words } from "@/data/dictionary";
import { WordCard } from "@/components/WordCard";
import { useSearchParams } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";

const Categories = () => {
  const [params, setParams] = useSearchParams();
  const active = params.get("c");
  const activeCity = params.get("city");
  const activeDistrict = active ? categories.find((c) => c.id === active) : null;
  const list = words.filter((w) => {
    if (active && w.category !== active) return false;
    if (activeCity && w.city !== activeCity) return false;
    return true;
  });

  return (
    <Layout>
      <section className="container py-6 md:py-16">
        <span className="text-xs uppercase tracking-[0.3em] text-accent font-bold">Mga Distrito</span>
        <h1 className="font-display text-2xl md:text-5xl mt-2 mb-6">Browse by District</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-10">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setParams({ c: c.id })}
              className={`p-3.5 md:p-5 rounded-2xl text-left border transition-smooth ${active === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"}`}
            >
              <div className="text-2xl md:text-3xl mb-1.5">{c.icon}</div>
              <div className="font-display font-semibold">{c.name}</div>
              <div className={`text-xs mt-1 ${active === c.id ? "opacity-80" : "text-muted-foreground"}`}>{c.cities.length} cities · {c.count} words</div>
            </button>
          ))}
        </div>

        {activeDistrict && (
          <div className="mb-10">
            <h2 className="font-display text-xl mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" /> Cities in {activeDistrict.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setParams(active ? { c: active } : {})}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${!activeCity ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted"}`}
              >
                All cities
              </button>
              {activeDistrict.cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setParams({ c: active!, city })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${activeCity === city ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted"}`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}

        {!active && (
          <div className="mb-8 space-y-4 md:space-y-8">
            {categories.map((district) => (
              <div key={district.id} className="bg-card rounded-2xl border border-border p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{district.icon}</span>
                    <div>
                      <h3 className="font-display text-xl font-semibold">{district.name}</h3>
                      <p className="text-xs text-muted-foreground">{district.english} · {district.cities.length} cities</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setParams({ c: district.id })}
                    className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                  >
                    View words <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {district.cities.map((city) => (
                    <span key={city} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground">
                      <MapPin className="w-3 h-3" /> {city}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {active && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl">
                {activeDistrict?.name} words
                {activeCity && <span className="text-base font-normal text-muted-foreground"> · {activeCity}</span>}
              </h2>
              <span className="text-sm text-muted-foreground">{list.length} result{list.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
              {list.map((w) => <WordCard key={w.id} word={w} />)}
            </div>
          </>
        )}
      </section>
    </Layout>
  );
};

export default Categories;
