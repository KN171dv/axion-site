import { m } from "motion/react";
import { useId, useState } from "react";
import { Plus } from "../components/Icons";
import { RevealLines } from "../components/RevealLines";
import { SectionLabel } from "../components/SectionLabel";
import { faq, sectionIndex } from "../content/site";
import { easeCss } from "../lib/motion";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id="duvidas" data-tone="light" aria-labelledby="duvidas-title" className="section-y border-t border-line-light bg-paper text-ink">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <SectionLabel index={sectionIndex("duvidas")} tone="light">
            Dúvidas
          </SectionLabel>
          <RevealLines id="duvidas-title" lines={["Antes de", "conversar."]} className="h2 mt-8 md:mt-10" />
        </div>

        <div className="border-t border-line-light lg:col-span-7 lg:col-start-6">
          {faq.map((item, i) => {
            const isOpen = open === i;
            const btnId = `${baseId}-q${i}`;
            const panelId = `${baseId}-a${i}`;
            return (
              <div key={item.q} className="border-b border-line-light" data-reveal>
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] font-medium tracking-[-0.02em] md:py-7"
                  >
                    {item.q}
                    <span
                      aria-hidden="true"
                      className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-line-light transition-[transform,background-color,color] duration-500 ease-out-expo group-hover:bg-ink group-hover:text-paper ${
                        isOpen ? "rotate-45 bg-ink text-paper" : ""
                      }`}
                    >
                      <Plus className="size-4" />
                    </span>
                  </button>
                </h3>
                <m.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: easeCss }}
                  className="overflow-hidden"
                  inert={!isOpen}
                >
                  <p className="max-w-[40rem] pb-7 pr-12 leading-relaxed text-muted-light">{item.a}</p>
                </m.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
