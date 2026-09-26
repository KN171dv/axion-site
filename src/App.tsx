import { LazyMotion } from "motion/react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { useScrollReveal } from "./hooks/useScrollReveal";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { Contact } from "./sections/Contact";
import { Faq } from "./sections/Faq";
import { Guarantees } from "./sections/Guarantees";
import { Hero } from "./sections/Hero";
import { Manifesto } from "./sections/Manifesto";
import { Portfolio } from "./sections/Portfolio";
import { Process } from "./sections/Process";
import { Services } from "./sections/Services";
import { Testimonials } from "./sections/Testimonials";

// Recursos de animação do Motion carregados depois da primeira pintura.
const loadMotionFeatures = () => import("./lib/motionFeatures").then((m) => m.default);

export function App() {
  useSmoothScroll();
  useScrollReveal();

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        <Manifesto />
        <Services />
        <Portfolio />
        <Testimonials />
        <Process />
        <Guarantees />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </LazyMotion>
  );
}
