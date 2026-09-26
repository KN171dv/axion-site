import { RevealLines } from "../components/RevealLines";
import { SectionLabel } from "../components/SectionLabel";
import { projects, sectionIndex, testimonials } from "../content/site";

/**
 * Alimentada por `testimonials` em content/site.ts. Não renderiza nada enquanto a lista
 * estiver vazia — o site nunca mostra depoimento de exemplo.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section id="depoimentos" data-tone="dark" aria-labelledby="depoimentos-title" className="section-y relative border-t border-line-dark">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <SectionLabel index={sectionIndex("depoimentos")}>Depoimentos</SectionLabel>
          <RevealLines id="depoimentos-title" lines={["Quem já", "está no ar."]} className="h2 mt-8 md:mt-10" />
        </div>

        <ul className="border-t border-line-dark lg:col-span-7 lg:col-start-6">
          {testimonials.map((t) => {
            const project = t.projectId ? projects.find((p) => p.id === t.projectId) : undefined;
            return (
              <li key={`${t.name}-${t.company}`} className="border-b border-line-dark py-9 md:py-12" data-reveal>
                <figure>
                  <blockquote className="text-[clamp(1.25rem,1.05rem+0.8vw,1.75rem)] leading-[1.3] tracking-[-0.02em] text-pretty">
                    <p>“{t.text}”</p>
                  </blockquote>
                  <figcaption className="mt-7 flex items-center gap-4">
                    {t.photo && (
                      <img src={t.photo} width={48} height={48} loading="lazy" decoding="async" alt="" className="size-12 rounded-full object-cover" />
                    )}
                    <span>
                      <span className="block font-medium">{t.name}</span>
                      <span className="block text-[0.9375rem] text-muted-dark">
                        {t.role}, {t.company}
                        {project && (
                          <>
                            {" · "}
                            <a href={`#projeto-${project.id}`} className="link-underline">
                              ver o projeto
                            </a>
                          </>
                        )}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
