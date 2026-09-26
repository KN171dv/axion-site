import { m, useMotionValue, useSpring, useTransform } from "motion/react";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import type { Project } from "../content/site";
import { hasFinePointer, prefersReducedMotion } from "../lib/motion";

const MAX_TILT = 6; // graus
const spring = { stiffness: 160, damping: 18, mass: 0.6 };

/**
 * Screenshot real do desktop numa moldura de navegador + versão mobile numa moldura de
 * celular sobreposta no canto. Com mouse, o conjunto inclina de leve seguindo o cursor
 * e o celular fica num plano à frente — profundidade de verdade, não sombra.
 * Sem mouse ou com reduced-motion: plano e estático.
 */
export function PortfolioMockup({ project }: { project: Project }) {
  const [tilt, setTilt] = useState(false);
  const [active, setActive] = useState(false);
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), spring);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), spring);

  useEffect(() => {
    setTilt(hasFinePointer() && !prefersReducedMotion());
    return () => clearTimeout(settle.current);
  }, []);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onEnter = () => {
    clearTimeout(settle.current);
    setActive(true);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
    // will-change só enquanto a mola ainda está voltando ao centro
    settle.current = setTimeout(() => setActive(false), 900);
  };

  const host = new URL(project.url).hostname.replace(/^www\./, "");

  return (
    <div
      className="relative pr-5 pb-10 [perspective:1400px] sm:pr-10 sm:pb-14"
      {...(tilt ? { onPointerMove: onMove, onPointerEnter: onEnter, onPointerLeave: onLeave, "data-tilt": "" } : {})}
    >
      <m.div
        className={`pf-tilt relative ${tilt ? "[transform-style:preserve-3d]" : ""}`}
        style={tilt ? { rotateX, rotateY, willChange: active ? "transform" : "auto" } : undefined}
      >
        <div className="overflow-hidden rounded-[10px] bg-ink-3 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)] ring-1 ring-line-dark">
          <div className="flex h-7 items-center gap-1.5 border-b border-line-dark px-3" aria-hidden="true">
            <span className="size-2 rounded-full bg-bone/20" />
            <span className="size-2 rounded-full bg-bone/20" />
            <span className="size-2 rounded-full bg-bone/20" />
            <span className="label ml-3 hidden truncate text-[0.625rem] normal-case tracking-normal text-muted-dark sm:block">{host}</span>
          </div>
          <img
            src={project.images.desktop}
            width={1600}
            height={1000}
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1024px) 60vw, 100vw"
            alt={project.images.alt}
            className="block aspect-[16/10] h-auto w-full bg-ink-2"
          />
        </div>

        <div
          className={`pf-phone absolute -right-5 -bottom-10 w-[23%] min-w-[5.5rem] max-w-[12.5rem] rounded-[1.1rem] bg-ink p-[5px] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.85)] ring-1 ring-bone/15 sm:-right-10 sm:-bottom-14 sm:rounded-[1.5rem] sm:p-1.5 ${
            tilt ? "[transform:translateZ(56px)]" : ""
          }`}
        >
          <img
            src={project.images.mobile}
            width={600}
            height={1298}
            loading="lazy"
            decoding="async"
            sizes="200px"
            alt={`A mesma página do site da ${project.name} no celular.`}
            className="block aspect-[390/844] h-auto w-full rounded-[0.8rem] bg-ink-2 sm:rounded-[1.15rem]"
          />
        </div>
      </m.div>
    </div>
  );
}
