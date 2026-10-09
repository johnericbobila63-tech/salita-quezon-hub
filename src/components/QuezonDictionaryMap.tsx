import { useMemo, useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { QuezonMap } from "@/game/QuezonMap";
import { District } from "@/game/data";
import { Button } from "@/components/ui/button";
import { words } from "@/data/dictionary";
import { WordCard } from "@/components/WordCard";

const categoryByDistrict: Record<number, string> = {
  1: "1st-district",
  2: "2nd-district",
  3: "3rd-district",
  4: "4th-district",
};

export const QuezonDictionaryMap = () => {
  const [district, setDistrict] = useState<District | null>(null);
  const [locality, setLocality] = useState("");

  const localityWords = useMemo(() => {
    if (!district || !locality) return [];
    return words.filter(
      (word) => word.category === categoryByDistrict[district.id] && word.city === locality,
    );
  }, [district, locality]);

  const selectDistrict = (nextDistrict: District) => {
    setDistrict(nextDistrict);
    setLocality("");
  };

  const returnToProvince = () => {
    setDistrict(null);
    setLocality("");
  };

  return (
    <section className="border-b border-border bg-background" aria-label="Mapa ng Quezon">
      <div className="mx-auto w-full px-2 py-2 md:px-8 md:py-4">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden bg-ocean/10">
            {district && (
              <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 bg-card/90 px-3 py-2">
                <span className="font-display text-base font-semibold">{district.name}{locality && ` · ${locality}`}</span>
                <Button variant="outline" size="sm" type="button" onClick={returnToProvince} className="shrink-0 text-primary">
                  <ArrowLeft className="h-4 w-4" /> Bumalik
                </Button>
              </div>
            )}
            <div className="h-[min(80svh,48rem)] w-full">
              <QuezonMap
                selected={district}
                selectedLocality={locality}
                completed={{}}
                onDistrict={selectDistrict}
                onLocality={setLocality}
              />
            </div>
          </div>

          {district && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2" aria-label={`Mga bayan at lungsod sa ${district.name}`}>
              {district.localities.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setLocality(item.name)}
                  aria-pressed={locality === item.name}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-smooth ${
                    locality === item.name
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5" /> {item.name}
                </button>
              ))}
            </div>
          )}

          {locality && district && (
            <div className="map-word-panel mt-5 border-t border-border pt-5" aria-live="polite">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Mga salita sa {locality}</span>
                  <h3 className="mt-1 font-display text-2xl font-semibold">{locality}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {localityWords.length} {localityWords.length === 1 ? "salitang nakolekta" : "salitang nakolekta"}
                  </p>
                </div>
                <Link to={`/categories?c=${categoryByDistrict[district.id]}&city=${encodeURIComponent(locality)}`} className="shrink-0 text-xs font-semibold text-primary hover:underline">
                  Tingnan lahat
                </Link>
              </div>
              {localityWords.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {localityWords.map((word) => <WordCard key={word.id} word={word} />)}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-8 text-center text-sm text-muted-foreground">
                  Wala pang salitang nakolekta para sa {locality}.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};