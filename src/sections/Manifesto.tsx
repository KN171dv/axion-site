import { useRef } from "react";
import { SectionLabel } from "../components/SectionLabel";
import { manifesto } from "../content/site";
import { useGsapContext } from "../hooks/useGsapContext";
import { gsap } from "../lib/motion";

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const words = manifesto.statement.split(" ");

  // A frase "acende" no ritmo da leitura. Scrub curto para não prender o scroll.
  useGsapContext(ref, () => {
    gsap.fromTo(
      ".mf-word",
      { opacity: 0.22 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.1,
        scrollTrigger: { trigger: ".mf-statement", start: "top 80%", end: "bottom 45%", scrub: 0.6 },
      },
    );
  });

  return (
    <section id="sobre" ref={ref} data-tone="dark" aria-labelledby="sobre-title" className="section-y relative">
      <div className="container-x">
        <SectionLabel index="01">{manifesto.label}</SectionLabel>
        <h2 id="sobre-title" className="sr-only">
          Sobre a Axion
        </h2>
        <p className="mf-statement mt-10 max-w-[24ch] text-[clamp(1.875rem,1rem+3.6vw,4.25rem)] font-[480] leading-[1.06] tracking-[-0.035em] text-balance md:mt-14">
          {words.map((w, i) => (
            <span key={i} className="mf-word">
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>

        <div className="mt-20 grid gap-12 md:mt-28 lg:grid-cols-12 lg:gap-8">
          <p className="lead text-muted-dark lg:col-span-5 lg:col-start-1" data-reveal>
            {manifesto.body}
          </p>
          <ol className="grid gap-px overflow-hidden rounded-sm bg-line-dark sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {manifesto.principles.map((p, i) => (
              <li key={p.k} className="bg-ink p-6 sm:p-5 xl:p-7" data-reveal data-reveal-delay={String(i * 0.08)}>
                <span className="label tabular text-accent">0{i + 1}</span>
                <h3 className="mt-8 text-lg font-medium tracking-[-0.02em] sm:mt-10">{p.k}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted-dark">{p.v}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
