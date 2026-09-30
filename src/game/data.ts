// Quezon Voice Quest — locality data grouped by congressional district.
// Coordinates are approximate town-centre lat/lng used for map placement.
export type Locality = { name: string; lat: number; lng: number };
export type District = { id: number; name: string; color: string; localities: Locality[] };

export const districts: District[] = [
  {
    id: 1, name: "District 1", color: "var(--game-d1)",
    localities: [
      { name: "General Nakar", lat: 14.76, lng: 121.63 },
      { name: "Infanta", lat: 14.74, lng: 121.65 },
      { name: "Jomalig", lat: 14.70, lng: 122.38 },
      { name: "Lucban", lat: 14.11, lng: 121.56 },
      { name: "Mauban", lat: 14.19, lng: 121.73 },
      { name: "Pagbilao", lat: 13.97, lng: 121.69 },
      { name: "Panukulan", lat: 14.93, lng: 121.81 },
      { name: "Patnanungan", lat: 14.78, lng: 122.19 },
      { name: "Polillo", lat: 14.71, lng: 121.94 },
      { name: "Real", lat: 14.66, lng: 121.60 },
      { name: "Sampaloc", lat: 14.16, lng: 121.64 },
      { name: "Tayabas City", lat: 14.03, lng: 121.59 },
    ],
  },
  {
    id: 2, name: "District 2", color: "var(--game-d2)",
    localities: [
      { name: "Candelaria", lat: 13.93, lng: 121.42 },
      { name: "Dolores", lat: 14.01, lng: 121.40 },
      { name: "San Antonio", lat: 13.90, lng: 121.29 },
      { name: "Sariaya", lat: 13.96, lng: 121.53 },
      { name: "Tiaong", lat: 13.95, lng: 121.32 },
      { name: "Lucena City", lat: 13.93, lng: 121.62 },
    ],
  },
  {
    id: 3, name: "District 3", color: "var(--game-d3)",
    localities: [
      { name: "Agdangan", lat: 13.88, lng: 121.91 },
      { name: "Buenavista", lat: 13.74, lng: 122.47 },
      { name: "Catanauan", lat: 13.59, lng: 122.32 },
      { name: "General Luna", lat: 13.69, lng: 122.17 },
      { name: "Macalelon", lat: 13.75, lng: 122.14 },
      { name: "Mulanay", lat: 13.52, lng: 122.40 },
      { name: "Padre Burgos", lat: 13.92, lng: 121.81 },
      { name: "Pitogo", lat: 13.78, lng: 122.09 },
      { name: "San Andres", lat: 13.32, lng: 122.68 },
      { name: "San Francisco", lat: 13.35, lng: 122.52 },
      { name: "San Narciso", lat: 13.57, lng: 122.57 },
      { name: "Unisan", lat: 13.84, lng: 121.98 },
    ],
  },
  {
    id: 4, name: "District 4", color: "var(--game-d4)",
    localities: [
      { name: "Alabat", lat: 14.10, lng: 122.01 },
      { name: "Atimonan", lat: 14.00, lng: 121.92 },
      { name: "Calauag", lat: 13.96, lng: 122.29 },
      { name: "Guinayangan", lat: 13.90, lng: 122.45 },
      { name: "Gumaca", lat: 13.92, lng: 122.10 },
      { name: "Lopez", lat: 13.88, lng: 122.26 },
      { name: "Perez", lat: 14.19, lng: 121.93 },
      { name: "Plaridel", lat: 13.95, lng: 122.02 },
      { name: "Quezon", lat: 14.04, lng: 122.19 },
      { name: "Tagkawayan", lat: 13.97, lng: 122.54 },
    ],
  },
];

export const TOTAL_LOCALITIES = districts.reduce((n, d) => n + d.localities.length, 0);

// Map projection into SVG space
export const MAP_W = 460, MAP_H = 520;
export const project = (lat: number, lng: number) => ({
  x: 20 + (lng - 121.2) * 270,
  y: 20 + (15.05 - lat) * 270,
});

export type Level = {
  n: number; title: string; description: string;
  reps: number; showListen: boolean; phrase: (name: string) => string;
};

export const PASS_SCORE = 80;

export const levels: Level[] = [
  { n: 1, title: "Beginner", description: "Speak the location name.", reps: 1, showListen: true, phrase: (n) => n },
  { n: 2, title: "Easy", description: "Speak the name 3 times.", reps: 3, showListen: true, phrase: (n) => n },
  { n: 3, title: "Intermediate", description: "Say a longer phrase.", reps: 1, showListen: true, phrase: (n) => `Bumisita ako sa ${n}` },
  { n: 4, title: "Advanced", description: "No Listen help this time.", reps: 1, showListen: false, phrase: (n) => `Taga ${n} ako` },
  { n: 5, title: "Master", description: "Master challenge, no help.", reps: 1, showListen: false, phrase: (n) => `Ang ${n} ay bahagi ng Lalawigan ng Quezon` },
];
