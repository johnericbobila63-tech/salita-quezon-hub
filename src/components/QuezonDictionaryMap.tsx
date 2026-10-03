import { useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { QuezonMap } from "@/game/QuezonMap";
import { District, districts } from "@/game/data";
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
    <section className="border-b border-border bg-background" aria-labelledby="quezon-map-title">
      <div className="container py-8 md:py-16">
        <div className="mx-auto max-w-5xl">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Mapa ng Wika</span>
          <h2 id="quezon-map-title" className="mt-2 font-display text-2xl font-semibold md:text-4xl">
            Galugarin ang mga Salita sa Quezon
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Pumili ng distrito at bayan upang tuklasin ang mga salitang ginagamit sa bawat lugar.
          </p>

          <nav className="mt-5 flex items-center gap-1 overflow-x-auto text-xs font-semibold text-muted-foreground" aria-label="Lokasyon">
            <button type="button" onClick={returnToProvince} className="shrink-0 rounded-lg px-2 py-1 hover:bg-muted hover:text-foreground">
              Quezon
            </button>
            {district && (
              <>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                <button type="button" onClick={() => setLocality("")} className="shrink-0 rounded-lg px-2 py-1 hover:bg-muted hover:text-foreground">
                  {district.name}
                </button>
              </>
            )}
            {locality && (
              <>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                <span className="shrink-0 px-2 py-1 text-foreground">{locality}</span>
              </>
            )}
          </nav>

          <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-ocean/10 shadow-soft">
            <div className="flex min-h-14 items-center justify-between gap-3 border-b border-border bg-card/90 px-4 py-3">
              <div>
                <div className="font-display text-lg font-semibold">{district?.name ?? "Quezon Province"}</div>
                <p className="text-xs text-muted-foreground">
                  {district ? "Piliin ang bayan o lungsod upang makita ang mga salita." : "Piliin ang distrito upang magsimula."}
                </p>
              </div>
              {district && (
                <button type="button" onClick={returnToProvince} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-primary transition-smooth hover:bg-muted">
                  <ArrowLeft className="h-4 w-4" /> Bumalik
                </button>
              )}
            </div>
            <div className="h-[29rem] max-h-[68vh] min-h-[24rem] w-full p-2 md:h-[38rem] md:p-5">
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