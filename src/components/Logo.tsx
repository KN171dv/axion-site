import { useId } from "react";

type Props = { className?: string; withWordmark?: boolean };

/** Monograma "A" em fita dobrada, redesenhado em SVG a partir do ícone original da Axion. */
export function LogoMark({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}a`} x1="30" y1="6" x2="6" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#35C2FF" />
          <stop offset="1" stopColor="#2F6BFF" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="36" y1="10" x2="58" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2D63F0" />
          <stop offset="1" stopColor="#1B3FC4" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="14" y1="56" x2="50" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2A74FF" />
          <stop offset="1" stopColor="#4FA3FF" />
        </linearGradient>
      </defs>
      <path d="M26.5 6h10.2L14.6 50.6 4.5 57.5z" fill={`url(#${id}a)`} />
      <path d="M36.7 6 59.5 55.2c.5 1.1-.3 2.3-1.5 2.3h-7.6L31.6 17.3z" fill={`url(#${id}b)`} />
      <path d="M13 57.5 45.8 36l4.6 9.6-18.6 11.9z" fill={`url(#${id}c)`} />
    </svg>
  );
}

export function Logo({ className, withWordmark = true }: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className="size-7 shrink-0" />
      {withWordmark && <span className="text-[1.0625rem] font-semibold tracking-[0.14em]">AXION</span>}
    </span>
  );
}
