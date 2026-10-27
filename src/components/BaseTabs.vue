<script setup lang="ts">
import { computed, nextTick } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  tabs: {
    type: Array,
    required: true,
    default: () => [],
  },
  ariaLabel: {
    type: String,
    default: "Pestañas",
  },
});

const emit = defineEmits(["update:modelValue"]);

const normalizedTabs = computed(() =>
  props.tabs.map((tab) => ({
    label: tab.label ?? tab.title ?? "",
    value: tab.value ?? tab.id ?? "",
    disabled: Boolean(tab.disabled),
    id: tab.id ?? `${tab.value ?? tab.label ?? "tab"}-tab`,
    panelId: tab.panelId ?? `${tab.value ?? tab.label ?? "tab"}-panel`,
  })),
);

function selectTab(value) {
  if (props.modelValue === value) return;
  emit("update:modelValue", value);
}

function handleKeydown(event, index) {
  if (event.key === "Home" || event.key === "End") {
    event.preventDefault();
    const candidates = normalizedTabs.value.filter((tab) => !tab.disabled);
    const tab = event.key === "Home" ? candidates[0] : candidates.at(-1);
    if (tab) {
      selectTab(tab.value);
      nextTick(() => document.getElementById(tab.id)?.focus());
    }
    return;
  }

  const direction =
    event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
  if (!direction) return;

  event.preventDefault();

  for (let offset = 1; offset <= normalizedTabs.value.length; offset += 1) {
    const nextIndex =
      (index + direction * offset + normalizedTabs.value.length) %
      normalizedTabs.value.length;
    const nextTab = normalizedTabs.value[nextIndex];
    if (!nextTab?.disabled) {
      selectTab(nextTab.value);
      nextTick(() => document.getElementById(nextTab.id)?.focus());
      return;
    }
  }
}
</script>

<template>
  <div class="base-tabs" role="tablist" :aria-label="ariaLabel">
    <button
      v-for="(tab, index) in normalizedTabs"
      :key="tab.value"
      :id="tab.id"
      class="base-tabs__tab"
      :class="{ 'base-tabs__tab--active': modelValue === tab.value }"
      type="button"
      role="tab"
      :aria-selected="modelValue === tab.value"
      :aria-controls="tab.panelId"
      :disabled="tab.disabled"
      @click="selectTab(tab.value)"
      @keydown.left.prevent="handleKeydown($event, index)"
      @keydown.right.prevent="handleKeydown($event, index)"
      @keydown.home.prevent="handleKeydown($event, index)"
      @keydown.end.prevent="handleKeydown($event, index)"
    >
      <slot name="tab" :tab="tab">{{ tab.label }}</slot>
    </button>
  </div>
</template>

<style scoped>
.base-tabs {
  display: flex;
  gap: var(--space-5);
  padding-bottom: var(--space-1);
  margin-bottom: var(--bs-tabs-margin-bottom);
  border-bottom: var(--border-width-thin) solid var(--bs-color-border-inverse);
}

.base-tabs__tab {
  position: relative;
  padding: var(--space-2) var(--space-0);
  border: var(--space-0);
  color: var(--bs-color-text-inverse-muted);
  background: transparent;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.base-tabs__tab::after {
  position: absolute;
  right: var(--space-0);
  bottom: calc(var(--space-1) * -1);
  left: var(--space-0);
  height: var(--border-width-accent);
  border-radius: var(--radius-round);
  background: transparent;
  content: "";
}

.base-tabs__tab:hover,
.base-tabs__tab--active {
  color: var(--bs-color-text-inverse);
}

.base-tabs__tab--active {
  font-weight: var(--font-weight-bold);
}

.base-tabs__tab--active::after {
  background: var(--bs-color-brand-primary);
}

.base-tabs__tab:focus-visible {
  outline: var(--focus-outline-width) solid var(--bs-color-focus-ring);
  outline-offset: var(--focus-outline-offset);
}
</style>
