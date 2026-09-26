import type { ReactNode } from "react";

/**
 * "Planta" de um site sendo montado, em três camadas empilhadas com o mesmo viewBox:
 *   01 wireframe — moldura, cotas e áreas reservadas
 *   02 design    — blocos de conteúdo, cards e o CTA
 *   03 código    — o comportamento: cursor, clique, CTA → WhatsApp, pronto para publicar
 * Planas, formam uma única ilustração. No desktop, ao rolar para fora do hero, Hero.tsx
 * as separa em profundidade (vista explodida). Classes .bp-* são os alvos das timelines.
 */
const VB = "0 0 640 452";
const bone = "var(--color-bone)";

function Layer({ n, name, className, children }: { n: string; name: string; className?: string; children: ReactNode }) {
  return (
    <div className={`bp-layer absolute inset-0 ${className ?? ""}`} data-layer={n}>
      <svg viewBox={VB} className="h-auto w-full overflow-visible" aria-hidden="true" focusable="false">
        {/* Folha da camada: invisível na planta montada, aparece na vista explodida */}
        {n !== "01" && (
          <rect
            className="bp-plate"
            x="24.5"
            y="34.5"
            width="591"
            height="392"
            rx="14"
            fill="var(--color-ink-2)"
            fillOpacity=".35"
            stroke="var(--color-accent)"
            strokeOpacity=".55"
            strokeDasharray="4 6"
            opacity="0"
          />
        )}
        {children}
      </svg>
      {/* Rótulo da camada: só aparece na vista explodida */}
      <span className={`bp-tag label pointer-events-none absolute right-[calc(100%_+_0.75rem)] whitespace-nowrap ${n === "01" ? "top-[72%]" : "top-[8%]"} rounded-full bg-ink px-2.5 py-1.5 text-[0.8125rem] text-accent-hi opacity-0 ring-1 ring-accent/40`}>
        {n} · {name}
      </span>
    </div>
  );
}

export function HeroBlueprint() {
  return (
    <div
      className="bp-stack relative"
      role="img"
      aria-label="Ilustração: o esboço de um site sendo montado em camadas — wireframe, design e código — com medidas técnicas e um cursor clicando no botão de contato."
    >
      {/* Espaçador invisível que dá a altura do conjunto (as camadas são absolutas) */}
      <svg viewBox={VB} className="invisible block h-auto w-full" aria-hidden="true" focusable="false" />

      <Layer n="01" name="wireframe">
        {/* Cota superior */}
        <g className="bp-anno" fontFamily="var(--font-mono)" fontSize="11" fill="var(--color-muted-dark)">
          <path d="M24 10v10M616 10v10M24 15h592" stroke="currentColor" strokeOpacity=".35" />
          <rect x="286" y="7" width="68" height="16" fill="var(--color-ink)" />
          <text x="320" y="19" textAnchor="middle" fill="var(--color-muted-dark)">1440 px</text>
        </g>

        {/* Moldura do navegador */}
        <rect
          className="bp-draw"
          x="24.5"
          y="34.5"
          width="591"
          height="392"
          rx="14"
          fill="var(--color-ink-2)"
          fillOpacity=".7"
          stroke={bone}
          strokeOpacity=".28"
          pathLength={1}
        />
        <g className="bp-bar">
          <path d="M25 70h590" stroke={bone} strokeOpacity=".12" />
          <circle cx="46" cy="52" r="4" fill={bone} fillOpacity=".22" />
          <circle cx="60" cy="52" r="4" fill={bone} fillOpacity=".22" />
          <circle cx="74" cy="52" r="4" fill={bone} fillOpacity=".22" />
          <rect x="232" y="43" width="176" height="18" rx="9" fill={bone} fillOpacity=".06" />
          <text x="320" y="56" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-muted-dark)">
            suaempresa.com.br
          </text>
        </g>

        {/* Área de imagem (hachura) */}
        <g className="bp-block">
          <rect x="372" y="132" width="216" height="158" rx="8" fill={bone} fillOpacity=".05" stroke={bone} strokeOpacity=".16" />
          <path d="M372 132l216 158M588 132 372 290" stroke={bone} strokeOpacity=".1" />
        </g>

        {/* Contorno dos cards */}
        {[52, 232, 412].map((x) => (
          <rect key={x} className="bp-card" x={x} y="322" width="176" height="80" rx="8" fill={bone} fillOpacity=".045" stroke={bone} strokeOpacity=".12" />
        ))}

        {/* Cota lateral */}
        <g className="bp-anno" fontFamily="var(--font-mono)" fontSize="10.5" fill="var(--color-muted-dark)">
          <path d="M8 140v150M4 140h8M4 290h8" stroke="currentColor" strokeOpacity=".35" />
          <text x="-215" y="0" transform="rotate(-90) translate(0 3)" textAnchor="middle" fill="var(--color-muted-dark)">
            acima da dobra
          </text>
        </g>
      </Layer>

      <Layer n="02" name="design">
        {/* Nav do site esboçado */}
        <g className="bp-block">
          <rect x="52" y="90" width="64" height="10" rx="2" fill={bone} fillOpacity=".7" />
          <rect x="360" y="92" width="36" height="6" rx="3" fill={bone} fillOpacity=".2" />
          <rect x="408" y="92" width="36" height="6" rx="3" fill={bone} fillOpacity=".2" />
          <rect x="456" y="92" width="36" height="6" rx="3" fill={bone} fillOpacity=".2" />
          <rect x="518" y="86" width="70" height="18" rx="9" fill={bone} fillOpacity=".12" />
        </g>

        {/* Título + texto */}
        <rect className="bp-block" x="52" y="140" width="286" height="24" rx="3" fill={bone} fillOpacity=".9" />
        <rect className="bp-block" x="52" y="172" width="226" height="24" rx="3" fill={bone} fillOpacity=".9" />
        <rect className="bp-block" x="52" y="214" width="250" height="7" rx="3.5" fill={bone} fillOpacity=".25" />
        <rect className="bp-block" x="52" y="229" width="206" height="7" rx="3.5" fill={bone} fillOpacity=".25" />

        {/* CTA */}
        <g className="bp-cta">
          <rect x="52" y="258" width="118" height="32" rx="16" fill="var(--color-accent)" />
          <rect x="70" y="271" width="64" height="6" rx="3" fill="#fff" fillOpacity=".9" />
          <path d="m144 270 5 4-5 4" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </g>

        {/* Conteúdo dos cards */}
        {[52, 232, 412].map((x) => (
          <g key={x} className="bp-card">
            <rect x={x + 16} y="340" width="18" height="18" rx="4" fill="var(--color-accent)" fillOpacity=".75" />
            <rect x={x + 16} y="370" width="96" height="6" rx="3" fill={bone} fillOpacity=".4" />
            <rect x={x + 16} y="383" width="128" height="5" rx="2.5" fill={bone} fillOpacity=".16" />
          </g>
        ))}
      </Layer>

      <Layer n="03" name="código">
        <circle className="bp-ripple" cx="111" cy="274" r="16" fill="none" stroke="var(--color-accent-hi)" strokeWidth="1.5" opacity="0" />

        <g className="bp-anno bp-callout" fontFamily="var(--font-mono)" fontSize="11">
          <path d="M170 274h52l14-14h40" stroke="var(--color-accent-hi)" strokeOpacity=".8" fill="none" />
          <circle cx="170" cy="274" r="2.5" fill="var(--color-accent-hi)" />
          <text x="282" y="264" fill="var(--color-accent-hi)">CTA → WhatsApp</text>
        </g>

        {/* Selo final */}
        <g className="bp-status" fontFamily="var(--font-mono)" fontSize="11">
          <rect x="446" y="411" width="170" height="30" rx="15" fill="var(--color-ink)" stroke="var(--color-accent)" strokeOpacity=".6" />
          <circle cx="466" cy="426" r="4" fill="#3ddc97" />
          <text x="480" y="430" fill={bone}>pronto para publicar</text>
        </g>

        {/* Cursor */}
        <g className="bp-cursor" transform="translate(520 380)">
          <path
            d="M0 0v19l5-4.6 3.4 7.6 3.3-1.5-3.3-7.4H15L0 0Z"
            fill="#fff"
            stroke="var(--color-ink)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </g>
      </Layer>
    </div>
  );
}
