import { type FormEvent, useId, useState } from "react";
import { Button } from "../components/Button";
import { ArrowUpRight, Instagram, Mail, WhatsApp } from "../components/Icons";
import { RevealLines } from "../components/RevealLines";
import { SectionLabel } from "../components/SectionLabel";
import { contact, defaultWhatsappMessage, projectTypes, whatsappLink } from "../content/site";

/**
 * Não há backend: o formulário só monta uma mensagem e abre o WhatsApp.
 * Vantagem para a Axion: o contato já chega com nome, tipo de projeto e contexto.
 * Nenhum dado é armazenado ou enviado para terceiros pelo site.
 */
function buildMessage(data: { nome: string; empresa: string; tipo: string; mensagem: string }) {
  const lines = [
    `Olá, Axion! Meu nome é ${data.nome}${data.empresa ? `, da ${data.empresa}` : ""}.`,
    `Tenho interesse em: ${data.tipo}.`,
  ];
  if (data.mensagem) lines.push("", data.mensagem);
  return lines.join("\n");
}

export function Contact() {
  const id = useId();
  const [tipo, setTipo] = useState<string>(projectTypes[0]);
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nome = String(fd.get("nome") ?? "").trim();
    if (!nome) {
      setError("Diga como podemos te chamar.");
      e.currentTarget.querySelector<HTMLInputElement>("input[name=nome]")?.focus();
      return;
    }
    setError("");
    const msg = buildMessage({
      nome,
      empresa: String(fd.get("empresa") ?? "").trim(),
      tipo,
      mensagem: String(fd.get("mensagem") ?? "").trim(),
    });
    window.open(whatsappLink(msg), "_blank", "noopener,noreferrer");
  };

  const field =
    "w-full rounded-none border-0 border-b border-line-dark bg-transparent px-0 py-3 text-[1.0625rem] text-bone placeholder:text-muted-dark/60 transition-colors focus:border-accent focus:outline-none focus:ring-0";

  return (
    <section id="contato" data-tone="dark" aria-labelledby="contato-title" className="section-y relative overflow-hidden">
      <div aria-hidden="true" className="blueprint pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_20%_30%,black,transparent_70%)]" />
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <SectionLabel index="06">Contato</SectionLabel>
          <RevealLines
            id="contato-title"
            lines={["Vamos", "construir", <>o seu<span className="text-accent">.</span></>]}
            className="display mt-8 text-[clamp(3rem,1.5rem+7vw,8rem)] md:mt-10"
          />
          <p className="lead mt-8 max-w-[30rem] text-muted-dark" data-reveal>
            Conte o essencial e a mensagem chega pronta no nosso WhatsApp. Respondemos com uma proposta personalizada em até 24 horas.
          </p>

          <ul className="mt-12 space-y-1 text-[0.9375rem]" data-reveal>
            <li>
              <a href={whatsappLink(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 py-2">
                <WhatsApp className="size-4.5 text-muted-dark" />
                <span className="link-underline">{contact.whatsappDisplay}</span>
              </a>
            </li>
            <li>
              <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 py-2">
                <Instagram className="size-4.5 text-muted-dark" />
                <span className="link-underline">{contact.instagramHandle}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="group inline-flex items-center gap-3 py-2">
                <Mail className="size-4.5 text-muted-dark" />
                <span className="link-underline">{contact.email}</span>
              </a>
            </li>
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          aria-describedby={`${id}-privacy`}
          className="self-end rounded-[4px] bg-ink-2 p-6 ring-1 ring-line-dark sm:p-8 lg:col-span-5 lg:col-start-8 xl:p-10"
          data-reveal
        >
          <p className="label text-muted-dark">Pedido de orçamento</p>

          <div className="mt-8 grid gap-7">
            <div>
              <label htmlFor={`${id}-nome`} className="label text-muted-dark">
                Nome
              </label>
              <input
                id={`${id}-nome`}
                name="nome"
                autoComplete="name"
                required
                maxLength={80}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-err` : undefined}
                className={field}
                placeholder="Como podemos te chamar?"
              />
              {error && (
                <p id={`${id}-err`} role="alert" className="mt-2 text-[0.875rem] text-[#ff8a7a]">
                  {error}
                </p>
              )}
            </div>
            <div>
              <label htmlFor={`${id}-empresa`} className="label text-muted-dark">
                Empresa <span className="normal-case tracking-normal">(opcional)</span>
              </label>
              <input id={`${id}-empresa`} name="empresa" autoComplete="organization" maxLength={80} className={field} placeholder="Nome do negócio" />
            </div>

            <fieldset>
              <legend className="label text-muted-dark">O que você precisa?</legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {projectTypes.map((t) => (
                  <label key={t} className="cursor-pointer">
                    <input type="radio" name="tipo" value={t} checked={tipo === t} onChange={() => setTipo(t)} className="peer sr-only" />
                    <span className="inline-flex h-10 items-center rounded-full px-4 text-[0.875rem] ring-1 ring-inset ring-line-dark transition-colors duration-300 hover:ring-bone/40 peer-checked:bg-bone peer-checked:text-ink peer-checked:ring-bone peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor={`${id}-msg`} className="label text-muted-dark">
                Contexto <span className="normal-case tracking-normal">(opcional)</span>
              </label>
              <textarea
                id={`${id}-msg`}
                name="mensagem"
                rows={3}
                maxLength={600}
                className={`${field} resize-none`}
                placeholder="Seu segmento, se já tem site, prazo desejado…"
              />
            </div>
          </div>

          <button
            type="submit"
            className="group mt-10 inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-action text-base font-medium text-white transition-colors duration-300 hover:bg-accent-lo active:scale-[0.99]"
          >
            <WhatsApp className="size-5" />
            Enviar pelo WhatsApp
            <ArrowUpRight className="size-4.5 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
          <p id={`${id}-privacy`} className="mt-4 text-center text-[0.8125rem] leading-relaxed text-muted-dark">
            Abre o WhatsApp com a mensagem pronta. Nada é armazenado neste site.
          </p>
        </form>
      </div>

      <noscript>
        <div className="container-x mt-10">
          <Button href={whatsappLink(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer">
            Falar no WhatsApp
          </Button>
        </div>
      </noscript>
    </section>
  );
}
