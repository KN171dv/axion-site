import { m, useMotionValue, useSpring } from "motion/react";
import { type ComponentProps, type PointerEvent, type ReactNode, useRef } from "react";
import { ArrowRight } from "./Icons";

type Variant = "primary" | "outline-dark" | "outline-light" | "solid-light";

type Props = Omit<ComponentProps<"a">, "children" | "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> & {
  children: ReactNode;
  variant?: Variant;
  size?: "md" | "lg";
  icon?: ReactNode | null;
  magnetic?: boolean;
};

const variants: Record<Variant, string> = {
  primary: "bg-action text-white hover:bg-accent-lo",
  "solid-light": "bg-bone text-ink hover:bg-white",
  "outline-dark": "text-bone ring-1 ring-inset ring-line-dark hover:ring-bone/50",
  "outline-light": "text-ink ring-1 ring-inset ring-line-light hover:ring-ink/50",
};

const sizes = {
  md: "h-11 pl-5 pr-4 text-[0.9375rem]",
  lg: "h-14 pl-7 pr-6 text-base",
};

/**
 * Link com aparência de botão. `magnetic` faz o botão seguir levemente o cursor
 * (só em ponteiro fino; no touch o evento nunca dispara com mouse).
 */
export function Button({ children, variant = "primary", size = "md", icon, magnetic = false, className, ...rest }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!magnetic || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const iconNode = icon === undefined ? <ArrowRight className="size-4.5" /> : icon;

  return (
    <m.a
      ref={ref}
      style={magnetic ? { x, y } : undefined}
      onPointerMove={onMove}
      onPointerLeave={reset}
      whileTap={{ scale: 0.97 }}
      className={`group relative inline-flex select-none items-center justify-center gap-3 rounded-full font-medium tracking-[-0.01em] transition-[background-color,box-shadow,color] duration-300 ${variants[variant]} ${sizes[size]} ${className ?? ""}`}
      {...rest}
    >
      <span>{children}</span>
      {iconNode && (
        <span className="relative inline-flex size-4.5 overflow-hidden" aria-hidden="true">
          <span className="absolute inset-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-[140%]">
            {iconNode}
          </span>
          <span className="absolute inset-0 -translate-x-[140%] transition-transform duration-500 ease-out-expo group-hover:translate-x-0">
            {iconNode}
          </span>
        </span>
      )}
    </m.a>
  );
}
