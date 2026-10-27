<script setup lang="ts">
import { computed } from "vue";

// Convierte los fragmentos entre comillas invertidas en <code>.
const props = defineProps<{ text: string }>();

const parts = computed(() => props.text.split("`"));
</script>

<template>
  <span>
    <template v-for="(part, index) in parts" :key="index">
      <code v-if="index % 2">{{ part }}</code>
      <template v-else>{{ part }}</template>
    </template>
  </span>
</template>
