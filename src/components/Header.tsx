import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { contact, defaultWhatsappMessage, nav, whatsappLink } from "../content/site";
import { easeCss } from "../lib/motion";
import { Button } from "./Button";
import { ArrowUpRight } from "./Icons";
import { Logo } from "./Logo";

type Tone = "dark" | "light";

/**
 * Header fixo que:
 *  - some ao rolar para baixo e volta ao rolar para cima (mais área de leitura);
 *  - troca de tom conforme a seção sob ele (data-tone), sem depender de blur pesado.
 */
export function Header() {
  const [tone, setTone] = useState<Tone>("dark");
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setHidden(y > 480 && y > lastY.current + 4);
      if (y < lastY.current - 4 || y < 480) setHidden(false);
      lastY.current = y;

      // Qual seção está logo abaixo do header?
      const probe = document.elementsFromPoint(window.innerWidth / 2, 36);
      const section = probe.map((el) => el.closest<HTMLElement>("[data-tone]")).find(Boolean);
      if (section) setTone(section.dataset.tone as Tone);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const light = tone === "light" && !open;
  const surface = scrolled && !open ? (light ? "bg-paper/85 backdrop-blur-md shadow-[0_1px_0_var(--color-line-light)]" : "bg-ink/80 backdrop-blur-md shadow-[0_1px_0_var(--color-line-dark)]") : "";

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-bone focus:px-4 focus:py-2 focus:text-ink"
      >
        Pular para o conteúdo
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color,box-shadow] duration-500 ease-out-expo ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${surface} ${light ? "text-ink" : "text-bone"}`}
      >
        <div className="container-x flex h-16 items-center justify-between md:h-[4.5rem]">
          <a href="#inicio" aria-label="Axion — voltar ao início" className="relative z-10 -m-2 p-2">
            <Logo />
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-9 text-[0.9375rem]">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="link-underline py-1 opacity-80 transition-opacity hover:opacity-100">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <Button href="#contato" variant={light ? "outline-light" : "outline-dark"}>
                Pedir orçamento
              </Button>
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              className="relative z-10 -mr-2 inline-flex size-11 items-center justify-center lg:hidden"
            >
              <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
              <span aria-hidden="true" className="relative block h-3 w-6">
                <span
                  className={`absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-out-expo ${
                    open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-out-expo ${
                    open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink pt-24 text-bone lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: easeCss }}
          >
            <nav aria-label="Menu móvel" className="container-x flex-1">
              <ul className="border-t border-line-dark">
                {[...nav, { label: "Contato", href: "#contato" }].map((item, i) => (
                  <m.li
                    key={item.href}
                    className="border-b border-line-dark"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: easeCss }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between py-5 text-[2rem] font-medium tracking-[-0.03em]"
                    >
                      {item.label}
                      <span className="label text-muted-dark tabular">0{i + 1}</span>
                    </a>
                  </m.li>
                ))}
              </ul>
            </nav>
            <m.div
              className="container-x pb-[max(2rem,env(safe-area-inset-bottom))]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <Button
                href={whatsappLink(defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                className="w-full"
                icon={<ArrowUpRight className="size-4.5" />}
              >
                Conversar no WhatsApp
              </Button>
              <p className="label mt-5 text-center text-muted-dark">{contact.whatsappDisplay}</p>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
