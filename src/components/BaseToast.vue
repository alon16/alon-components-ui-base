<script setup lang="ts">
import { computed, onBeforeUnmount, useId, useSlots, ref, watch } from "vue";
import BaseIcon from "./BaseIcon.vue";

const props = defineProps({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  tone: {
    type: String,
    default: "info",
    validator: (value) =>
      ["success", "info", "warning", "danger"].includes(value),
  },
  icon: { type: String, default: "" },
  dismissible: { type: Boolean, default: true },
  closeLabel: { type: String, default: "Cerrar notificación" },
  duration: {
    type: Number,
    default: 5000,
    validator: (value) => value >= 0,
  },
  pauseOnHover: { type: Boolean, default: true },
  position: {
    type: String,
    default: "top-right",
    validator: (value) =>
      ["top-right", "top-left", "bottom-right", "bottom-left"].includes(value),
  },
});

const open = defineModel("open", { type: Boolean, default: false });
const emit = defineEmits<{ close: [] }>();
const slots = useSlots();
const generatedId = useId();
const titleId = `toast-title-${generatedId}`;
const descriptionId = `toast-description-${generatedId}`;
const timer = ref<ReturnType<typeof setTimeout> | null>(null);
const remainingDuration = ref(props.duration);
const startedAt = ref(0);

const defaultIcons = {
  success: "circleCheck",
  info: "info",
  warning: "alertTriangle",
  danger: "circleX",
};
const resolvedIcon = computed(() => props.icon || defaultIcons[props.tone]);
const hasBody = computed(
  () => Boolean(props.description) || Boolean(slots.default),
);
const ariaRole = computed(() =>
  props.tone === "danger" || props.tone === "warning" ? "alert" : "status",
);

function clearTimer() {
  if (timer.value) clearTimeout(timer.value);
  timer.value = null;
}

function closeToast() {
  clearTimer();
  if (!open.value) return;
  open.value = false;
  emit("close");
}

function scheduleClose() {
  clearTimer();
  if (!open.value || props.duration <= 0 || remainingDuration.value <= 0)
    return;
  startedAt.value = Date.now();
  timer.value = setTimeout(closeToast, remainingDuration.value);
}

function pauseTimer() {
  if (!timer.value) return;
  remainingDuration.value = Math.max(
    0,
    remainingDuration.value - (Date.now() - startedAt.value),
  );
  clearTimer();
}

function resumeTimer() {
  scheduleClose();
}

watch(
  () => open.value,
  (isOpen) => {
    if (!isOpen) {
      clearTimer();
      return;
    }
    remainingDuration.value = props.duration;
    scheduleClose();
  },
  { immediate: true },
);

watch(
  () => props.duration,
  (duration) => {
    if (open.value) {
      remainingDuration.value = duration;
      scheduleClose();
    }
  },
);

onBeforeUnmount(clearTimer);
</script>

<template>
  <Teleport to="body">
    <Transition name="base-toast">
      <article
        v-if="open"
        class="base-toast"
        :class="[
          `base-toast--${tone}`,
          `base-toast--${position}`,
          { 'base-toast--no-title': !title },
        ]"
        :role="ariaRole"
        aria-atomic="true"
        :aria-live="ariaRole === 'alert' ? 'assertive' : 'polite'"
        :aria-labelledby="title ? titleId : undefined"
        :aria-describedby="hasBody ? descriptionId : undefined"
        @mouseenter="pauseOnHover && pauseTimer()"
        @mouseleave="pauseOnHover && resumeTimer()"
        @keydown.esc="closeToast"
      >
        <div class="base-toast__icon" aria-hidden="true">
          <slot name="icon">
            <BaseIcon :name="resolvedIcon" size="md" decorative />
          </slot>
        </div>
        <div class="base-toast__content">
          <p v-if="title" :id="titleId" class="base-toast__title">
            {{ title }}
          </p>
          <p
            v-if="description"
            :id="descriptionId"
            class="base-toast__description"
          >
            {{ description }}
          </p>
          <div
            v-if="$slots.default"
            :id="description ? undefined : descriptionId"
            class="base-toast__body"
          >
            <slot />
          </div>
        </div>
        <button
          v-if="dismissible"
          class="base-toast__close"
          type="button"
          :aria-label="closeLabel"
          @click="closeToast"
        >
          <BaseIcon name="close" size="sm" decorative />
        </button>
      </article>
    </Transition>
  </Teleport>
</template>

<style scoped>
.base-toast {
  --toast-background: var(--bs-alert-info-background);
  --toast-border: var(--bs-alert-info-border);
  --toast-accent: var(--bs-alert-info-border);
  --toast-text: var(--bs-alert-info-text);

  position: fixed;
  z-index: var(--layer-toast);
  display: flex;
  width: min(calc(100vw - var(--space-8)), 26rem);
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  border: var(--border-width-thin) solid var(--toast-border);
  border-radius: var(--radius-md);
  color: var(--toast-text);
  background: var(--bs-color-surface-muted);
  opacity: 1;
  box-shadow: var(--shadow-md);
}

.base-toast--success {
  --toast-background: var(--bs-color-state-success-surface);
  --toast-border: var(--bs-color-state-success);
  --toast-accent: var(--bs-color-state-success);
  --toast-text: var(--bs-color-state-success);
}

.base-toast--info {
  --toast-background: var(--bs-alert-info-background);
  --toast-border: var(--bs-alert-info-border);
  --toast-accent: var(--bs-alert-info-border);
}

.base-toast--warning {
  --toast-background: var(--bs-alert-warning-background);
  --toast-border: var(--bs-alert-warning-border);
  --toast-accent: var(--bs-alert-warning-border);
  --toast-text: var(--bs-alert-warning-text);
}

.base-toast--danger {
  --toast-background: var(--bs-alert-danger-background);
  --toast-border: var(--bs-alert-danger-border);
  --toast-accent: var(--bs-alert-danger-border);
  --toast-text: var(--bs-alert-danger-text);
}

.base-toast--top-right {
  top: var(--space-4);
  right: var(--space-4);
}

.base-toast--top-left {
  top: var(--space-4);
  left: var(--space-4);
}

.base-toast--bottom-right {
  right: var(--space-4);
  bottom: var(--space-4);
}

.base-toast--bottom-left {
  bottom: var(--space-4);
  left: var(--space-4);
}

.base-toast__icon {
  display: inline-flex;
  align-self: center;
  flex: 0 0 auto;
  color: var(--toast-accent);
}

.base-toast__content {
  min-width: 0;
  flex: 1;
}

.base-toast__title,
.base-toast__description,
.base-toast__body {
  margin: 0;
  color: inherit;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-base);
}

.base-toast__title {
  font-weight: var(--font-weight-semibold);
}

.base-toast__description,
.base-toast__body {
  margin-top: var(--space-2);
}

.base-toast--no-title .base-toast__description,
.base-toast--no-title .base-toast__body:only-child {
  margin-top: var(--space-0);
}

.base-toast--no-title {
  align-items: center;
}

.base-toast--no-title .base-toast__close {
  margin-top: var(--space-0);
}

.base-toast__close {
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

.base-toast__close:hover {
  background: var(--bs-alert-close-hover-background);
}

.base-toast__close:focus-visible {
  outline: var(--focus-outline-width) solid var(--bs-color-focus-ring);
  outline-offset: var(--focus-outline-offset);
}

.base-toast-enter-active,
.base-toast-leave-active {
  transition:
    opacity var(--transition-fast),
    transform var(--transition-fast);
}

.base-toast-enter-from,
.base-toast-leave-to {
  opacity: 0;
  transform: translateY(calc(var(--space-2) * -1));
}

@media (max-width: 35.9375rem) {
  .base-toast {
    width: calc(100vw - var(--space-4));
  }

  .base-toast--top-right,
  .base-toast--top-left {
    top: var(--space-2);
  }

  .base-toast--bottom-right,
  .base-toast--bottom-left {
    bottom: var(--space-2);
  }

  .base-toast--top-right,
  .base-toast--bottom-right {
    right: var(--space-2);
  }

  .base-toast--top-left,
  .base-toast--bottom-left {
    left: var(--space-2);
  }
}

@media (prefers-reduced-motion: reduce) {
  .base-toast-enter-active,
  .base-toast-leave-active {
    transition: none;
  }
}
</style>
