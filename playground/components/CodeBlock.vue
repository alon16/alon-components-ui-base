<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";

import { BaseButton, BaseIcon } from "../../src/index";
import { useMessages } from "../i18n";
import { highlight, type CodeLanguage } from "../utils/highlight";

const props = withDefaults(
  defineProps<{
    code: string;
    language?: CodeLanguage;
    filename?: string;
  }>(),
  { language: "vue", filename: "" },
);

const t = useMessages();
const copied = ref(false);
let copiedTimer: ReturnType<typeof setTimeout> | undefined;

const html = computed(() => highlight(props.code.trim(), props.language));
const languageLabel = computed(
  () =>
    ({ vue: "Vue", ts: "TypeScript", css: "CSS", bash: "Terminal" })[
      props.language
    ],
);

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code.trim());
    copied.value = true;
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => (copied.value = false), 1800);
  } catch {
    copied.value = false;
  }
}

onUnmounted(() => clearTimeout(copiedTimer));
</script>

<template>
  <div class="pg-code">
    <div class="pg-code__bar">
      <span class="pg-code__file">
        <BaseIcon name="clipboard" size="sm" decorative />
        {{ filename || languageLabel }}
      </span>
      <BaseButton
        size="sm"
        variant="ghost"
        :aria-label="copied ? t.copiedLabel : t.copyLabel"
        @click="copy"
      >
        <BaseIcon :name="copied ? 'check' : 'copy'" size="sm" decorative />
        {{ copied ? t.copied : t.copy }}
      </BaseButton>
      <span class="pg-visually-hidden" aria-live="polite">{{
        copied ? t.copiedAnnouncement : ""
      }}</span>
    </div>
    <pre class="pg-code__pre" tabindex="0"><code v-html="html" /></pre>
  </div>
</template>
