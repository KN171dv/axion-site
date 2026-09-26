import { renderToString } from "react-dom/server";
import { App } from "./App";
import { renderHead } from "./lib/head";

export function render() {
  return { html: renderToString(<App />), head: renderHead() };
}
