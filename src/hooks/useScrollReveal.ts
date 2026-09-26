import { useEffect } from "react";
import { ease, gsap, prefersReducedMotion, registerGsap, ScrollTrigger } from "../lib/motion";

/**
 * Sistema único de reveal por atributo:
 *  data-reveal            → sobe 24px + fade
 *  data-reveal="lines"    → cada .line-inner sobe de dentro da máscara
 *  data-reveal-delay="0.1"
 * Elementos do hero são animados pela timeline própria (data-reveal-manual).
 */
export function useScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (prefersReducedMotion()) {
      root.classList.remove("motion-ok");
      return;
    }
    registerGsap();
    root.classList.add("motion-ok", "motion-ready");

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]:not([data-reveal-manual])");
      items.forEach((el) => {
        const delay = Number(el.dataset.revealDelay ?? 0);
        const isLines = el.dataset.reveal === "lines";
        const targets = isLines ? el.querySelectorAll(".line-inner") : el;
        const from = isLines ? { yPercent: 105, y: 0 } : { y: 24, opacity: 0 };
        const to = isLines
          ? { yPercent: 0, y: 0, duration: 1.1, stagger: 0.08 }
          : { y: 0, opacity: 1, duration: 0.9 };
        gsap.fromTo(targets, from, {
          ...to,
          delay,
          ease: ease.out,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    });

    // Recalcula depois que as fontes carregam (alturas mudam).
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, []);
}
