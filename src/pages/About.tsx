import { Layout } from "@/components/Layout";
import { Heart, BookOpen, Users, Globe } from "lucide-react";

const About = () => (
  <Layout>
    <section className="container py-12 md:py-20 max-w-4xl">
      <span className="text-xs uppercase tracking-[0.3em] text-accent font-bold">Ang Proyekto</span>
      <h1 className="font-display text-4xl md:text-6xl mt-2 mb-6 text-balance">Preserving the voice of Quezon Province.</h1>
      <p className="text-xl text-muted-foreground leading-relaxed mb-12">
        Wikang Quezon is a community heritage project documenting the unique Tagalog dialect spoken across Lucban, Tayabas, Lucena, and the coconut towns of Quezon — so that every word, every story, every accent endures.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        {[
          { icon: BookOpen, title: "Living Dictionary", text: "Hundreds of words with definitions, usage, and cultural context." },
          { icon: Heart, title: "Cultural Heritage", text: "Stories behind festivals like Pahiyas and the food, music, and crafts they inspire." },
          { icon: Users, title: "Community-Driven", text: "Anyone can contribute new words, recordings, or corrections — moderated by local volunteers." },
          { icon: Globe, title: "Open & Free", text: "Built for students, researchers, balikbayans, and anyone curious about Filipino languages." },
        ].map((f) => (
          <div key={f.title} className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <f.icon className="w-7 h-7 text-primary mb-3" />
            <h3 className="font-display text-xl mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-warm rounded-3xl p-10 text-accent-foreground">
        <h2 className="font-display text-3xl mb-4">Our mission</h2>
        <p className="leading-relaxed text-lg">
          Languages live when they are used. By making Quezon's distinctive vocabulary accessible online — with audio, examples, and cultural notes — we help the next generation hear and speak the words of their lolas and lolos.
        </p>
      </div>
    </section>
  </Layout>
);

export default About;
