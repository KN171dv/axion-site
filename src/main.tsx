import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./styles/index.css";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Em produção o HTML vem pré-renderizado (scripts/prerender.mjs) e é hidratado.
if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);
