<script setup lang="ts">
import { type PropType } from "vue";
import type { BaseBreadcrumbItem } from "../public-types";
import BaseText from "./BaseText.vue";

const props = defineProps({
  value: {
    type: Array as PropType<readonly BaseBreadcrumbItem[]>,
    required: true,
  },
  divider: { type: String, default: "/" },
  size: {
    type: String,
    default: "sm",
    validator: (value) => ["sm", "md", "label", "xl"].includes(value),
  },
  weight: {
    type: String,
    default: "regular",
    validator: (value) =>
      ["regular", "medium", "semibold", "bold"].includes(value),
  },
  ariaLabel: { type: String, default: "Ruta de navegación" },
});
</script>

<template>
  <nav class="base-breadcrumb" :aria-label="ariaLabel">
    <ol class="base-breadcrumb__list">
      <li
        v-for="(item, index) in value"
        :key="`${index}-${item.name}`"
        class="base-breadcrumb__item"
      >
        <RouterLink
          v-if="index < value.length - 1 && item.to"
          class="base-breadcrumb__link"
          :to="item.to"
        >
          <BaseText
            as="span"
            :variant="props.size"
            color="inherit"
            :weight="props.weight"
          >
            {{ item.name }}
          </BaseText>
        </RouterLink>

        <BaseText
          v-else
          as="span"
          class="base-breadcrumb__current"
          :variant="props.size"
          :weight="props.weight"
          :color="index === value.length - 1 ? 'body' : 'muted'"
          :aria-current="index === value.length - 1 ? 'page' : undefined"
        >
          {{ item.name }}
        </BaseText>

        <BaseText
          v-if="index < value.length - 1"
          as="span"
          class="base-breadcrumb__divider"
          :variant="props.size"
          :weight="props.weight"
          color="muted"
          aria-hidden="true"
        >
          {{ divider }}
        </BaseText>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.base-breadcrumb {
  min-width: 0;
}

.base-breadcrumb__list {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--bs-breadcrumb-gap-block) var(--bs-breadcrumb-gap-inline);
  padding: 0;
  margin: 0;
  list-style: none;
}

.base-breadcrumb__item {
  display: inline-flex;
  min-width: 0;
  align-items: baseline;
  gap: var(--bs-breadcrumb-gap-inline);
}

.base-breadcrumb__link {
  min-width: 0;
  color: var(--bs-color-brand-primary);
  text-decoration: none;
  cursor: pointer;
  transition: color var(--bs-breadcrumb-transition);
}

.base-breadcrumb__link:hover {
  color: var(--bs-color-brand-primary-hover);
  text-decoration: underline;
  text-underline-offset: var(--bs-breadcrumb-underline-offset);
}

.base-breadcrumb__link:focus-visible {
  border-radius: var(--bs-breadcrumb-focus-radius);
  outline: var(--bs-breadcrumb-focus-width) solid var(--bs-color-focus-ring);
  outline-offset: var(--bs-breadcrumb-focus-offset);
}

.base-breadcrumb__current,
.base-breadcrumb__link,
.base-breadcrumb__divider {
  overflow-wrap: anywhere;
}

.base-breadcrumb__divider {
  user-select: none;
}
</style>
