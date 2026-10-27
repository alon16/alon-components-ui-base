import type { Component } from "vue";

// Cada ejemplo es un SFC autónomo: se renderiza en vivo y su fuente se muestra
// tal cual, de modo que el código visible nunca se desincroniza de la demo.
const components = import.meta.glob<Component>("./**/*.vue", {
  eager: true,
  import: "default",
});
const sources = import.meta.glob<string>("./**/*.vue", {
  eager: true,
  query: "?raw",
  import: "default",
});

export const examples: Record<
  string,
  { component: Component; source: string }
> = Object.fromEntries(
  Object.keys(components).map((path) => [
    path.replace(/^\.\//, "").replace(/\.vue$/, ""),
    { component: components[path], source: sources[path] },
  ]),
);

export function toConsumerSource(source: string) {
  return source.replace(
    /from "(?:\.\.\/)+src\/index"/g,
    'from "@alon16/components-ui-base"',
  );
}
