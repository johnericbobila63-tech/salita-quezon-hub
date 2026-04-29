export type WordEntry = {
  id: string;
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  category: string;
  definition: string;
  filipino: string;
  english: string;
  examples: { local: string; filipino: string; english: string }[];
  synonyms: string[];
  culturalNote?: string;
};

export const categories = [
  { id: "food", name: "Pagkain", english: "Food", icon: "🥥", count: 42 },
  { id: "culture", name: "Kultura", english: "Culture", icon: "🎭", count: 28 },
  { id: "daily", name: "Araw-araw", english: "Daily Life", icon: "🏡", count: 56 },
  { id: "nature", name: "Kalikasan", english: "Nature", icon: "🌴", count: 34 },
  { id: "traditions", name: "Tradisyon", english: "Traditions", icon: "🎉", count: 19 },
  { id: "people", name: "Tao", english: "People", icon: "👥", count: 23 },
];

export const words: WordEntry[] = [
  {
    id: "1",
    word: "Pahiyas",
    pronunciation: "pa-HI-yas",
    partOfSpeech: "noun",
    category: "traditions",
    definition: "A colorful harvest festival celebrated in Lucban, Quezon every May 15 in honor of San Isidro Labrador.",
    filipino: "Pista ng Pahiyas",
    english: "Harvest Festival",
    examples: [
      {
        local: "Tuwing Mayo, sumasali ang buong Lucban sa Pahiyas.",
        filipino: "Tuwing Mayo, sumasali ang buong Lucban sa Pahiyas.",
        english: "Every May, the entire town of Lucban joins the Pahiyas.",
      },
    ],
    synonyms: ["Pista", "Kasiyahan", "Anihan"],
    culturalNote: "Houses are decorated with kiping (colorful rice wafers), fruits, and vegetables to thank San Isidro for the bountiful harvest.",
  },
  {
    id: "2",
    word: "Kiping",
    pronunciation: "KI-ping",
    partOfSpeech: "noun",
    category: "food",
    definition: "A leaf-shaped wafer made from glutinous rice, traditionally used to decorate houses during Pahiyas.",
    filipino: "Kiping",
    english: "Rice leaf wafer",
    examples: [
      { local: "Maraming kulay ang kiping sa bahay nila.", filipino: "Maraming kulay ang kiping sa bahay nila.", english: "Their house has many colorful kiping." },
    ],
    synonyms: ["Galapong", "Palamuti"],
    culturalNote: "After the festival, kiping is taken down and grilled or fried as a snack.",
  },
  {
    id: "3",
    word: "Longganisang Lucban",
    pronunciation: "long-ga-NI-sang LUK-ban",
    partOfSpeech: "noun",
    category: "food",
    definition: "A garlicky, vinegar-rich native sausage that originated from Lucban, Quezon.",
    filipino: "Longganisang Lucban",
    english: "Lucban native sausage",
    examples: [
      { local: "Masarap ang longganisang Lucban sa almusal.", filipino: "Masarap ang longganisang Lucban sa almusal.", english: "Lucban longganisa is delicious for breakfast." },
    ],
    synonyms: ["Chorizo", "Longganisa"],
  },
  {
    id: "4",
    word: "Bahaghari",
    pronunciation: "ba-HAG-ha-ri",
    partOfSpeech: "noun",
    category: "nature",
    definition: "A rainbow that often appears after rain over the coconut fields of Quezon.",
    filipino: "Bahaghari",
    english: "Rainbow",
    examples: [
      { local: "May bahaghari pagkatapos ng ulan.", filipino: "May bahaghari pagkatapos ng ulan.", english: "There is a rainbow after the rain." },
    ],
    synonyms: ["Arko", "Kulay-langit"],
  },
  {
    id: "5",
    word: "Niyog",
    pronunciation: "NI-yog",
    partOfSpeech: "noun",
    category: "nature",
    definition: "Coconut — the most iconic crop of Quezon Province, central to its economy and cuisine.",
    filipino: "Niyog",
    english: "Coconut",
    examples: [
      { local: "Marami kaming niyog sa likod-bahay.", filipino: "Marami kaming niyog sa likod-bahay.", english: "We have many coconuts behind the house." },
    ],
    synonyms: ["Buko", "Lubi"],
    culturalNote: "Quezon is the country's largest producer of coconut, earning the nickname 'Coconut Capital of the Philippines'.",
  },
  {
    id: "6",
    word: "Hatid",
    pronunciation: "HA-tid",
    partOfSpeech: "verb",
    category: "daily",
    definition: "To bring or deliver something to someone, often with care and warmth.",
    filipino: "Maghatid",
    english: "To deliver / bring",
    examples: [
      { local: "Hatid ko sa iyo ang pagkain mamaya.", filipino: "Hahatid ko sa iyo ang pagkain mamaya.", english: "I'll bring you the food later." },
    ],
    synonyms: ["Dala", "Bigay"],
  },
  {
    id: "7",
    word: "Pansit Habhab",
    pronunciation: "pan-SIT hab-HAB",
    partOfSpeech: "noun",
    category: "food",
    definition: "A Lucban specialty noodle dish eaten directly from a banana leaf — without utensils.",
    filipino: "Pansit Habhab",
    english: "Lucban-style noodles",
    examples: [
      { local: "Subukan mong kainin ang pansit habhab sa dahon ng saging.", filipino: "Subukan mong kainin ang pansit habhab sa dahon ng saging.", english: "Try eating pansit habhab off a banana leaf." },
    ],
    synonyms: ["Pansit", "Miki"],
  },
  {
    id: "8",
    word: "Salakot",
    pronunciation: "sa-LA-kot",
    partOfSpeech: "noun",
    category: "culture",
    definition: "A wide-brimmed traditional hat woven from bamboo or rattan, worn by farmers in the fields.",
    filipino: "Salakot",
    english: "Traditional Filipino hat",
    examples: [
      { local: "Suot ng magsasaka ang salakot sa init ng araw.", filipino: "Suot ng magsasaka ang salakot sa init ng araw.", english: "The farmer wears a salakot under the hot sun." },
    ],
    synonyms: ["Sumbrero", "Takukol"],
  },
];
