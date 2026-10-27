<script setup lang="ts">
import { BaseFieldInfo, BaseText } from "../../../src/index";
</script>

<template>
  <BaseText as="span" variant="label" weight="semibold">
    Información contextual
  </BaseText>
  <BaseFieldInfo
    text="Este tooltip se abre con hover y también con el teclado."
    type="primary"
    aria-label="Más información sobre el ejemplo"
  />
</template>
