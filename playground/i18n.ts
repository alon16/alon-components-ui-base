import { computed, inject, type InjectionKey, type Ref } from "vue";

export type Locale = "es" | "en";

// Un texto plano se muestra igual en ambos idiomas.
export type Localized = string | Record<Locale, string>;

export const localeKey: InjectionKey<Ref<Locale>> = Symbol("playground-locale");

export function translate(text: Localized, locale: Locale) {
  return typeof text === "string" ? text : text[locale];
}

const es = {
  skipLink: "Saltar al contenido",
  openNav: "Abrir navegación",
  closeNav: "Cerrar navegación",
  darkTheme: "Tema oscuro",
  english: "Inglés",
  searchLabel: "Buscar componente",
  searchPlaceholder: "Ej.: tabla, fecha…",
  navLabel: "Componentes",
  gettingStarted: "Primeros pasos",
  noMatches: (query: string) =>
    `No hay componentes que coincidan con «${query}».`,
  heroEyebrow: "Biblioteca de componentes Vue 3",
  heroTitle: "Componentes tematizables para portales web",
  heroLead:
    "Cada ejemplo se renderiza en vivo desde el código fuente y muestra exactamente el código que necesitas para implementarlo. Alterna el tema oscuro para validar los tokens `--ui-*`.",
  statComponents: "Componentes",
  statExamples: "Ejemplos",
  statThemes: "Temas",
  stepInstall: "Instala el paquete",
  stepSetup: "Importa los estilos y tu tema",
  stepUse: "Usa los componentes",
  setupThemeComment: "Tu tema va al final para sobrescribir los tokens --ui-*.",
  usageNameLabel: "Nombre",
  usageSave: "Guardar",
  footer:
    "Referencia completa de props, eventos y slots en `docs/components.md`; tokens de tema en `docs/theming.md`.",
  importFilename: "Importación",
  showCode: "Ver código",
  hideCode: "Ocultar código",
  missingExample: (example: string) => `No existe el ejemplo «${example}».`,
  copy: "Copiar",
  copied: "Copiado",
  copyLabel: "Copiar código",
  copiedLabel: "Código copiado",
  copiedAnnouncement: "Código copiado al portapapeles",
};

const en: typeof es = {
  skipLink: "Skip to content",
  openNav: "Open navigation",
  closeNav: "Close navigation",
  darkTheme: "Dark theme",
  english: "English",
  searchLabel: "Search component",
  searchPlaceholder: "E.g.: table, date…",
  navLabel: "Components",
  gettingStarted: "Getting started",
  noMatches: (query: string) => `No components match “${query}”.`,
  heroEyebrow: "Vue 3 component library",
  heroTitle: "Themeable components for web portals",
  heroLead:
    "Every example renders live from its source code and shows exactly the code you need to implement it. Toggle the dark theme to validate the `--ui-*` tokens.",
  statComponents: "Components",
  statExamples: "Examples",
  statThemes: "Themes",
  stepInstall: "Install the package",
  stepSetup: "Import the styles and your theme",
  stepUse: "Use the components",
  setupThemeComment: "Your theme goes last to override the --ui-* tokens.",
  usageNameLabel: "Name",
  usageSave: "Save",
  footer:
    "Full reference of props, events and slots in `docs/components.md`; theme tokens in `docs/theming.md`.",
  importFilename: "Import",
  showCode: "Show code",
  hideCode: "Hide code",
  missingExample: (example: string) =>
    `The example “${example}” does not exist.`,
  copy: "Copy",
  copied: "Copied",
  copyLabel: "Copy code",
  copiedLabel: "Code copied",
  copiedAnnouncement: "Code copied to clipboard",
};

export const messages: Record<Locale, typeof es> = { es, en };

export function useMessages() {
  const locale = inject(localeKey);
  return computed(() => messages[locale?.value ?? "es"]);
}
