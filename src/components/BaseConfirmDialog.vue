<script setup lang="ts">
import BaseButton from "./BaseButton.vue";
import BaseDialog from "./BaseDialog.vue";

const props = defineProps({
  open: Boolean,
  title: { type: String, required: true },
  description: { type: String, required: true },
  confirmLabel: { type: String, default: "Confirmar" },
  cancelLabel: { type: String, default: "Cancelar" },
  buttonSize: {
    type: String,
    default: "sm",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
  loading: Boolean,
  tone: {
    type: String,
    default: "danger",
    validator: (value) => ["danger", "primary"].includes(value),
  },
});

const emit = defineEmits(["close", "confirm"]);

function confirm() {
  if (!props.loading) emit("confirm");
}
</script>

<template>
  <BaseDialog
    :open="open"
    :title="title"
    :description="description"
    close-label="Cerrar confirmación"
    :close-disabled="loading"
    form
    @close="emit('close')"
    @submit="confirm"
  >
    <template #actions>
      <BaseButton
        variant="outline"
        :size="buttonSize"
        :disabled="loading"
        autofocus
        @click="emit('close')"
      >
        {{ cancelLabel }}
      </BaseButton>
      <BaseButton
        type="submit"
        :size="buttonSize"
        :variant="tone"
        :loading="loading"
      >
        {{ confirmLabel }}
      </BaseButton>
    </template>
  </BaseDialog>
</template>
