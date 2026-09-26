import { useRef } from "react";
import { RevealLines } from "../components/RevealLines";
import { SectionLabel } from "../components/SectionLabel";
import { studies } from "../content/site";
import { useGsapContext } from "../hooks/useGsapContext";
import { gsap } from "../lib/motion";
import { StudyMockup } from "./StudyMockup";

/**
 * Desktop: seção fixada com trilho horizontal guiado pelo scroll — cada estudo ganha
 * a tela inteira, como virar páginas de um caderno de projeto.
 * Mobile/tablet: pilha vertical simples (scroll horizontal em touch atrapalha).
 */
export function Studies() {
  const ref = useRef<HTMLElement>(null);

  useGsapContext(ref, ({ root, mm }) => {
    mm.add("(min-width: 1024px) and (min-height: 640px)", () => {
      const track = root.querySelector<HTMLElement>(".st-track");
      const viewport = root.querySelector<HTMLElement>(".st-viewport");
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
          onUpdate: (self) => {
            gsap.set(".st-progress", { scaleX: self.progress });
            const idx = Math.round(self.progress * (studies.length - 1)) + 1;
            const counter = root.querySelector(".st-counter");
            if (counter) counter.textContent = String(idx).padStart(2, "0");
          },
        },
      });

      // Mockup de cada painel ganha leve deslocamento relativo ao trilho (parallax interno)
      gsap.utils.toArray<HTMLElement>(".st-mock").forEach((el) => {
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
    <section id="estudos" ref={ref} data-tone="dark" aria-labelledby="estudos-title" className="relative">
      <div className="container-x section-y pb-12 lg:pb-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <SectionLabel index="03">Estudos</SectionLabel>
            <RevealLines id="estudos-title" lines={["Como pensamos", "um site."]} className="h2 mt-8 md:mt-10" />
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:self-end" data-reveal>
            <p className="lead text-muted-dark">
              Três negócios, três objetivos diferentes. Cada estudo começa pela pergunta que importa: o que o visitante precisa fazer aqui?
            </p>
            <p className="label mt-5 leading-relaxed text-muted-dark/80">
              Estudos conceituais criados pela Axion. Não representam clientes.
            </p>
          </div>
        </div>
      </div>

      <div className="st-viewport relative lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:overflow-hidden">
        <div className="container-x mb-6 hidden items-center justify-between lg:flex" aria-hidden="true">
          <span className="label tabular text-muted-dark">
            <span className="st-counter text-bone">01</span> / {String(studies.length).padStart(2, "0")}
          </span>
          <span className="relative h-px w-48 bg-line-dark">
            <span className="st-progress absolute inset-0 origin-left scale-x-0 bg-accent" />
          </span>
        </div>

        <ol className="st-track flex flex-col gap-20 pb-[clamp(5.5rem,12vw,11rem)] lg:flex-row lg:gap-0 lg:pb-0 lg:will-change-transform">
          {studies.map((s, i) => (
            <li key={s.id} className="container-x shrink-0 lg:max-w-none lg:basis-full">
              <article className="mx-auto grid max-w-[90rem] items-center gap-8 lg:grid-cols-12 lg:gap-8 xl:px-0" aria-labelledby={`st-${s.id}`}>
                <div className="st-mock lg:col-span-8" data-reveal>
                  <StudyMockup id={s.id} />
                </div>
                <div className="lg:col-span-4 lg:pl-4" data-reveal>
                  <p className="label flex items-center gap-3 text-muted-dark">
                    <span className="tabular text-accent">0{i + 1}</span>
                    {s.segment}
                  </p>
                  <h3 id={`st-${s.id}`} className="mt-5 text-[clamp(1.75rem,1.2rem+1.8vw,2.75rem)] font-[520] leading-none tracking-[-0.035em]">
                    {s.name}
                  </h3>
                  <dl className="mt-8 space-y-6 border-t border-line-dark pt-6">
                    <div>
                      <dt className="label text-muted-dark">Objetivo</dt>
                      <dd className="mt-2 text-lg leading-snug tracking-[-0.01em]">{s.goal}</dd>
                    </div>
                    <div>
                      <dt className="label text-muted-dark">Decisão de design</dt>
                      <dd className="mt-2 leading-relaxed text-muted-dark">{s.decision}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
