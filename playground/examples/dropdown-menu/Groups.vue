<script setup lang="ts">
import { ref } from "vue";

import { BaseDropdownMenu, BaseText } from "../../../src/index";

const lastAction = ref("Selecciona una opción del menú.");

const menuGroups = [
  [
    { label: "Editar", event: "edit" },
    { label: "Duplicar", event: "duplicate", color: "info" as const },
  ],
  [
    { label: "Archivar", event: "archive", color: "success" as const },
    {
      label: "Eliminar",
      event: "delete",
      color: "danger" as const,
      tooltip: "Acción irreversible",
    },
    { label: "No disponible", event: "disabled", disabled: true },
  ],
];

function handleSelect(payload: { item: { label: string; event: string } }) {
  lastAction.value = `Seleccionado: ${payload.item.label} (${payload.item.event})`;
}
</script>

<template>
  <BaseDropdownMenu icon="menu" :groups="menuGroups" @select="handleSelect" />
  <BaseText variant="sm" color="muted" aria-live="polite">
    {{ lastAction }}
  </BaseText>
</template>
