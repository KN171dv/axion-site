import { useRef } from "react";
import { ArrowUpRight } from "../components/Icons";
import { RevealLines } from "../components/RevealLines";
import { SectionLabel } from "../components/SectionLabel";
import { projects, sectionIndex } from "../content/site";
import { useGsapContext } from "../hooks/useGsapContext";
import { gsap } from "../lib/motion";
import { PortfolioMockup } from "./PortfolioMockup";

/**
 * Desktop: seção fixada com trilho horizontal guiado pelo scroll — cada projeto ganha
 * a tela inteira, como virar páginas de um caderno de projeto.
 * Mobile/tablet: pilha vertical simples (scroll horizontal em touch atrapalha).
 */
export function Portfolio() {
  const ref = useRef<HTMLElement>(null);

  useGsapContext(ref, ({ root, mm }) => {
    mm.add("(min-width: 1024px) and (min-height: 640px)", () => {
      const track = root.querySelector<HTMLElement>(".pf-track");
      const viewport = root.querySelector<HTMLElement>(".pf-viewport");
      if (!track || !viewport) return;
      const distance = () => track.scrollWidth - viewport.clientWidth;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: viewport,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            track.style.willChange = self.isActive ? "transform" : "";
          },
          onUpdate: (self) => {
            gsap.set(".pf-progress", { scaleX: self.progress });
            const idx = Math.round(self.progress * (projects.length - 1)) + 1;
            const counter = root.querySelector(".pf-counter");
            if (counter) counter.textContent = String(idx).padStart(2, "0");
          },
        },
      });

      // Mockup de cada painel ganha leve deslocamento relativo ao trilho (parallax interno)
      gsap.utils.toArray<HTMLElement>(".pf-mock").forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: 6 },
          {
            xPercent: -6,
            ease: "none",
            scrollTrigger: { trigger: el, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          },
        );
      });
    });
  });

  return (
    <section id="portfolio" ref={ref} data-tone="dark" aria-labelledby="portfolio-title" className="relative">
      <div className="container-x section-y pb-12 lg:pb-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <SectionLabel index={sectionIndex("portfolio")}>Portfólio</SectionLabel>
            <RevealLines id="portfolio-title" lines={["Sites no ar,", "trabalhando."]} className="h2 mt-8 md:mt-10" />
          </div>
          <p className="lead text-muted-dark lg:col-span-4 lg:col-start-9 lg:self-end" data-reveal>
            Projetos entregues pela Axion e publicados. Abra qualquer um deles e veja funcionando, no computador ou no celular.
          </p>
        </div>
      </div>

      <div className="pf-viewport relative lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:overflow-hidden">
        <div className="container-x mb-6 hidden items-center justify-between lg:flex" aria-hidden="true">
          <span className="label tabular text-muted-dark">
            <span className="pf-counter text-bone">01</span> / {String(projects.length).padStart(2, "0")}
          </span>
          <span className="relative h-px w-48 bg-line-dark">
            <span className="pf-progress absolute inset-0 origin-left scale-x-0 bg-accent" />
          </span>
        </div>

        <ol className="pf-track flex flex-col gap-20 pb-[clamp(5.5rem,12vw,11rem)] lg:flex-row lg:gap-0 lg:pb-0">
          {projects.map((p, i) => (
            <li key={p.id} id={`projeto-${p.id}`} className="container-x shrink-0 lg:max-w-none lg:basis-full">
              <article className="mx-auto grid max-w-[90rem] items-center gap-10 lg:grid-cols-12 lg:gap-8 xl:px-0" aria-labelledby={`pf-${p.id}`}>
                <div className="pf-mock lg:col-span-7 xl:col-span-8" data-reveal>
                  <PortfolioMockup project={p} />
                </div>
                <div className="lg:col-span-5 lg:pl-4 xl:col-span-4" data-reveal>
                  <p className="label flex items-center gap-3 text-muted-dark">
                    <span className="tabular text-accent">0{i + 1}</span>
                    {p.segment}
                  </p>
                  <h3 id={`pf-${p.id}`} className="mt-5 text-[clamp(1.75rem,1.2rem+1.8vw,2.75rem)] font-[520] leading-none tracking-[-0.035em]">
                    {p.name}
                  </h3>
                  {p.location && <p className="label mt-4 normal-case tracking-[0.02em] text-muted-dark">{p.location}</p>}
                  <p className="mt-6 leading-relaxed text-muted-dark">{p.summary}</p>

                  <div className="mt-7 border-t border-line-dark pt-5">
                    <p className="label text-muted-dark">O que o site faz</p>
                    <ul className="mt-3 space-y-2">
                      {p.whatDid.map((item) => (
                        <li key={item} className="flex gap-3 text-[0.9375rem] leading-snug">
                          <span aria-hidden="true" className="mt-[0.6em] h-px w-2.5 shrink-0 bg-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {p.result && (
                    <div className="mt-6 border-t border-line-dark pt-5">
                      <p className="label text-muted-dark">Resultado</p>
                      <p className="mt-2 text-lg leading-snug tracking-[-0.01em]">{p.result}</p>
                    </div>
                  )}

                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-8 inline-flex items-center gap-2 py-1 text-[0.9375rem] font-medium"
                  >
                    <span className="link-underline">Ver site ao vivo</span>
                    <span className="sr-only"> da {p.name} (abre em nova aba)</span>
                    <ArrowUpRight className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
