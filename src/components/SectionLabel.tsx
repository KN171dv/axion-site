type Props = { index: string; children: string; tone?: "dark" | "light"; className?: string };

/** Rótulo técnico das seções: [01] — Serviços */
export function SectionLabel({ index, children, tone = "dark", className }: Props) {
  const muted = tone === "dark" ? "text-muted-dark" : "text-muted-light";
  return (
    <p className={`label flex items-center gap-3 ${muted} ${className ?? ""}`} data-reveal>
      <span className={`tabular ${tone === "dark" ? "text-accent" : "text-accent-lo"}`}>[{index}]</span>
      <span aria-hidden="true" className={`h-px w-8 ${tone === "dark" ? "bg-line-dark" : "bg-line-light"}`} />
      <span>{children}</span>
    </p>
  );
}
