import type { Study } from "../content/site";

/**
 * Mockups desenhados em código (não imagens): leves, nítidos em qualquer tela e
 * escalam por container query (unidades cqw). Cada estudo tem direção de arte própria
 * para mostrar que a Axion não entrega o mesmo site com cores trocadas.
 */
export function StudyMockup({ id }: { id: Study["id"] }) {
  return (
    <div className="overflow-hidden rounded-[10px] bg-ink-3 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)] ring-1 ring-line-dark">
      <div className="flex h-7 items-center gap-1.5 border-b border-line-dark px-3" aria-hidden="true">
        <span className="size-2 rounded-full bg-bone/20" />
        <span className="size-2 rounded-full bg-bone/20" />
        <span className="size-2 rounded-full bg-bone/20" />
      </div>
      <div className="aspect-[16/10] [container-type:inline-size]" aria-hidden="true">
        {id === "barbearia" && <Barbearia />}
        {id === "oficina" && <Oficina />}
        {id === "restaurante" && <Restaurante />}
      </div>
    </div>
  );
}

const serif = "ui-serif, Georgia, 'Times New Roman', serif";

function Barbearia() {
  return (
    <div className="relative grid h-full grid-cols-[1.25fr_1fr] bg-[#14110e] text-[#efe6d6]">
      <div className="flex flex-col p-[5cqw]">
        <div className="flex items-center justify-between text-[1.5cqw] tracking-[0.3em]">
          <span style={{ fontFamily: serif }}>BARBEARIA PREMIUM</span>
        </div>
        <p className="mt-auto text-[1.4cqw] uppercase tracking-[0.25em] text-[#c8a46a]">Desde a primeira navalha</p>
        <p className="mt-[1.5cqw] text-[5.4cqw] italic leading-[0.98]" style={{ fontFamily: serif }}>
          Corte, barba
          <br />e hora marcada.
        </p>
        <div className="mt-[3cqw] rounded-[0.8cqw] border border-[#efe6d6]/15 p-[1.8cqw]">
          <p className="text-[1.3cqw] uppercase tracking-[0.2em] text-[#efe6d6]/60">Hoje · horários livres</p>
          <div className="mt-[1.2cqw] flex gap-[1cqw] text-[1.6cqw]">
            {["10:00", "11:30", "14:00", "16:30"].map((t, i) => (
              <span
                key={t}
                className={`rounded-full px-[1.4cqw] py-[0.6cqw] ${i === 1 ? "bg-[#c8a46a] text-[#14110e]" : "border border-[#efe6d6]/20"}`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <span className="mt-[2cqw] self-start rounded-full bg-[#efe6d6] px-[2.2cqw] py-[1cqw] text-[1.5cqw] font-medium text-[#14110e]">
          Agendar pelo WhatsApp
        </span>
      </div>
      <div className="relative overflow-hidden border-l border-[#efe6d6]/10">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,#c8a46a22_0_2cqw,transparent_2cqw_5cqw)]" />
        <div className="absolute inset-x-[18%] inset-y-[14%] rounded-t-full border border-[#c8a46a]/40 bg-[radial-gradient(circle_at_50%_30%,#3a2c1d,#14110e)]" />
        <p className="absolute bottom-[4cqw] left-[4cqw] text-[1.3cqw] tracking-[0.2em] text-[#efe6d6]/60">CORTE · BARBA · TOALHA QUENTE</p>
      </div>
    </div>
  );
}

function Oficina() {
  const steps = ["Diagnóstico", "Orçamento", "Em serviço", "Pronto"];
  return (
    <div className="flex h-full flex-col bg-[#0f0f0f] p-[5cqw] text-[#f4f4f0]">
      <div className="flex items-center justify-between">
        <span className="text-[1.7cqw] font-extrabold uppercase tracking-[-0.02em]">
          Oficina<span className="text-[#f2c230]">/</span>Performance
        </span>
        <span className="rounded-[0.4cqw] bg-[#f2c230] px-[1.6cqw] py-[0.8cqw] text-[1.3cqw] font-bold uppercase text-[#0f0f0f]">
          Orçamento
        </span>
      </div>
      <p className="mt-[5cqw] text-[7.4cqw] font-extrabold uppercase leading-[0.86] tracking-[-0.05em]">
        Revisão
        <br />
        sem <span className="text-[#f2c230]">surpresa.</span>
      </p>
      <div className="mt-auto">
        <p className="text-[1.3cqw] uppercase tracking-[0.2em] text-[#f4f4f0]/50">Acompanhe seu carro · placa ABC-1D23</p>
        <div className="mt-[1.6cqw] grid grid-cols-4 gap-[1cqw]">
          {steps.map((s, i) => (
            <div key={s}>
              <div className={`h-[0.6cqw] ${i < 3 ? "bg-[#f2c230]" : "bg-[#f4f4f0]/15"}`} />
              <p className={`mt-[1cqw] text-[1.4cqw] font-semibold uppercase ${i === 2 ? "text-[#f2c230]" : i < 2 ? "" : "text-[#f4f4f0]/60"}`}>
                {s}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-[3cqw] grid grid-cols-3 border-t border-[#f4f4f0]/15 text-[1.4cqw]">
          {[
            ["Troca de óleo", "40 min"],
            ["Freios", "2 h"],
            ["Suspensão", "1 dia"],
          ].map(([a, b]) => (
            <div key={a} className="flex justify-between border-r border-[#f4f4f0]/15 py-[1.4cqw] pr-[1.6cqw] last:border-r-0 [&:not(:first-child)]:pl-[1.6cqw]">
              <span>{a}</span>
              <span className="text-[#f4f4f0]/50">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Restaurante() {
  return (
    <div className="grid h-full grid-cols-[1fr_1.1fr] bg-[#f3ecdf] text-[#2a1c14]">
      <div className="flex flex-col bg-[#a9361f] p-[5cqw] text-[#f3ecdf]">
        <span className="text-[1.7cqw] tracking-[0.02em]" style={{ fontFamily: serif }}>
          Sabor Urbano
        </span>
        <p className="mt-auto text-[5cqw] leading-[1] tracking-[-0.01em]" style={{ fontFamily: serif }}>
          Da nossa cozinha, direto para a sua mesa.
        </p>
        <p className="mt-[2cqw] text-[1.4cqw] opacity-90">Peça pelo WhatsApp · sem taxa de aplicativo</p>
      </div>
      <div className="flex flex-col p-[4.5cqw]">
        <p className="text-[1.3cqw] uppercase tracking-[0.2em] opacity-80">Cardápio · hoje</p>
        <ul className="mt-[2cqw] divide-y divide-[#2a1c14]/15 text-[1.8cqw]">
          {[
            ["Risoto de cogumelos", "58"],
            ["Polvo na brasa", "89"],
            ["Burrata e tomates", "46"],
            ["Pudim da casa", "22"],
          ].map(([n, p]) => (
            <li key={n} className="flex items-center justify-between py-[1.5cqw]">
              <span style={{ fontFamily: serif }}>{n}</span>
              <span className="flex items-center gap-[1.4cqw]">
                <span className="tabular-nums opacity-80">R$ {p}</span>
                <span className="rounded-full border border-[#2a1c14]/30 px-[1.2cqw] py-[0.4cqw] text-[1.3cqw]">+ pedir</span>
              </span>
            </li>
          ))}
        </ul>
        <span className="mt-auto self-stretch rounded-full bg-[#2a1c14] py-[1.3cqw] text-center text-[1.5cqw] text-[#f3ecdf]">
          Enviar pedido · 2 itens
        </span>
      </div>
    </div>
  );
}
