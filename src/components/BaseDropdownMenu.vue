<script setup>
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useId,
  watch,
} from "vue";

import BaseIcon from "./BaseIcon.vue";
import { tooltip as vTooltip } from "../directives/tooltip";

const props = defineProps({
  icon: {
    type: String,
    default: "moreVertical",
  },
  groups: {
    type: Array,
    default: () => [],
    validator: (groups) =>
      groups.every(
        (group) =>
          Array.isArray(group) &&
          group.every(
            (item) =>
              item &&
              typeof item === "object" &&
              typeof item.label === "string" &&
              typeof item.event === "string" &&
              (!item.color ||
                ["default", "danger", "success", "info"].includes(item.color)),
          ),
      ),
  },
});

const emit = defineEmits(["select"]);

const root = ref(null);
const trigger = ref(null);
const menu = ref(null);
const itemRefs = ref([]);
const isOpen = ref(false);
const activeIndex = ref(0);
const menuId = `dropdown-menu-${useId()}`;
const menuStyle = ref({});

const normalizedGroups = computed(() =>
  props.groups
    .map((group, groupIndex) =>
      group.map((item, itemIndex) => ({ item, groupIndex, itemIndex })),
    )
    .filter((group) => group.length),
);
const menuItems = computed(() => normalizedGroups.value.flat());
const menuItemCount = computed(() => menuItems.value.length);

watch(isOpen, (open) => {
  if (!open) return;

  activeIndex.value = Math.min(
    activeIndex.value,
    Math.max(menuItemCount.value - 1, 0),
  );
  nextTick(() => {
    updateMenuPosition();
    focusItem(activeIndex.value);
  });
});

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
  window.addEventListener("resize", handleViewportChange);
  window.addEventListener("scroll", handleViewportChange, true);
});

onUnmounted(() => {
  document.removeEventListener("click", handleDocumentClick);
  window.removeEventListener("resize", handleViewportChange);
  window.removeEventListener("scroll", handleViewportChange, true);
});

function setItemRef(element, index) {
  if (element) itemRefs.value[index] = element;
}

function focusItem(index) {
  itemRefs.value[index]?.focus();
}

function openMenu() {
  if (!menuItemCount.value) return;
  isOpen.value = true;
}

function closeMenu(restoreFocus = false) {
  isOpen.value = false;
  menuStyle.value = {};
  if (restoreFocus) nextTick(() => trigger.value?.focus());
}

function toggleMenu() {
  if (isOpen.value) closeMenu();
  else openMenu();
}

function selectItem(item, groupIndex, itemIndex) {
  if (item.disabled) return;

  emit("select", { item, groupIndex, itemIndex });
  closeMenu(true);
}

function handleDocumentClick(event) {
  if (
    isOpen.value &&
    !root.value?.contains(event.target) &&
    !menu.value?.contains(event.target)
  ) {
    closeMenu();
  }
}

function handleViewportChange() {
  if (isOpen.value) updateMenuPosition();
}

function updateMenuPosition() {
  const triggerRect = trigger.value?.getBoundingClientRect();
  if (!triggerRect || !menu.value) return;

  const viewportPadding = 8;
  const menuHeight = menu.value.offsetHeight;
  const spaceBelow = window.innerHeight - triggerRect.bottom - viewportPadding;
  const shouldOpenAbove =
    spaceBelow < menuHeight && triggerRect.top >= menuHeight + viewportPadding;
  const top = shouldOpenAbove
    ? triggerRect.top - menuHeight - viewportPadding
    : triggerRect.bottom + viewportPadding;

  menuStyle.value = {
    top: `${Math.max(viewportPadding, top)}px`,
    right: `${Math.max(viewportPadding, window.innerWidth - triggerRect.right)}px`,
  };
}

function handleTriggerKeydown(event) {
  if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (!isOpen.value) openMenu();
    else focusItem(activeIndex.value);
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (!isOpen.value) {
      activeIndex.value = menuItemCount.value - 1;
      openMenu();
    }
  }
}

function handleMenuKeydown(event) {
  if (event.key === "Escape") {
    event.preventDefault();
    closeMenu(true);
    return;
  }

  if (event.key === "Tab") {
    closeMenu();
    return;
  }

  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    activeIndex.value =
      (activeIndex.value + direction + menuItemCount.value) %
      menuItemCount.value;
    focusItem(activeIndex.value);
    return;
  }

  if (event.key === "Home" || event.key === "End") {
    event.preventDefault();
    activeIndex.value = event.key === "Home" ? 0 : menuItemCount.value - 1;
    focusItem(activeIndex.value);
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    const item = menuItems.value[activeIndex.value];
    if (item) selectItem(item.item, item.groupIndex, item.itemIndex);
  }
}
</script>

<template>
  <div ref="root" class="base-dropdown-menu">
    <button
      ref="trigger"
      class="base-dropdown-menu__trigger"
      type="button"
      :aria-controls="menuId"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
      aria-label="Abrir menú de acciones"
      @click="toggleMenu"
      @keydown="handleTriggerKeydown"
    >
      <BaseIcon :name="icon" decorative />
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="menu"
        :id="menuId"
        class="base-dropdown-menu__content"
        :style="menuStyle"
        role="menu"
        tabindex="-1"
        @keydown="handleMenuKeydown"
      >
        <template
          v-for="(group, groupIndex) in normalizedGroups"
          :key="`group-${groupIndex}`"
        >
          <div
            v-for="({ item, itemIndex }, groupItemIndex) in group"
            :key="`${groupIndex}-${groupItemIndex}-${item.event}`"
            :ref="
              (element) =>
                setItemRef(element, menuItems.indexOf(group[groupItemIndex]))
            "
            class="base-dropdown-menu__item"
            :class="`base-dropdown-menu__item--${item.color || 'default'}`"
            role="menuitem"
            :aria-disabled="item.disabled || undefined"
            :tabindex="
              menuItems.indexOf(group[groupItemIndex]) === activeIndex ? 0 : -1
            "
            v-tooltip="item.tooltip || undefined"
            @click="selectItem(item, groupIndex, itemIndex)"
            @focus="activeIndex = menuItems.indexOf(group[groupItemIndex])"
          >
            {{ item.label }}
          </div>

          <div
            v-if="groupIndex < normalizedGroups.length - 1"
            class="base-dropdown-menu__separator"
            role="separator"
          />
        </template>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.base-dropdown-menu {
  position: relative;
  display: inline-flex;
}

.base-dropdown-menu__trigger {
  display: inline-flex;
  min-width: var(--control-height-sm);
  height: var(--control-height-sm);
  align-items: center;
  justify-content: center;
  padding-inline: var(--space-2);
  border: var(--border-width-thin) solid transparent;
  border-radius: var(--radius-md);
  color: var(--ui-color-text-heading);
  background: var(--ui-control-background);
  cursor: pointer;
  transition:
    border-color var(--transition-fast),
    background-color var(--transition-fast);
}

.base-dropdown-menu__trigger:hover,
.base-dropdown-menu__trigger[aria-expanded="true"] {
  color: var(--ui-color-brand-primary);
  background: var(--ui-color-surface-subtle);
}

.base-dropdown-menu__trigger:focus-visible {
  outline: var(--focus-outline-width) solid var(--ui-color-focus-ring);
  outline-offset: var(--focus-outline-offset);
}

.base-dropdown-menu__content {
  position: fixed;
  z-index: var(--layer-dropdown, 70);
  min-width: 12rem;
  padding: var(--space-1);
  border: var(--border-width-thin) solid var(--ui-control-border);
  border-radius: var(--radius-md);
  background: var(--ui-overlay-background);
  box-shadow: var(--shadow-md);
}

.base-dropdown-menu__item {
  display: flex;
  min-height: var(--control-height-sm);
  align-items: center;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  color: var(--ui-color-text-body);
  font-size: var(--font-size-sm);
  cursor: pointer;
  outline: none;
}

.base-dropdown-menu__item:hover,
.base-dropdown-menu__item:focus-visible {
  background: var(--ui-color-surface-subtle);
}

.base-dropdown-menu__item[aria-disabled="true"] {
  color: var(--ui-color-text-muted);
  cursor: not-allowed;
  opacity: var(--opacity-disabled);
}

.base-dropdown-menu__item--danger {
  color: var(--ui-color-state-error);
}

.base-dropdown-menu__item--success {
  color: var(--ui-color-state-success);
}

.base-dropdown-menu__item--info {
  color: var(--ui-color-status-info-text);
}

.base-dropdown-menu__separator {
  height: var(--border-width-thin);
  margin: var(--space-1) var(--space-2);
  background: var(--ui-color-border-default);
}
</style>
