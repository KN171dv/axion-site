import { type ElementType, type ReactNode } from "react";

type Props = {
  as?: ElementType;
  lines: ReactNode[];
  className?: string;
  manual?: boolean;
  id?: string;
};

/**
 * Título com quebras de linha controladas; cada linha sobe de dentro de uma máscara.
 * O texto completo continua um único heading para leitores de tela e buscadores.
 */
export function RevealLines({ as: Tag = "h2", lines, className, manual, id }: Props) {
  return (
    <Tag className={className} data-reveal="lines" data-reveal-manual={manual ? "" : undefined} id={id}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span className="line-inner">{line}</span>
          {i < lines.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
