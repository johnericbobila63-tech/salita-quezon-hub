import { Layout } from "@/components/Layout";
import { words } from "@/data/dictionary";
import { Volume2, Mic } from "lucide-react";
import { speak } from "@/lib/speak";

const Pronunciation = () => (
  <Layout>
    <section className="container py-12 md:py-16">
      <span className="text-xs uppercase tracking-[0.3em] text-accent font-bold">Bigkas</span>
      <h1 className="font-display text-4xl md:text-5xl mt-2 mb-3">Pronunciation Library</h1>
      <p className="text-muted-foreground max-w-2xl mb-10 text-lg">
        Pakinggan kung paano bigkasin ang mga salita ng Quezon. Pindutin ang play upang marinig ang tunog at intonasyon.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {words.map((w) => (
          <div key={w.id} className="bg-card rounded-2xl border border-border p-6 flex items-center gap-5 shadow-card hover:shadow-soft transition-smooth">
            <div className="grid place-items-center w-14 h-14 rounded-full bg-gradient-warm text-accent-foreground shrink-0">
              <Mic className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-xl font-semibold">{w.word}</div>
              <div className="text-xs text-muted-foreground">/{w.pronunciation}/ · {w.partOfSpeech}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => speak(w.word, "female")} title="Female voice" className="grid place-items-center w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Volume2 className="w-4 h-4" />
              </button>
              <button onClick={() => speak(w.word, "male")} title="Male voice" className="grid place-items-center w-10 h-10 rounded-full bg-secondary hover:bg-ocean hover:text-ocean-foreground transition-smooth">
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default Pronunciation;
