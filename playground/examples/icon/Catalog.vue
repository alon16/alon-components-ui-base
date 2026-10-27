<script setup lang="ts">
import { BaseIcon } from "../../../src/index";

const iconNames = [
  "logo",
  "menu",
  "moreVertical",
  "settings",
  "close",
  "search",
  "clipboard",
  "copy",
  "printer",
  "send",
  "support",
  "building",
  "home",
  "map",
  "arrowLeft",
  "arrowRight",
  "download",
  "plus",
  "trash",
  "facebook",
  "twitter",
  "loader",
  "chevronDown",
  "chevronLeft",
  "chevronRight",
  "sort",
  "check",
  "location",
  "weight",
  "edit",
  "grid",
  "list",
  "shield",
  "user",
  "circleUser",
  "bolt",
  "clock",
  "package",
  "truck",
  "circleCheck",
  "circleX",
  "alertTriangle",
  "calendar",
  "tag",
  "info",
  "lock",
  "eye",
  "eyeOff",
  "help",
  "receipt",
  "piggyBank",
  "camera",
  "monitor",
  "smartphone",
  "card",
  "cart",
  "bank",
  "bell",
  "mail",
  "message",
];
</script>

<template>
  <ul class="icon-catalog">
    <li
      v-for="iconName in iconNames"
      :key="iconName"
      class="icon-catalog__item"
    >
      <BaseIcon :name="iconName" size="lg" decorative />
      <code>{{ iconName }}</code>
    </li>
  </ul>
</template>

<style scoped>
.icon-catalog {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: var(--space-2);
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.icon-catalog__item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  color: var(--ui-color-text-body);
  border: var(--border-width-thin) solid var(--ui-color-border-default);
  border-radius: var(--radius-sm);
}

.icon-catalog__item code {
  overflow-wrap: anywhere;
  font-size: var(--font-size-xs);
}
</style>
