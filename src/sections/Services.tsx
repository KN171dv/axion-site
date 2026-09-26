import { useRef } from "react";
import { ArrowUpRight } from "../components/Icons";
import { RevealLines } from "../components/RevealLines";
import { SectionLabel } from "../components/SectionLabel";
import { sectionIndex, services, standards, whatsappLink } from "../content/site";
import { useGsapContext } from "../hooks/useGsapContext";
import { gsap } from "../lib/motion";

export function Services() {
  const ref = useRef<HTMLElement>(null);

  // Transição de capítulo: a folha clara "abre" até ocupar a largura toda.
  useGsapContext(ref, ({ mm }) => {
    mm.add("(min-width: 768px)", () => {
      gsap.fromTo(
        ".sv-sheet",
        { clipPath: "inset(0% 3% 0% 3% round 28px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: { trigger: ".sv-sheet", start: "top bottom", end: "top 15%", scrub: true },
        },
      );
    });
  });

  return (
    <section id="servicos" ref={ref} data-tone="light" aria-labelledby="servicos-title" className="relative">
      <div className="sv-sheet section-y bg-paper text-ink">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <SectionLabel index={sectionIndex("servicos")} tone="light">
                Serviços
              </SectionLabel>
              <RevealLines
                id="servicos-title"
                lines={["Quatro formatos.", "Um padrão."]}
                className="h2 mt-8 md:mt-10"
              />
            </div>
            <p className="lead text-muted-light lg:col-span-4 lg:col-start-9 lg:self-end" data-reveal>
              Escolha pelo momento do seu negócio. Se ainda não souber qual faz sentido, a gente ajuda a decidir na primeira conversa.
            </p>
          </div>

          <ol className="mt-16 border-t border-line-light md:mt-24">
            {services.map((s, i) => (
              <li key={s.id} className="group relative border-b border-line-light" data-reveal>
                <article className="grid gap-6 py-9 md:grid-cols-12 md:gap-8 md:py-12">
                  <div className="flex items-start justify-between md:col-span-1 md:block">
                    <span className="label tabular pt-2 text-muted-light">0{i + 1}</span>
                  </div>

                  <header className="md:col-span-5 lg:col-span-4">
                    <p className="label text-muted-light">{s.audience}</p>
                    <h3 className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] font-[520] leading-none tracking-[-0.035em] transition-transform duration-500 ease-out-expo md:group-hover:translate-x-2">
                      {s.name}
                      {s.highlight && (
                        <span className="label rounded-full bg-ink px-2.5 py-1.5 text-[0.6875rem] text-paper">{s.highlight}</span>
                      )}
                    </h3>
                  </header>

                  <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-6">
                    <p className="text-[1.0625rem] leading-relaxed text-pretty">{s.summary}</p>
                    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2" aria-label={`Incluso no ${s.name}`}>
                      {s.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-[0.875rem] text-muted-light">
                          <span aria-hidden="true" className="h-px w-2.5 bg-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:col-span-11 md:col-start-2 lg:col-span-2 lg:col-start-11 lg:flex lg:justify-end">
                    <a
                      href={whatsappLink(s.whatsappMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[0.9375rem] font-medium after:absolute after:inset-0 after:content-['']"
                    >
                      <span className="link-underline">Conversar</span>
                      <span className="sr-only"> sobre {s.name} no WhatsApp</span>
                      <span className="inline-flex size-9 items-center justify-center rounded-full ring-1 ring-inset ring-line-light transition-[background-color,color,transform] duration-500 ease-out-expo group-hover:rotate-45 group-hover:bg-ink group-hover:text-paper">
                        <ArrowUpRight className="size-4" />
                      </span>
                    </a>
                  </div>
                </article>
              </li>
            ))}
          </ol>

          <div className="mt-24 grid gap-10 md:mt-32 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <p className="label text-muted-light" data-reveal>
                Em todo projeto
              </p>
              <h3 className="mt-5 text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] font-[520] leading-[1.05] tracking-[-0.03em] text-balance" data-reveal>
                O que não muda, seja qual for o formato.
              </h3>
            </div>
            <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-line-light xs:grid-cols-2 md:grid-cols-3 lg:col-span-8">
              {standards.map((st, i) => (
                <li key={st.k} className="bg-paper p-5 md:p-6" data-reveal data-reveal-delay={String((i % 3) * 0.06)}>
                  <span className="label tabular text-muted-light">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-6 font-medium tracking-[-0.015em] md:mt-8">{st.k}</p>
                  <p className="mt-1.5 text-[0.875rem] leading-relaxed text-muted-light">{st.v}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
