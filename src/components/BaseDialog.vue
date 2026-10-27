<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useId,
  useSlots,
  watch,
} from "vue";

import BaseHeading from "./BaseHeading.vue";
import BaseIcon from "./BaseIcon.vue";
import BaseText from "./BaseText.vue";
import { loading as vLoading } from "../directives/loading";

const props = defineProps({
  open: Boolean,
  title: { type: String, required: true },
  description: { type: String, default: "" },
  size: {
    type: String,
    default: "sm",
    validator: (value) => ["sm", "md"].includes(value),
  },
  form: Boolean,
  loading: Boolean,
  closeLabel: { type: String, default: "Cerrar diálogo" },
  closeDisabled: Boolean,
});

const emit = defineEmits(["close", "submit"]);
const slots = useSlots();
const generatedId = useId();
const dialogElement = ref<HTMLDialogElement | null>(null);
const closeButton = ref<HTMLButtonElement | null>(null);
const previousFocus = ref<HTMLElement | null>(null);
const titleId = computed(() => `dialog-title-${generatedId}`);
const descriptionId = computed(() => `dialog-description-${generatedId}`);
const surfaceTag = computed(() => (props.form ? "form" : "div"));
const hasBody = computed(() => Boolean(slots.default));
const hasActions = computed(() => Boolean(slots.actions));

function focusInitialControl() {
  const initialControl =
    dialogElement.value?.querySelector<HTMLElement>("[autofocus]");
  (initialControl || closeButton.value)?.focus();
}

function focusFirstInvalid() {
  nextTick(() =>
    dialogElement.value
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus(),
  );
}

function restoreFocus() {
  nextTick(() => previousFocus.value?.focus?.());
}

function requestClose() {
  if (!props.closeDisabled) emit("close");
}

function onClose() {
  if (props.open) emit("close");
  restoreFocus();
}

function onSubmit(event: SubmitEvent) {
  if (props.form) emit("submit", event);
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      previousFocus.value = document.activeElement as HTMLElement | null;
      await nextTick();
      if (!dialogElement.value?.open) dialogElement.value?.showModal();
      await nextTick();
      focusInitialControl();
      return;
    }

    if (dialogElement.value?.open) dialogElement.value.close();
  },
  { immediate: true, flush: "post" },
);

onBeforeUnmount(() => {
  if (dialogElement.value?.open) dialogElement.value.close();
});

defineExpose({ focusFirstInvalid });
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialogElement"
      class="base-dialog"
      :class="`base-dialog--${size}`"
      :aria-labelledby="titleId"
      :aria-describedby="description ? descriptionId : undefined"
      @cancel.prevent="requestClose"
      @close="onClose"
    >
      <component
        :is="surfaceTag"
        v-loading="loading"
        class="base-dialog__surface"
        :novalidate="form || undefined"
        @submit.prevent="onSubmit"
      >
        <header class="base-dialog__header">
          <div class="base-dialog__heading">
            <BaseHeading :id="titleId" as="h2" variant="md">{{
              title
            }}</BaseHeading>
            <BaseText
              v-if="description"
              :id="descriptionId"
              variant="sm"
              color="muted"
            >
              {{ description }}
            </BaseText>
          </div>
          <button
            ref="closeButton"
            class="base-dialog__close"
            type="button"
            :disabled="closeDisabled"
            :aria-label="closeLabel"
            @click="requestClose"
          >
            <BaseIcon name="close" size="sm" decorative />
          </button>
        </header>

        <div v-if="hasBody" class="base-dialog__body"><slot /></div>

        <footer v-if="hasActions" class="base-dialog__actions">
          <slot name="actions" />
        </footer>
      </component>
    </dialog>
  </Teleport>
</template>

<style scoped>
.base-dialog {
  width: min(calc(100% - var(--space-8)), var(--base-dialog-width));
  max-height: calc(100vh - var(--space-8));
  padding: var(--space-0);
  overflow: auto;
  border: var(--border-width-thin) solid var(--bs-color-border-default);
  border-radius: var(--radius-xl);
  color: var(--bs-color-text-body);
  background: var(--bs-color-surface-page);
  box-shadow: var(--shadow-lg);
}

.base-dialog--sm {
  --base-dialog-width: var(--content-narrow);
}
.base-dialog--md {
  --base-dialog-width: var(--container-sm);
}
.base-dialog::backdrop {
  background: var(--bs-dialog-backdrop-background);
}
.base-dialog__surface {
  display: grid;
  gap: var(--space-6);
  padding: var(--card-padding);
}
.base-dialog__body {
  display: grid;
}
.base-dialog__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
}
.base-dialog__heading {
  display: grid;
  gap: var(--space-2);
}
.base-dialog__close {
  display: inline-flex;
  width: var(--control-height-sm);
  height: var(--control-height-sm);
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  padding: var(--space-0);
  border: var(--border-width-thin) solid var(--bs-color-border-default);
  border-radius: var(--radius-md);
  color: var(--bs-color-text-heading);
  background: var(--bs-color-surface-page);
  cursor: pointer;
}
.base-dialog__close:hover:not(:disabled) {
  background: var(--bs-color-surface-muted);
}
.base-dialog__close:disabled {
  cursor: not-allowed;
  opacity: var(--opacity-disabled);
}
.base-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}
@media (max-width: 35.9375rem) {
  .base-dialog__actions {
    align-items: stretch;
    flex-direction: column-reverse;
  }
}
</style>
