import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const isBrowser = typeof window !== "undefined";

let registered = false;
export function registerGsap() {
  if (!isBrowser || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function prefersReducedMotion() {
  if (!isBrowser) return false;
  // motion-off: o JS demorou demais e o conteúdo já foi exibido sem animação (ver index.html)
  return document.documentElement.classList.contains("motion-off") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Mouse/trackpad de verdade (não touch). Efeitos de cursor e Lenis só rodam aqui. */
export function hasFinePointer() {
  return isBrowser && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Curvas da marca: montagem precisa, sem bounce. */
export const ease = {
  out: "expo.out",
  inOut: "power4.inOut",
} as const;

export const easeCss = [0.16, 1, 0.3, 1] as const;

export { gsap, ScrollTrigger };
