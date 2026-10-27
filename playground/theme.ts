import type { InjectionKey, Ref } from "vue";

export type Theme = "light" | "dark";

export const themeKey: InjectionKey<Ref<Theme>> = Symbol("playground-theme");
