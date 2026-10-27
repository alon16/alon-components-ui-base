<script setup lang="ts">
import {
  BaseFormColumns,
  BaseFormSection,
  BaseInput,
} from "../../../src/index";
</script>

<template>
  <BaseFormColumns>
    <BaseFormSection title="Sección izquierda" stretch>
      <BaseInput label="Campo principal" model-value="Valor de ejemplo" />
    </BaseFormSection>
    <BaseFormSection title="Sección derecha" stretch>
      <BaseInput label="Campo secundario" model-value="Otro valor" />
      <BaseInput label="Campo adicional" model-value="Más información" />
    </BaseFormSection>
  </BaseFormColumns>
</template>
