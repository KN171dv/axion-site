import { useRef } from "react";
import { RevealLines } from "../components/RevealLines";
import { SectionLabel } from "../components/SectionLabel";
import { process } from "../content/site";
import { useGsapContext } from "../hooks/useGsapContext";
import { gsap } from "../lib/motion";

export function Process() {
  const ref = useRef<HTMLElement>(null);

  // A linha de progresso acompanha a leitura; cada etapa "acende" ao cruzar o centro.
  useGsapContext(ref, ({ root }) => {
    gsap.fromTo(
      ".pr-line",
      { scaleY: 0 },
      { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".pr-list", start: "top 60%", end: "bottom 60%", scrub: 0.4 } },
    );
    gsap.utils.toArray<HTMLElement>(".pr-step", root).forEach((step) => {
      gsap.fromTo(
        step.querySelector(".pr-dot"),
        { backgroundColor: "rgb(11 12 14 / 0.12)", scale: 0.6 },
        {
          backgroundColor: "#3b7bff",
          scale: 1,
          duration: 0.4,
          scrollTrigger: { trigger: step, start: "top 60%", toggleActions: "play none none reverse" },
        },
      );
    });
  });

  return (
    <section id="processo" ref={ref} data-tone="light" aria-labelledby="processo-title" className="section-y bg-paper text-ink">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionLabel index="04" tone="light">
              Processo
            </SectionLabel>
            <RevealLines id="processo-title" lines={["Do briefing", "ao ar, sem", "mistério."]} className="h2 mt-8 md:mt-10" />
            <p className="lead mt-8 max-w-[28rem] text-muted-light" data-reveal>
              Quatro etapas, sempre nesta ordem. Você sabe o que está acontecendo e o que vem depois em todos os momentos.
            </p>
          </div>
        </div>

        <ol className="pr-list relative lg:col-span-6 lg:col-start-7">
          <span aria-hidden="true" className="absolute bottom-0 left-[5px] top-2 w-px bg-line-light" />
          <span aria-hidden="true" className="pr-line absolute bottom-0 left-[5px] top-2 w-px origin-top bg-accent" />
          {process.map((p) => (
            <li key={p.n} className="pr-step relative pb-16 pl-12 last:pb-0 md:pb-24 md:pl-16" data-reveal>
              <span aria-hidden="true" className="pr-dot absolute left-0 top-2 size-[11px] rounded-full bg-accent" />
              <span className="label tabular text-muted-light">Etapa {p.n}</span>
              <h3 className="mt-4 text-[clamp(1.75rem,1.2rem+1.8vw,2.75rem)] font-[520] leading-none tracking-[-0.035em]">{p.title}</h3>
              <p className="mt-4 max-w-[30rem] text-[1.0625rem] leading-relaxed text-muted-light">{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
