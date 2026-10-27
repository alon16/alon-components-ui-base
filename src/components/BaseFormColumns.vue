<template>
  <div class="base-form-columns">
    <slot />
  </div>
</template>

<style scoped>
.base-form-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
  align-items: stretch;
}

@media (max-width: 62.5rem) {
  .base-form-columns {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
