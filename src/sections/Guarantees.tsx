import { RevealLines } from "../components/RevealLines";
import { SectionLabel } from "../components/SectionLabel";
import { guarantees, sectionIndex } from "../content/site";

/** Prova social honesta: em vez de números inventados, compromissos que a Axion cumpre em todo projeto. */
export function Guarantees() {
  return (
    <section id="garantias" data-tone="dark" aria-labelledby="garantias-title" className="section-y relative">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <SectionLabel index={sectionIndex("garantias")}>Garantias</SectionLabel>
          <RevealLines id="garantias-title" lines={["O que você", "pode cobrar", "da gente."]} className="h2 mt-8 md:mt-10" />
        </div>

        <ol className="border-t border-line-dark lg:col-span-7 lg:col-start-6">
          {guarantees.map((g, i) => (
            <li
              key={g.k}
              className="grid gap-3 border-b border-line-dark py-7 sm:grid-cols-[4rem_1fr] sm:gap-6 md:py-9 lg:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)]"
              data-reveal
              data-reveal-delay={String(i * 0.05)}
            >
              <span className="label tabular pt-1.5 text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-[clamp(1.25rem,1.05rem+0.8vw,1.75rem)] font-[520] leading-[1.1] tracking-[-0.025em] text-balance">{g.k}</h3>
              <p className="leading-relaxed text-muted-dark sm:col-start-2 lg:col-start-3">{g.v}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
