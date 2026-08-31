import { Layout } from "@/components/Layout";
import { useState } from "react";
import { ArrowLeftRight, Languages, Loader2, Volume2, Copy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { speak } from "@/lib/speak";

const LANGUAGES = [
  "Tagalog (Quezon dialect)",
  "Tagalog",
  "Filipino",
  "English",
  "Bikol",
  "Cebuano",
  "Ilocano",
  "Hiligaynon",
  "Waray",
  "Kapampangan",
  "Pangasinan",
  "Spanish",
  "Japanese",
  "Korean",
  "Mandarin Chinese",
  "Arabic",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Thai",
  "Vietnamese",
  "Indonesian",
  "Hindi",
];

const Translate = () => {
  const [source, setSource] = useState("auto");
  const [target, setTarget] = useState("English");
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const swap = () => {
    if (source === "auto") return;
    setSource(target);
    setTarget(source);
    setText(result);
    setResult(text);
  };

  const onTranslate = async () => {
    if (!text.trim()) {
      toast.error("Type something to translate.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const { data, error } = await supabase.functions.invoke("translate", {
        body: { text, target, source },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setResult((data as any).translation || "");
    } catch (e) {
      toast.error((e as Error).message || "Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="container py-8 md:py-16 max-w-3xl">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-accent font-bold">Salin</span>
        <h1 className="font-display text-2xl md:text-5xl mt-1 mb-2">Translator</h1>
        <p className="text-xs md:text-base text-muted-foreground mb-5 md:mb-8">
          Pick any language and translate words, phrases, or sentences.
        </p>

        <div className="bg-card rounded-3xl border border-border shadow-soft p-4 md:p-8 space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">From</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-input bg-background outline-none focus:border-primary transition-smooth"
              >
                <option value="auto">Detect language</option>
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={swap}
              aria-label="Swap languages"
              className="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-secondary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth disabled:opacity-40"
              disabled={source === "auto"}
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">To</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-input bg-background outline-none focus:border-primary transition-smooth"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="Isulat ang salita o pangungusap…"
            className="w-full px-4 py-3 text-sm md:text-base rounded-2xl border border-input bg-background outline-none focus:border-primary transition-smooth resize-none"
          />

          <button
            onClick={onTranslate}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-glow transition-smooth disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
            {loading ? "Translating…" : "Translate"}
          </button>

          {result && (
            <div className="rounded-2xl bg-secondary/60 border border-border p-4">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{target}</div>
              <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">{result}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => speak(result)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border text-xs hover:bg-muted transition-smooth"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Listen
                </button>
                <button
                  onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied"); }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border text-xs hover:bg-muted transition-smooth"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Translate;
