<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import BaseButton from "./BaseButton.vue";
import BaseIcon from "./BaseIcon.vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  id: { type: String, default: "signature" },
  label: { type: String, default: "Firma" },
  help: { type: String, default: "" },
  error: { type: String, default: "" },
  clearAriaLabel: { type: String, default: "Limpiar firma" },
  drawingInstructions: {
    type: String,
    default: "Dibuje con puntero táctil, lápiz o ratón.",
  },
  width: { type: Number, default: 250 },
  height: { type: Number, default: 100 },
  required: Boolean,
  disabled: Boolean,
});

const signature = defineModel({ type: String, default: null });
const canvas = ref(null);
const isDrawing = ref(false);
const hasSignature = computed(() => Boolean(signature.value));
const message = computed(() => props.error || props.help);
const messageId = computed(() => `${props.id}-message`);
let context;

function drawGuide() {
  if (!context || !canvas.value) return;

  context.save();
  context.strokeStyle = getCanvasColor("--ui-signature-guide-color");
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(10, canvas.value.height - 15);
  context.lineTo(canvas.value.width - 10, canvas.value.height - 15);
  context.stroke();
  context.restore();
}

function resetCanvas() {
  if (!context || !canvas.value) return;

  context.clearRect(0, 0, canvas.value.width, canvas.value.height);
  context.fillStyle = getCanvasColor("--ui-signature-canvas-background");
  context.fillRect(0, 0, canvas.value.width, canvas.value.height);
  drawGuide();
}

function drawImage(value) {
  if (!context || !canvas.value || !value) return;

  const image = new Image();
  image.onload = () => {
    resetCanvas();
    context.drawImage(image, 0, 0, canvas.value.width, canvas.value.height);
    drawGuide();
  };
  image.src = value;
}

function syncCanvas(value) {
  if (!context) return;
  resetCanvas();
  if (value) drawImage(value);
}

function getCanvasPosition(event) {
  const rect = canvas.value.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.value.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.value.height,
  };
}

function getCanvasColor(token) {
  return (
    getComputedStyle(canvas.value).getPropertyValue(token).trim() ||
    "transparent"
  );
}

function startDrawing(event) {
  if (props.disabled || !context) return;

  isDrawing.value = true;
  canvas.value.setPointerCapture?.(event.pointerId);
  const position = getCanvasPosition(event);
  context.beginPath();
  context.moveTo(position.x, position.y);
}

function draw(event) {
  if (!isDrawing.value || !context) return;

  const position = getCanvasPosition(event);
  context.lineTo(position.x, position.y);
  context.stroke();
}

function stopDrawing(event) {
  if (!isDrawing.value) return;

  isDrawing.value = false;
  if (canvas.value.hasPointerCapture?.(event.pointerId)) {
    canvas.value.releasePointerCapture(event.pointerId);
  }
  context.closePath();
  signature.value = canvas.value.toDataURL("image/png");
}

function clear() {
  isDrawing.value = false;
  resetCanvas();
  signature.value = null;
  nextTick(() => canvas.value?.focus());
}

onMounted(() => {
  context = canvas.value.getContext("2d");
  context.lineWidth = 2;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.strokeStyle = getCanvasColor("--ui-signature-ink-color");
  resetCanvas();
  if (signature.value) drawImage(signature.value);
});

onBeforeUnmount(() => {
  context = null;
});

watch(
  () => signature.value,
  (value, previousValue) => {
    if (!context || value === previousValue || isDrawing.value) return;
    syncCanvas(value);
  },
);
</script>

<template>
  <div class="base-signature" :class="{ 'base-signature--error': error }">
    <div class="base-signature__label-row">
      <label class="base-signature__label" :for="id">
        {{ label }}<span v-if="required" aria-hidden="true"> *</span>
      </label>
    </div>
    <div class="base-signature__canvas-wrapper">
      <canvas
        :id="id"
        ref="canvas"
        class="base-signature__canvas"
        :width="width"
        :height="height"
        role="application"
        :aria-label="`${label}. ${drawingInstructions}`"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="message ? messageId : undefined"
        :tabindex="disabled ? -1 : 0"
        :aria-disabled="disabled ? 'true' : undefined"
        @pointerdown.prevent="startDrawing"
        @pointermove.prevent="draw"
        @pointerup.prevent="stopDrawing"
        @pointercancel.prevent="stopDrawing"
      ></canvas>
      <BaseButton
        v-if="hasSignature"
        class="base-signature__clear"
        variant="ghost"
        size="sm"
        type="button"
        :aria-label="clearAriaLabel"
        :disabled="disabled"
        @click="clear"
      >
        <BaseIcon name="close" size="sm" decorative />
      </BaseButton>
    </div>
    <span
      :id="messageId"
      class="base-signature__message"
      :class="{ 'base-signature__message--visible': message }"
      :aria-hidden="message ? undefined : 'true'"
      :role="error ? 'alert' : undefined"
    >
      {{ message }}
    </span>
  </div>
</template>

<style scoped>
.base-signature {
  display: grid;
  min-width: var(--space-0);
  gap: var(--ui-field-gap, var(--space-2));
}

.base-signature__label {
  color: var(--ui-color-text-body);
  font-size: var(--ui-form-label-size);
  font-weight: var(--text-label-weight);
  line-height: var(--text-label-leading);
}

.base-signature__canvas-wrapper {
  position: relative;
  width: min(100%, calc(v-bind(width) * 1px));
  max-width: 100%;
}

.base-signature__canvas {
  display: block;
  width: 100%;
  max-width: 100%;
  height: calc(v-bind(height) * 1px);
  border: var(--border-width-thin) solid var(--ui-color-border-strong);
  border-radius: var(--radius-md);
  background: var(--ui-color-surface-page);
  cursor: crosshair;
  touch-action: none;
}

.base-signature__canvas:focus-visible {
  outline: var(--focus-outline-width) solid var(--ui-color-focus-ring);
  outline-offset: var(--focus-outline-offset);
}

.base-signature__clear {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  min-width: var(--space-8);
  min-height: var(--space-8);
  padding: var(--space-1);
}

.base-signature--error .base-signature__canvas {
  border-color: var(--ui-color-state-error);
  background: var(--ui-color-state-error-surface);
}

.base-signature__message {
  min-height: var(--ui-field-message-min-height);
  color: var(--ui-color-text-muted);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-heading);
  visibility: hidden;
}

.base-signature__message--visible {
  visibility: visible;
}

.base-signature--error .base-signature__message {
  color: var(--ui-color-state-error);
}
</style>
