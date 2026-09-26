import { useEffect } from "react";
import { gsap, hasFinePointer, prefersReducedMotion, registerGsap, ScrollTrigger } from "../lib/motion";

/**
 * Lenis apenas em desktop com mouse e sem reduced-motion.
 * No touch o scroll nativo é melhor (momentum do sistema), então não interferimos.
 * Carregado sob demanda para não pesar o bundle inicial.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion() || !hasFinePointer()) return;
    let destroyed = false;
    let cleanup = () => {};

    import("lenis").then(({ default: Lenis }) => {
      if (destroyed) return;
      registerGsap();
      const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.9, anchors: { offset: -72 } });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });

    return () => {
      destroyed = true;
      cleanup();
    };
  }, []);
}
