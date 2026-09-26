import { useEffect, useRef } from "react";
import { Button } from "../components/Button";
import { RevealLines } from "../components/RevealLines";
import { hero } from "../content/site";
import { useGsapContext } from "../hooks/useGsapContext";
import { ease, gsap, hasFinePointer, prefersReducedMotion } from "../lib/motion";
import { HeroBlueprint } from "./HeroBlueprint";

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Timeline de entrada + parallax de saída
  useGsapContext(ref, ({ root, mm }) => {
    const tl = gsap.timeline({ defaults: { ease: ease.out }, delay: 0.1 });

    tl.fromTo(".hero-eyebrow", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8 })
      .fromTo(".hero-title .line-inner", { yPercent: 105, y: 0 }, { yPercent: 0, y: 0, duration: 1.2, stagger: 0.09 }, 0.1)
      .fromTo(".hero-copy", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.55)
      .fromTo(".hero-fact", { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.06 }, 0.8);

    // Montagem da planta
    const bp = gsap.timeline({ defaults: { ease: ease.out } });
    bp.fromTo(".bp-draw", { strokeDashoffset: 1, fillOpacity: 0 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" })
      .to(".bp-draw", { fillOpacity: 0.7, duration: 0.6 }, "-=0.3")
      .fromTo(".bp-bar", { opacity: 0 }, { opacity: 1, duration: 0.4 }, "-=0.5")
      .fromTo(
        ".bp-block",
        { opacity: 0, scaleX: 0.2, transformOrigin: "0% 50%" },
        { opacity: 1, scaleX: 1, duration: 0.8, stagger: 0.07 },
        "-=0.2",
      )
      .fromTo(".bp-cta", { opacity: 0, scale: 0.6, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.6 }, "-=0.5")
      .fromTo(".bp-card", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, "-=0.4")
      .fromTo(".bp-anno", { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.1 }, "-=0.3")
      .fromTo(".bp-cursor", { opacity: 0, x: 540, y: 400 }, { opacity: 1, x: 520, y: 380, duration: 0.3 }, "-=0.2")
      .to(".bp-cursor", { x: 128, y: 276, duration: 1.1, ease: "power3.inOut" })
      .to(".bp-cursor", { scale: 0.85, duration: 0.08, yoyo: true, repeat: 1, transformOrigin: "0 0" })
      .fromTo(".bp-ripple", { opacity: 0.9, attr: { r: 16 } }, { opacity: 0, attr: { r: 44 }, duration: 0.7 }, "<")
      .fromTo(".bp-status", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.35");
    tl.add(bp, 0.35);

    // Saída: o título sobe mais devagar que a planta — profundidade sem exagero.
    mm.add("(min-width: 1024px)", () => {
      gsap.to(".hero-title", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-visual", {
        y: -80,
        rotateX: 8,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
    });
  });

  // Grid que acende perto do cursor (CSS vars, 1 escrita por frame)
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !hasFinePointer()) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
        el.style.setProperty("--spot", "1");
      });
    };
    const onLeave = () => el.style.setProperty("--spot", "0");
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section
      id="inicio"
      ref={ref}
      data-tone="dark"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-28 pb-16 md:pt-36 lg:pb-20"
    >
      {/* Planta de fundo + holofote do cursor */}
      <div aria-hidden="true" className="blueprint pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]" />
      <div
        aria-hidden="true"
        className="blueprint pointer-events-none absolute inset-0 -z-10 opacity-[var(--spot,0)] transition-opacity duration-700 [--grid-color:rgb(109_157_255/0.35)]"
        style={{
          maskImage: "radial-gradient(260px circle at var(--mx,50%) var(--my,50%), black, transparent)",
          WebkitMaskImage: "radial-gradient(260px circle at var(--mx,50%) var(--my,50%), black, transparent)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[20%] top-[10%] -z-10 aspect-square w-[70vw] max-w-[900px] rounded-full bg-[radial-gradient(closest-side,rgb(59_123_255/0.16),transparent)]"
      />

      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-7">
            <p className="hero-eyebrow label flex items-center gap-3 text-muted-dark" data-reveal data-reveal-manual>
              <span className="inline-block size-1.5 rounded-full bg-accent" aria-hidden="true" />
              {hero.eyebrow}
            </p>

            <RevealLines
              as="h1"
              id="hero-title"
              manual
              lines={hero.titleLines.map((l, i) =>
                i === hero.titleLines.length - 1 ? (
                  <>
                    {l.replace(/\.$/, "")}
                    <span className="text-accent">.</span>
                  </>
                ) : (
                  l
                ),
              )}
              className="hero-title display mt-7 text-[clamp(2.75rem,11.5vw,5.5rem)] lg:text-[min(6.2vw,5.6rem)] lg:[&_.line-inner]:whitespace-nowrap md:mt-9"
            />

            <p className="hero-copy lead mt-8 max-w-[34rem] text-muted-dark md:mt-10" data-reveal data-reveal-manual>
              {hero.lead}
            </p>
            <div className="hero-copy mt-9 flex flex-wrap items-center gap-x-7 gap-y-4" data-reveal data-reveal-manual>
              <Button href={hero.primaryCta.href} size="lg" magnetic>
                {hero.primaryCta.label}
              </Button>
              <a href={hero.secondaryCta.href} className="link-underline py-2 text-[0.9375rem] font-medium">
                {hero.secondaryCta.label}
              </a>
            </div>
          </div>

          <div className="hero-visual [perspective:1200px] lg:col-span-5 lg:mt-10">
            <div className="mx-auto max-w-[36rem] lg:mr-0">
              <HeroBlueprint />
            </div>
          </div>
        </div>

        <dl className="mt-16 grid border-t border-line-dark sm:grid-cols-3 md:mt-20 lg:mt-24">
          {hero.facts.map((f) => (
            <div
              key={f.k}
              className="hero-fact flex items-baseline justify-between gap-4 border-b border-line-dark py-4 sm:block sm:border-b-0 sm:border-r sm:py-5 sm:pr-6 sm:last:border-r-0 sm:[&:not(:first-child)]:pl-6"
              data-reveal
              data-reveal-manual
            >
              <dt className="label text-muted-dark">{f.k}</dt>
              <dd className="text-[0.9375rem] sm:mt-2.5">{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
