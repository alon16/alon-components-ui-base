<script setup lang="ts">
import { computed, type PropType } from "vue";
import type {
  BaseStepperChangeEvent,
  BaseStepperStep,
  BaseStepperVariant,
  StepperDescriptionPosition,
  StepperValue,
} from "../public-types";
import BaseFieldInfo from "./BaseFieldInfo.vue";
import BaseIcon from "./BaseIcon.vue";

const props = defineProps({
  modelValue: {
    type: [String, Number] as PropType<StepperValue>,
    required: true,
  },
  steps: {
    type: Array as PropType<BaseStepperStep[]>,
    required: true,
  },
  variant: {
    type: String as PropType<BaseStepperVariant>,
    default: "circles",
    validator: (value: string) =>
      ["circles", "bars", "pills", "vertical"].includes(value),
  },
  navigable: {
    type: Boolean,
    default: false,
  },
  showStepDescriptions: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    default: "",
  },
  descriptionPosition: {
    type: String as PropType<StepperDescriptionPosition>,
    default: "top",
    validator: (value: string) => ["top", "bottom"].includes(value),
  },
  ariaLabel: {
    type: String,
    default: "Progreso",
  },
  stepDescriptionAriaLabel: {
    type: String,
    default: "Información adicional",
  },
});

const emit = defineEmits<{
  "update:modelValue": [value: StepperValue];
  "step-change": [payload: BaseStepperChangeEvent];
}>();

const currentIndex = computed(() =>
  props.steps.findIndex((step) => step.value === props.modelValue),
);

function statusFor(index: number) {
  if (currentIndex.value < 0) return "pending";
  if (index < currentIndex.value) return "completed";
  if (index === currentIndex.value) return "current";
  return "pending";
}

function selectStep(step: BaseStepperStep, index: number) {
  if (!props.navigable || step.disabled || step.value === props.modelValue)
    return;

  const payload: BaseStepperChangeEvent = {
    value: step.value,
    previousValue: props.modelValue,
    step,
    index,
  };

  emit("update:modelValue", step.value);
  emit("step-change", payload);
}

function descriptionAriaLabel(step: BaseStepperStep) {
  return `${props.stepDescriptionAriaLabel}: ${step.label}`;
}
</script>

<template>
  <nav
    class="base-stepper"
    :class="`base-stepper--${variant}`"
    :aria-label="ariaLabel"
  >
    <p
      v-if="description && descriptionPosition === 'top'"
      class="base-stepper__description"
    >
      {{ description }}
    </p>

    <div class="base-stepper__viewport">
      <ol
        class="base-stepper__list"
        :style="{ '--base-stepper-count': Math.max(steps.length, 1) }"
      >
        <li
          v-for="(step, index) in steps"
          :key="`${typeof step.value}-${step.value}`"
          class="base-stepper__item"
          :class="[
            `base-stepper__item--${statusFor(index)}`,
            { 'base-stepper__item--disabled': step.disabled },
          ]"
          :aria-current="statusFor(index) === 'current' ? 'step' : undefined"
          :aria-disabled="step.disabled ? 'true' : undefined"
        >
          <button
            v-if="navigable"
            type="button"
            class="base-stepper__step"
            :disabled="step.disabled"
            @click="selectStep(step, index)"
          >
            <span class="base-stepper__indicator" aria-hidden="true">
              <BaseIcon
                v-if="statusFor(index) === 'completed'"
                name="check"
                size="sm"
                decorative
              />
              <span v-else>{{ index + 1 }}</span>
            </span>
            <span class="base-stepper__content">
              <span class="base-stepper__label">{{ step.label }}</span>
              <span
                v-if="showStepDescriptions && step.description"
                class="base-stepper__step-description"
              >
                {{ step.description }}
              </span>
            </span>
          </button>

          <div v-else class="base-stepper__step">
            <span class="base-stepper__indicator" aria-hidden="true">
              <BaseIcon
                v-if="statusFor(index) === 'completed'"
                name="check"
                size="sm"
                decorative
              />
              <span v-else>{{ index + 1 }}</span>
            </span>
            <span class="base-stepper__content">
              <span class="base-stepper__label">{{ step.label }}</span>
              <span
                v-if="showStepDescriptions && step.description"
                class="base-stepper__step-description"
              >
                {{ step.description }}
              </span>
            </span>
          </div>

          <BaseFieldInfo
            v-if="!showStepDescriptions && step.description"
            class="base-stepper__info"
            :text="step.description"
            :type="statusFor(index) === 'completed' ? 'success' : ''"
            :aria-label="descriptionAriaLabel(step)"
          />
        </li>
      </ol>
    </div>

    <p
      v-if="description && descriptionPosition === 'bottom'"
      class="base-stepper__description base-stepper__description--bottom"
    >
      {{ description }}
    </p>
  </nav>
</template>

<style scoped>
.base-stepper {
  width: 100%;
  color: var(--bs-color-text-body);
}

.base-stepper__description {
  margin: var(--space-0) var(--space-0) var(--space-4);
  color: var(--bs-color-text-muted);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-base);
}

.base-stepper__description--bottom {
  margin-block: var(--space-4) var(--space-0);
}

.base-stepper__viewport {
  width: 100%;
  overflow-x: auto;
  scrollbar-width: thin;
}

.base-stepper__list {
  display: grid;
  grid-template-columns: repeat(var(--base-stepper-count), minmax(8rem, 1fr));
  min-width: max-content;
  padding: var(--space-0);
  margin: var(--space-0);
  list-style: none;
}

.base-stepper__item {
  --base-stepper-state-color: var(--bs-color-text-muted);
  --base-stepper-state-border: var(--bs-color-border-default);
  --base-stepper-state-surface: var(--bs-color-surface-page);

  position: relative;
  min-width: 0;
  color: var(--base-stepper-state-color);
}

.base-stepper__item--current {
  --base-stepper-state-color: var(--bs-color-text-heading);
  --base-stepper-state-border: var(--bs-color-brand-primary);
  --base-stepper-state-surface: var(--bs-color-brand-primary);
}

.base-stepper__item--completed {
  --base-stepper-state-color: var(--bs-color-state-success);
  --base-stepper-state-border: var(--bs-color-state-success);
  --base-stepper-state-surface: var(--bs-color-state-success-surface);
}

.base-stepper__item--disabled {
  opacity: var(--opacity-disabled);
}

.base-stepper__step {
  position: relative;
  z-index: 1;
  display: flex;
  min-width: 0;
  padding: var(--space-0);
  border: var(--space-0);
  color: inherit;
  background: transparent;
  font: inherit;
  text-align: inherit;
}

button.base-stepper__step:not(:disabled) {
  cursor: pointer;
}

button.base-stepper__step:not(:disabled):hover .base-stepper__indicator {
  transform: translateY(calc(var(--space-1) * -1));
}

.base-stepper__item--pending
  button.base-stepper__step:not(:disabled):hover
  .base-stepper__indicator {
  border-color: var(--bs-color-border-strong);
}

.base-stepper__item--current
  button.base-stepper__step:not(:disabled):hover
  .base-stepper__indicator {
  background: var(--bs-color-brand-primary-hover);
}

button.base-stepper__step:focus-visible {
  outline: var(--focus-outline-width) solid var(--bs-color-focus-ring);
  outline-offset: var(--focus-outline-offset);
  border-radius: var(--radius-sm);
}

.base-stepper__indicator {
  display: inline-flex;
  width: var(--space-8);
  height: var(--space-8);
  flex: 0 0 var(--space-8);
  align-items: center;
  justify-content: center;
  border: var(--border-width-accent) solid var(--base-stepper-state-border);
  border-radius: var(--radius-round);
  color: var(--base-stepper-state-color);
  background: var(--base-stepper-state-surface);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  transition:
    color var(--transition-fast),
    border-color var(--transition-fast),
    background-color var(--transition-fast),
    transform var(--transition-fast);
}

.base-stepper__item--current .base-stepper__indicator {
  color: var(--bs-color-text-on-primary);
}

.base-stepper__content {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-1);
}

.base-stepper__label {
  color: inherit;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-heading);
}

.base-stepper__item--current .base-stepper__label {
  font-weight: var(--font-weight-bold);
}

.base-stepper__step-description {
  color: var(--bs-color-text-muted);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-base);
}

.base-stepper__info {
  position: relative;
  z-index: 2;
}

/* Círculos conectados, variante pensada para flujos de checkout. */
.base-stepper--circles .base-stepper__item {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: auto auto;
  justify-items: center;
  padding-inline: var(--space-3);
  text-align: center;
}

.base-stepper--circles .base-stepper__item:not(:last-child)::after {
  position: absolute;
  z-index: 0;
  top: calc(var(--space-8) / 2);
  left: calc(50% + var(--space-5));
  width: calc(100% - var(--space-10));
  height: var(--border-width-accent);
  background: var(--bs-color-border-default);
  content: "";
}

.base-stepper--circles .base-stepper__item--completed:not(:last-child)::after {
  background: var(--bs-color-state-success);
}

.base-stepper--circles .base-stepper__step {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.base-stepper--circles .base-stepper__info {
  grid-column: 3;
  grid-row: 2;
  align-self: start;
  margin-top: var(--space-2);
}

/* Barras superiores, variante inspirada en el wizard de devoluciones. */
.base-stepper--bars .base-stepper__item {
  display: grid;
  grid-template-columns: 1fr auto;
  padding: var(--space-3) var(--space-3) var(--space-0);
  border-top: var(--border-width-accent) solid var(--base-stepper-state-border);
}

.base-stepper--bars .base-stepper__step {
  align-items: center;
  gap: var(--space-2);
}

.base-stepper--bars .base-stepper__indicator {
  width: var(--space-6);
  height: var(--space-6);
  flex-basis: var(--space-6);
}

.base-stepper--bars .base-stepper__info {
  align-self: center;
}

/* Segmentos redondeados para flujos con navegación frecuente. */
.base-stepper--pills .base-stepper__list {
  gap: var(--space-2);
}

.base-stepper--pills .base-stepper__item {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  border: var(--border-width-thin) solid var(--base-stepper-state-border);
  border-radius: var(--radius-round);
  background: var(--base-stepper-state-surface);
}

.base-stepper--pills .base-stepper__step {
  width: 100%;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
}

.base-stepper--pills .base-stepper__indicator {
  width: var(--space-6);
  height: var(--space-6);
  flex-basis: var(--space-6);
  background: var(--bs-color-surface-page);
}

.base-stepper--pills .base-stepper__item--current .base-stepper__indicator {
  background: var(--bs-color-brand-primary);
}

.base-stepper--pills .base-stepper__info {
  margin-right: var(--space-3);
}

/* Línea de tiempo vertical. */
.base-stepper--vertical .base-stepper__viewport {
  overflow: visible;
}

.base-stepper--vertical .base-stepper__list {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.base-stepper--vertical .base-stepper__item {
  display: grid;
  grid-template-columns: 1fr auto;
  min-height: var(--space-12);
  padding-bottom: var(--space-4);
}

.base-stepper--vertical .base-stepper__item:not(:last-child)::after {
  position: absolute;
  z-index: 0;
  top: var(--space-8);
  bottom: var(--space-0);
  left: calc(var(--space-8) / 2 - var(--border-width-thin));
  width: var(--border-width-accent);
  background: var(--bs-color-border-default);
  content: "";
}

.base-stepper--vertical .base-stepper__item--completed:not(:last-child)::after {
  background: var(--bs-color-state-success);
}

.base-stepper--vertical .base-stepper__step {
  align-items: flex-start;
  gap: var(--space-3);
}

.base-stepper--vertical .base-stepper__content {
  padding-top: var(--space-1);
  text-align: left;
}

.base-stepper--vertical .base-stepper__info {
  align-self: start;
  margin: var(--space-2) var(--space-1) var(--space-0) var(--space-2);
}
</style>
