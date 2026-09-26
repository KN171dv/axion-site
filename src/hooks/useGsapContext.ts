import { type RefObject } from "react";
import { gsap, prefersReducedMotion, registerGsap } from "../lib/motion";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * Executa animações GSAP com escopo no elemento e limpeza automática.
 * Com prefers-reduced-motion o callback não roda — o conteúdo fica no estado final.
 */
export function useGsapContext<T extends HTMLElement>(
  scope: RefObject<T | null>,
  setup: (self: { root: T; mm: gsap.MatchMedia }) => void,
  deps: unknown[] = [],
) {
  useIsomorphicLayoutEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;
    registerGsap();
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => setup({ root, mm }), root);
    return () => {
      mm.revert();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
