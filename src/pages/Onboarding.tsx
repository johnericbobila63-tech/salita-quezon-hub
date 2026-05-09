import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type StepKey = "purpose" | "useful" | "age" | "location";

const steps: StepKey[] = ["purpose", "useful", "age", "location"];

const STEP_DATA: Record<
  StepKey,
  { title: string; subtitle?: string; options: string[]; multi?: boolean; minSelect?: number; allowOther?: boolean }
> = {
  purpose: {
    title: "What brings you to Wikang Quezon app?",
    options: [
      "Learn Quezonian word",
      "Explore Quezonian deep word",
      "Engaging in academic studies",
      "Using language for work",
    ],
  },
  useful: {
    title: "What will be most useful to you?",
    subtitle: "Choose at least 2 items.",
    multi: true,
    minSelect: 2,
    options: ["Word meanings", "Examples", "Pronunciation", "Translations"],
  },
  age: {
    title: "What is your age?",
    options: ["12-19", "20-29", "30-39", "40 above"],
  },
  location: {
    title: "Where in Quezon Province you are from?",
    allowOther: true,
    options: [
      "City of Tayabas", "Candelaria", "Mauban", "Catanauan", "Sariaya", "Dolores",
      "Agdangan", "General Luna", "Alabat", "General Nakar", "Atimonan", "Guinayangan",
      "Buenavista", "Gumaca", "Burdeos", "Infanta", "Calauag", "Jomalig",
    ],
  },
};

const Onboarding = () => {
  const { step } = useParams<{ step: StepKey }>();
  const navigate = useNavigate();
  const currentKey = (step && steps.includes(step) ? step : "purpose") as StepKey;
  const data = STEP_DATA[currentKey];
  const idx = steps.indexOf(currentKey);

  const [selections, setSelections] = useState<string[]>([]);
  const [other, setOther] = useState("");

  const toggle = (opt: string) => {
    if (data.multi) {
      setSelections((s) => (s.includes(opt) ? s.filter((x) => x !== opt) : [...s, opt]));
    } else {
      setSelections([opt]);
    }
  };

  const persist = () => {
    const all = [...selections, ...(other.trim() ? [other.trim()] : [])];
    const stored = JSON.parse(localStorage.getItem("wq_onboarding") || "{}");
    stored[currentKey] = all;
    localStorage.setItem("wq_onboarding", JSON.stringify(stored));
  };

  const canContinue = data.multi
    ? selections.length >= (data.minSelect || 1)
    : selections.length > 0 || (data.allowOther && other.trim().length > 0);

  const handleContinue = () => {
    if (!canContinue) return;
    persist();
    if (idx < steps.length - 1) {
      navigate(`/onboarding/${steps[idx + 1]}`);
      setSelections([]);
      setOther("");
    } else {
      localStorage.setItem("wq_onboarded", "1");
      navigate("/");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("wq_onboarded", "1");
    navigate("/");
  };

  const handleBack = () => {
    if (idx === 0) navigate("/welcome");
    else navigate(`/onboarding/${steps[idx - 1]}`);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-background px-6 pt-safe pb-safe py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={handleSkip} className="text-sm text-muted-foreground hover:text-foreground">
          Skip
        </button>
        <div className="flex items-center gap-2">
          {steps.map((_, i) => (
            <span
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-smooth",
                i === idx ? "bg-primary w-6" : "bg-muted-foreground/30",
              )}
            />
          ))}
        </div>
        <button onClick={handleBack} className="text-sm text-muted-foreground hover:text-foreground">
          Back
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 animate-fade-up">
        <h1 className="font-display text-3xl font-semibold text-foreground mb-2 text-balance">
          {data.title}
        </h1>
        {data.subtitle && (
          <p className="text-sm text-muted-foreground mb-6">{data.subtitle}</p>
        )}

        <div className={cn(
          "mt-6 gap-3",
          currentKey === "location" || currentKey === "useful"
            ? "grid grid-cols-2"
            : "flex flex-col",
        )}>
          {data.options.map((opt) => {
            const active = selections.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className={cn(
                  "px-4 py-3 rounded-xl border text-left text-sm font-medium transition-smooth",
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-soft"
                    : "bg-card text-card-foreground border-border hover:border-primary/40",
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {data.allowOther && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <label className="text-muted-foreground">Enter other City:</label>
            <input
              value={other}
              onChange={(e) => setOther(e.target.value)}
              className="flex-1 bg-transparent border-b border-border focus:outline-none focus:border-primary py-1"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <button
        onClick={handleContinue}
        disabled={!canContinue}
        className={cn(
          "w-full py-4 rounded-2xl font-semibold text-lg transition-smooth mt-6",
          canContinue
            ? "bg-primary text-primary-foreground hover:bg-primary-glow shadow-soft"
            : "bg-muted text-muted-foreground cursor-not-allowed",
        )}
      >
        Continue
      </button>
    </div>
  );
};

export default Onboarding;
