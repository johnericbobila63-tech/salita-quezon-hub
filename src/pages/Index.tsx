import { Layout } from "@/components/Layout";
import { SearchBar } from "@/components/SearchBar";
import { WordCard } from "@/components/WordCard";
import { categories, words } from "@/data/dictionary";
import hero from "@/assets/hero-quezon.jpg";
import pattern from "@/assets/pattern-kiping.jpg";
import { Link } from "react-router-dom";
import { Sparkles, BookOpen, Mic, Heart } from "lucide-react";
import { speak } from "@/lib/speak";

const Index = () => {
  const wordOfDay = words[0];
  const featured = words.slice(1, 5);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={hero} alt="Quezon Province landscape with coconut trees and Mount Banahaw" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>
        <div className="relative container py-20 md:py-32">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron/90 text-saffron-foreground text-xs font-semibold uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Heritage Dictionary · Lalawigan ng Quezon
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-semibold text-primary-foreground text-balance leading-[1.05] mb-5">
              Ang wika natin, <em className="not-italic text-saffron">aming yaman.</em>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mb-10 text-balance">
              Discover, listen, and preserve the rich Tagalog dialect of Quezon Province — from Pahiyas traditions to everyday words rooted in coconut country.
            </p>
            <SearchBar large />
            <div className="mt-6 flex flex-wrap gap-2 text-sm text-primary-foreground/80">
              <span>Try:</span>
              {["Pahiyas", "Niyog", "Kiping", "Salakot"].map((t) => (
                <Link key={t} to={`/search?q=${t}`} className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 transition-smooth backdrop-blur-sm">{t}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Word of the Day */}
      <section className="container py-16 md:py-20">
        <div className="grid md:grid-cols-5 gap-8 items-center bg-card rounded-3xl border border-border shadow-soft overflow-hidden">
          <div className="md:col-span-2 relative h-64 md:h-full bg-gradient-warm">
            <img src={pattern} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" loading="lazy" />
            <div className="absolute inset-0 grid place-items-center p-8">
              <div className="text-center text-primary-foreground">
                <div className="text-xs uppercase tracking-[0.3em] mb-2 opacity-80">Word of the Day</div>
                <div className="font-display text-5xl md:text-6xl font-semibold animate-float">{wordOfDay.word}</div>
                <div className="mt-2 text-sm opacity-90">/{wordOfDay.pronunciation}/</div>
              </div>
            </div>
          </div>
          <div className="md:col-span-3 p-8 md:p-12">
            <span className="text-[10px] uppercase tracking-widest font-bold text-accent">{wordOfDay.partOfSpeech} · {wordOfDay.category}</span>
            <h2 className="font-display text-3xl mt-2 mb-4">{wordOfDay.word}</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">{wordOfDay.definition}</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => speak(wordOfDay.word)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary-glow transition-smooth">
                <Mic className="w-4 h-4" /> Listen
              </button>
              <Link to={`/word/${wordOfDay.id}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border hover:bg-muted transition-smooth">
                Full entry →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-bold">Mga Kategorya</span>
            <h2 className="font-display text-3xl md:text-4xl mt-2">Browse by theme</h2>
          </div>
          <Link to="/categories" className="hidden md:block text-sm font-medium text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c) => (
            <Link key={c.id} to={`/categories?c=${c.id}`} className="group bg-card rounded-2xl border border-border p-5 text-center hover:shadow-warm hover:-translate-y-1 transition-smooth">
              <div className="text-4xl mb-3 transition-smooth group-hover:scale-110">{c.icon}</div>
              <div className="font-display font-semibold">{c.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.english} · {c.count}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured words */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-bold">Featured</span>
            <h2 className="font-display text-3xl md:text-4xl mt-2">Words to know</h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((w) => <WordCard key={w.id} word={w} />)}
        </div>
      </section>

      {/* Cultural Note */}
      <section className="container py-16">
        <div className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground p-10 md:p-16">
          <img src={pattern} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" loading="lazy" />
          <div className="relative max-w-3xl">
            <Heart className="w-8 h-8 mb-4 text-saffron" />
            <h2 className="font-display text-3xl md:text-4xl mb-4">Cultural Notes</h2>
            <p className="text-primary-foreground/85 leading-relaxed text-lg mb-6">
              Sa Quezon, ang bawat salita ay may dalang kuwento — mula sa kulay-kulay na kiping ng Pahiyas, sa amoy ng longganisang Lucban, hanggang sa hangin sa ilalim ng niyugan. Bawat termino ay tahanan ng ating pagkakakilanlan.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-saffron text-saffron-foreground font-medium hover:opacity-90 transition-smooth">
              Learn about the project <BookOpen className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
