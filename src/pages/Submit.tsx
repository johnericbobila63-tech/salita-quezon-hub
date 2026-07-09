import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Mic, Send, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { categories } from "@/data/dictionary";


const schema = z.object({
  word: z.string().trim().min(1, "Required").max(60),
  pronunciation: z.string().trim().max(80).optional().or(z.literal("")),
  category: z.string().min(1),
  definition: z.string().trim().min(10, "Please give a brief definition").max(500),
  example: z.string().trim().max(300).optional().or(z.literal("")),
  contributor: z.string().trim().max(80).optional().or(z.literal("")),
});

const Submit = () => {
  const [submitted, setSubmitted] = useState(false);
  const [recording, setRecording] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const result = schema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }
    setSubmitted(true);
    toast.success("Salamat! Your submission is queued for moderation.");
  };

  if (submitted) {
    return (
      <Layout>
        <section className="container py-24 max-w-xl text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto text-primary mb-4" />
          <h1 className="font-display text-4xl mb-3">Maraming salamat!</h1>
          <p className="text-muted-foreground mb-6">Your word has been submitted for review by our local moderators.</p>
          <button onClick={() => setSubmitted(false)} className="px-6 py-3 rounded-full bg-primary text-primary-foreground">Submit another</button>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container py-12 md:py-16 max-w-2xl">
        <span className="text-xs uppercase tracking-[0.3em] text-accent font-bold">Mag-ambag</span>
        <h1 className="font-display text-4xl md:text-5xl mt-2 mb-3">Submit a Word</h1>
        <p className="text-muted-foreground mb-8">
          Help us grow the dictionary. Submissions are reviewed by local moderators before being published.
        </p>

        <form onSubmit={onSubmit} className="bg-card rounded-3xl border border-border shadow-soft p-8 space-y-5">
          <Field label="Word *" name="word" placeholder="e.g. Hatid" />
          <Field label="Pronunciation guide" name="pronunciation" placeholder="e.g. HA-tid" />
          <div>
            <label className="block text-sm font-medium mb-2">District *</label>
            <select name="category" required className="w-full px-4 py-3 rounded-xl border border-input bg-background outline-none focus:border-primary transition-smooth">
              <option value="">Select district…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name} · {c.english}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">City / Municipality (optional)</label>
            <select name="city" className="w-full px-4 py-3 rounded-xl border border-input bg-background outline-none focus:border-primary transition-smooth">
              <option value="">Select city…</option>
              {categories.flatMap((c) => c.cities.map((city) => (
                <option key={`${c.id}-${city}`} value={city}>{city}</option>
              )))}
            </select>
          </div>
          <Field label="Definition *" name="definition" textarea placeholder="Briefly describe the meaning…" />
          <Field label="Example sentence" name="example" textarea placeholder="Use the word in a sentence (any dialect)…" />
          <Field label="Your name (optional)" name="contributor" placeholder="So we can credit you" />

          <div className="rounded-2xl border-2 border-dashed border-border p-5 flex items-center justify-between gap-4">
            <div>
              <div className="font-medium flex items-center gap-2"><Mic className="w-4 h-4 text-accent" /> Voice recording (optional)</div>
              <p className="text-xs text-muted-foreground mt-1">Upload your pronunciation to help others learn the local accent.</p>
            </div>
            <button type="button" onClick={() => setRecording(!recording)} className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${recording ? "bg-destructive text-destructive-foreground" : "bg-secondary hover:bg-muted"}`}>
              {recording ? "Stop" : "Record"}
            </button>
          </div>

          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary-glow transition-smooth">
            <Send className="w-4 h-4" /> Submit for review
          </button>
        </form>
      </section>
    </Layout>
  );
};

const Field = ({ label, name, placeholder, textarea }: { label: string; name: string; placeholder?: string; textarea?: boolean }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    {textarea ? (
      <textarea name={name} placeholder={placeholder} rows={3} maxLength={500} className="w-full px-4 py-3 rounded-xl border border-input bg-background outline-none focus:border-primary transition-smooth resize-none" />
    ) : (
      <input name={name} placeholder={placeholder} maxLength={80} className="w-full px-4 py-3 rounded-xl border border-input bg-background outline-none focus:border-primary transition-smooth" />
    )}
  </div>
);

export default Submit;
