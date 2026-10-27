<script setup lang="ts">
import BaseIcon from "./BaseIcon.vue";

withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    tone?: "danger" | "warning" | "info" | "primary" | "secondary";
    icon?: string;
    dismissible?: boolean;
    closeLabel?: string;
  }>(),
  {
    title: "",
    description: "",
    tone: "info",
    icon: "",
    dismissible: false,
    closeLabel: "Cerrar aviso",
  },
);

const emit = defineEmits<{ dismiss: [] }>();
</script>

<template>
  <section
    class="base-alert"
    :class="`base-alert--${tone}`"
    :role="tone === 'danger' || tone === 'warning' ? 'alert' : 'status'"
  >
    <div class="base-alert__content">
      <p v-if="title" class="base-alert__title">{{ title }}</p>
      <div
        v-if="description || $slots.icon"
        class="base-alert__description-row"
      >
        <slot v-if="$slots.icon" name="icon" />
        <BaseIcon v-else-if="icon" :name="icon" size="md" decorative />
        <p v-if="description" class="base-alert__description">
          {{ description }}
        </p>
      </div>
      <div v-if="$slots.default" class="base-alert__body"><slot /></div>
    </div>
    <button
      v-if="dismissible"
      class="base-alert__close"
      type="button"
      :aria-label="closeLabel"
      @click="emit('dismiss')"
    >
      <BaseIcon name="close" size="sm" decorative />
    </button>
  </section>
</template>

<style scoped>
.base-alert {
  --alert-background: var(--ui-alert-info-background);
  --alert-border: var(--ui-alert-info-border);
  --alert-text: var(--ui-alert-info-text);

  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  border: var(--border-width-thin) solid var(--alert-border);
  border-radius: var(--radius-md);
  color: var(--alert-text);
  background: var(--alert-background);
}

.base-alert--danger {
  --alert-background: var(--ui-alert-danger-background);
  --alert-border: var(--ui-alert-danger-border);
  --alert-text: var(--ui-alert-danger-text);
}

.base-alert--warning {
  --alert-background: var(--ui-alert-warning-background);
  --alert-border: var(--ui-alert-warning-border);
  --alert-text: var(--ui-alert-warning-text);
}

.base-alert--info {
  --alert-background: var(--ui-alert-info-background);
  --alert-border: var(--ui-alert-info-border);
  --alert-text: var(--ui-alert-info-text);
}

.base-alert--primary {
  --alert-background: var(--ui-alert-primary-background);
  --alert-border: var(--ui-alert-primary-border);
  --alert-text: var(--ui-alert-primary-text);
}

.base-alert--secondary {
  --alert-background: var(--ui-alert-secondary-background);
  --alert-border: var(--ui-alert-secondary-border);
  --alert-text: var(--ui-alert-secondary-text);
}

.base-alert__content {
  min-width: 0;
  flex: 1;
}

.base-alert__title {
  margin: 0;
  color: inherit;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-base);
}

.base-alert__description-row {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  margin-top: var(--space-1);
}

.base-alert__description-row :deep(.base-icon) {
  margin-top: var(--space-1);
}

.base-alert__description {
  margin: 0;
  color: inherit;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-base);
}

.base-alert__body {
  margin-top: var(--space-2);
}

.base-alert__close {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: var(--space-6);
  height: var(--space-6);
  margin: calc(var(--space-1) * -1) calc(var(--space-1) * -1) 0 0;
  padding: 0;
  border: var(--border-width-thin) solid transparent;
  border-radius: var(--radius-sm);
  color: inherit;
  background: transparent;
  cursor: pointer;
}

.base-alert__close:hover {
  background: var(--ui-alert-close-hover-background);
}

.base-alert__close:focus-visible {
  outline: var(--focus-outline-width) solid var(--ui-color-focus-ring);
  outline-offset: var(--focus-outline-offset);
}
</style>
