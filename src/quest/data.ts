// Quezon Quest — data-driven levels & questions. Add facts to FACTS or raise LEVEL_COUNT to grow the game.
import { districts } from "@/game/data";
import { words } from "@/data/dictionary";

export const CONFIG = {
  LEVEL_COUNT: 50,
  QUESTIONS_PER_LEVEL: 5,
  QUESTIONS_PER_GATE: 10,
  GATE_EVERY: 10,
  GATE_REQUIRED_STARS: 20, // stars needed to unlock each Quest Gate
  GATE_BONUS_STARS: 5,
  HEARTS: 3,
};

export type CategoryId = "city" | "district" | "word" | "meaning" | "history" | "landmark" | "food" | "culture" | "where" | "voice";
export const CATEGORIES: Record<CategoryId, { icon: string; label: string }> = {
  city: { icon: "🏙️", label: "Guess the City" },
  district: { icon: "📍", label: "Guess the District" },
  word: { icon: "🗣️", label: "Guess the Word" },
  meaning: { icon: "📖", label: "Word Meaning" },
  history: { icon: "🏛️", label: "History Quest" },
  landmark: { icon: "🌴", label: "Landmark Hunt" },
  food: { icon: "🍲", label: "Food Quest" },
  culture: { icon: "🎉", label: "Culture Quest" },
  where: { icon: "🧭", label: "Where Is It?" },
  voice: { icon: "🔊", label: "Voice Quest" },
};

export type Difficulty = "Beginner" | "Easy" | "Intermediate" | "Advanced" | "Expert";
export const DIFFICULTIES: Difficulty[] = ["Beginner", "Easy", "Intermediate", "Advanced", "Expert"];

export type Question = {
  id: string; question: string; type: CategoryId; options: string[]; answer: string;
  explanation: string; category: CategoryId; difficulty: number; image?: string; audio?: string;
};

export type Level = {
  id: string; number: number; name: string; category: CategoryId; difficulty: Difficulty;
  isMilestone: boolean; requiredStars: number; questions: Question[];
};

type Fact = { c: CategoryId; d: number; q: string; a: string; o: string[]; e: string };
const FACTS: Fact[] = [
  { c: "city", d: 0, q: "What is the capital of Quezon Province?", a: "Lucena City", o: ["Tayabas City", "Sariaya", "Gumaca"], e: "Lucena City is the provincial capital of Quezon." },
  { c: "history", d: 0, q: "What was Quezon Province called before 1946?", a: "Tayabas", o: ["Batangas", "Laguna", "Bondoc"], e: "The province was named Tayabas until it was renamed in honor of President Manuel L. Quezon." },
  { c: "history", d: 0, q: "Quezon Province was named after which Philippine president?", a: "Manuel L. Quezon", o: ["Ramon Magsaysay", "Emilio Aguinaldo", "Sergio Osmeña"], e: "It honors Manuel L. Quezon, who was born in Baler, then part of Tayabas." },
  { c: "culture", d: 0, q: "Which town celebrates the Pahiyas Festival?", a: "Lucban", o: ["Sariaya", "Tiaong", "Mauban"], e: "Lucban celebrates Pahiyas every May 15 in honor of San Isidro Labrador." },
  { c: "culture", d: 1, q: "The Pahiyas Festival honors which patron saint?", a: "San Isidro Labrador", o: ["San Miguel Arkanghel", "San Roque", "Santo Niño"], e: "San Isidro Labrador is the patron of farmers." },
  { c: "culture", d: 1, q: "What colorful rice wafers decorate houses during Pahiyas?", a: "Kiping", o: ["Puto", "Suman", "Bibingka"], e: "Kiping are leaf-shaped wafers made of rice." },
  { c: "food", d: 0, q: "Which noodle dish is eaten straight from a banana leaf without utensils?", a: "Pansit Habhab", o: ["Pansit Canton", "Pansit Malabon", "Lomi"], e: "Pansit Habhab from Lucban is eaten by 'habhab' — directly from the leaf." },
  { c: "food", d: 1, q: "Which town is famous for its garlicky longganisa and Pansit Habhab?", a: "Lucban", o: ["Candelaria", "Unisan", "Atimonan"], e: "Lucban longganisa is one of Quezon's best-known foods." },
  { c: "food", d: 1, q: "What coconut-based liquor is a well-known product of Quezon?", a: "Lambanog", o: ["Tuba ng nipa", "Basi", "Tapuy"], e: "Lambanog is distilled from coconut sap, a Quezon specialty." },
  { c: "food", d: 2, q: "Hardinera, a festive meatloaf-like dish, is a specialty of which town?", a: "Lucban", o: ["Tiaong", "Real", "Dolores"], e: "Hardinera is a traditional Lucban fiesta dish." },
  { c: "culture", d: 1, q: "Which festival celebrates the coconut, Quezon's top crop?", a: "Niyogyogan Festival", o: ["Pahiyas Festival", "Agawan Festival", "Mayohan Festival"], e: "Niyogyogan is the provincial coconut festival held in Lucena." },
  { c: "culture", d: 2, q: "The Agawan Festival every May 15 is celebrated in which town?", a: "Sariaya", o: ["Lucban", "Tayabas City", "Pagbilao"], e: "In Sariaya's Agawan, people grab decorations from houses as a sign of blessings." },
  { c: "culture", d: 2, q: "'Mayohan sa Tayabas' is a festival of which locality?", a: "Tayabas City", o: ["Lucena City", "Sampaloc", "Infanta"], e: "Mayohan is Tayabas City's May festival featuring the hagisan ng suman." },
  { c: "landmark", d: 0, q: "Which sacred mountain lies on the border of Quezon and Laguna?", a: "Mount Banahaw", o: ["Mount Makiling", "Mount Mayon", "Mount Apo"], e: "Mount Banahaw is a pilgrimage site shared by Quezon and Laguna." },
  { c: "landmark", d: 1, q: "Kamay ni Hesus, a hilltop pilgrimage shrine, is in which town?", a: "Lucban", o: ["Tayabas City", "Sariaya", "Mauban"], e: "Kamay ni Hesus Shrine is in Lucban." },
  { c: "landmark", d: 2, q: "The key-shaped Minor Basilica of St. Michael the Archangel is in…", a: "Tayabas City", o: ["Lucena City", "Lucban", "Gumaca"], e: "Tayabas Basilica is known for its key-shaped floor plan." },
  { c: "landmark", d: 2, q: "Malagonlong Bridge, a Spanish-era stone bridge, is located in…", a: "Tayabas City", o: ["Pagbilao", "Candelaria", "Sariaya"], e: "Malagonlong Bridge in Tayabas was built in the 1840s." },
  { c: "landmark", d: 1, q: "Cagbalete Island, known for its long sandbar, belongs to which town?", a: "Mauban", o: ["Real", "Polillo", "Alabat"], e: "Cagbalete Island is part of Mauban." },
  { c: "landmark", d: 2, q: "Borawan Island, famous for rock formations, is in which town?", a: "Padre Burgos", o: ["Agdangan", "Unisan", "Pitogo"], e: "Borawan is in Padre Burgos." },
  { c: "landmark", d: 2, q: "Puting Buhangin Beach is found in which town?", a: "Pagbilao", o: ["Sariaya", "Lucena City", "Atimonan"], e: "Puting Buhangin is a white-sand beach in Pagbilao." },
  { c: "history", d: 3, q: "Hermano Puli, who led the Cofradía de San José, was from which town?", a: "Lucban", o: ["Tayabas City", "Sariaya", "Candelaria"], e: "Apolinario de la Cruz (Hermano Puli) was born in Lucban." },
  { c: "history", d: 1, q: "How many congressional districts does Quezon Province have?", a: "4", o: ["2", "3", "6"], e: "Quezon is divided into four congressional districts." },
  { c: "history", d: 2, q: "Quezon is among the country's top producers of which crop?", a: "Coconut", o: ["Sugarcane", "Coffee", "Tobacco"], e: "Quezon has one of the largest coconut areas in the Philippines." },
  { c: "where", d: 1, q: "The Polillo Islands are part of which district?", a: "District 1", o: ["District 2", "District 3", "District 4"], e: "Polillo, Burdeos, Panukulan, Patnanungan and Jomalig are in District 1." },
  { c: "where", d: 2, q: "The Bondoc Peninsula towns belong mostly to which district?", a: "District 3", o: ["District 1", "District 2", "District 4"], e: "Towns like Mulanay, Catanauan and San Narciso are in District 3." },
  { c: "where", d: 2, q: "Which island holds the towns of Alabat, Perez and Quezon?", a: "Alabat Island", o: ["Polillo Island", "Cagbalete Island", "Jomalig Island"], e: "Alabat Island lies in Lamon Bay, District 4." },
  { c: "where", d: 1, q: "Infanta, Real and General Nakar face which body of water?", a: "Pacific Ocean", o: ["Tayabas Bay", "Ragay Gulf", "Laguna de Bay"], e: "These northern towns lie on the Pacific coast." },
  { c: "where", d: 2, q: "Lucena City sits along which bay?", a: "Tayabas Bay", o: ["Lamon Bay", "Manila Bay", "Ragay Gulf"], e: "Lucena faces Tayabas Bay." },
  { c: "city", d: 1, q: "Which two localities in Quezon are cities?", a: "Lucena and Tayabas", o: ["Lucban and Sariaya", "Gumaca and Infanta", "Tiaong and Candelaria"], e: "Lucena City and Tayabas City are Quezon's two cities." },
  { c: "city", d: 3, q: "Which town is known as the 'Gateway to the Pacific' of northern Quezon?", a: "Real", o: ["Lopez", "Unisan", "Dolores"], e: "Real connects Metro Manila routes to the Pacific coast of Quezon." },
];

const rngFor = (seed: number) => () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
const shuffle = <T,>(a: T[], r: () => number) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const pick = <T,>(a: T[], r: () => number) => a[Math.floor(r() * a.length)];

const allTowns = districts.flatMap((d) => d.localities.map((l) => ({ town: l.name, district: d.name })));
const usable = words.filter((w) => w.english && w.word);

const makeQ = (id: string, c: CategoryId, d: number, q: string, a: string, wrong: string[], e: string, r: () => number, extra: Partial<Question> = {}): Question => ({
  id, question: q, type: c, category: c, difficulty: d, answer: a, explanation: e,
  options: shuffle([a, ...shuffle(wrong.filter((w) => w !== a), r).slice(0, 3)], r), ...extra,
});

const generate = (c: CategoryId, tier: number, r: () => number, id: string): Question => {
  if (c === "district") {
    const t = pick(allTowns, r);
    return makeQ(id, c, tier, `Which district is ${t.town} in?`, t.district, districts.map((d) => d.name), `${t.town} belongs to ${t.district} of Quezon.`, r);
  }
  if (c === "where" && r() < 0.5) {
    const d = pick(districts, r); const t = pick(d.localities, r).name;
    const wrong = allTowns.filter((x) => x.district !== d.name).map((x) => x.town);
    return makeQ(id, c, tier, `Which of these is in ${d.name}?`, t, wrong, `${t} is part of ${d.name}.`, r);
  }
  if (c === "meaning" || c === "word" || c === "voice") {
    const w = pick(usable, r);
    const others = usable.filter((x) => x.id !== w.id);
    if (c === "meaning") return makeQ(id, c, tier, `What does "${w.word}" mean?`, w.english, others.map((x) => x.english), w.definition, r);
    if (c === "word") return makeQ(id, c, tier, `Which local word means "${w.english}"?`, w.word, others.map((x) => x.word), `${w.word} (${w.pronunciation}) — ${w.definition}`, r);
    return makeQ(id, c, tier, "Listen 🔊 — which word did you hear?", w.word, others.map((x) => x.word), `${w.word} is pronounced ${w.pronunciation}.`, r, { audio: w.word });
  }
  // fact-based categories — prefer facts at or below current tier
  const pool = FACTS.filter((f) => f.c === c && f.d <= tier + 1);
  const pool2 = pool.length ? pool : FACTS.filter((f) => f.d <= tier + 1);
  const f = pick(pool2, r);
  return makeQ(id, f.c, f.d, f.q, f.a, f.o, f.e, r);
};

const NAMES = ["Getting Started", "Know Your Quezon", "City Explorer", "Local Words", "Festival Fever", "District Dash", "Quezon Word Hunt", "Landmark Trail", "Taste of Quezon",
  "Coastal Clues", "Voice of the Town", "Banahaw Ascent", "Heritage Roads", "Meaning Makers", "Island Hopper", "Bondoc Journey", "Coconut Country", "Pahiyas Path", "Old Tayabas"];
const GATES = ["Quezon Trial", "Local Master Trial", "Quezon Explorer Trial", "Culture Master Trial", "Legend Trial"];
const ROTATION: CategoryId[] = ["city", "word", "district", "meaning", "culture", "landmark", "food", "history", "where", "voice"];

export const levels: Level[] = Array.from({ length: CONFIG.LEVEL_COUNT }, (_, i) => {
  const n = i + 1; const tier = Math.min(4, Math.floor(i / 10));
  const isMilestone = n % CONFIG.GATE_EVERY === 0;
  const category = isMilestone ? "history" : ROTATION[i % ROTATION.length];
  const r = rngFor(n * 7919);
  const count = isMilestone ? CONFIG.QUESTIONS_PER_GATE : CONFIG.QUESTIONS_PER_LEVEL;
  const seen = new Set<string>(); const questions: Question[] = [];
  for (let k = 0; questions.length < count && k < 60; k++) {
    // Gates & higher tiers mix in more categories
    const c = isMilestone || r() < 0.15 + tier * 0.12 ? pick(ROTATION, r) : category;
    const q = generate(c, tier, r, `L${n}Q${questions.length + 1}`);
    if (!seen.has(q.question)) { seen.add(q.question); questions.push(q); }
  }
  return {
    id: `L${n}`, number: n, category, difficulty: DIFFICULTIES[tier], isMilestone,
    requiredStars: isMilestone ? CONFIG.GATE_REQUIRED_STARS : 0,
    name: isMilestone ? GATES[(n / 10 - 1) % GATES.length] : NAMES[(i - Math.floor(i / 10)) % NAMES.length],
    questions,
  };
});

export const MAX_STARS = levels.length * 3 + levels.filter((l) => l.isMilestone).length * CONFIG.GATE_BONUS_STARS;
