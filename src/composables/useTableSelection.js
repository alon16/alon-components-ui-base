import { computed, watch } from "vue";

export function useTableSelection(props, emit, visibleRows, resolveRowKey) {
  const selectedKeys = computed(
    () => new Set(props.selectedRows.map((row) => resolveRowKey(row))),
  );
  const visibleSelectedCount = computed(
    () => visibleRows.value.filter((row) => isRowSelected(row)).length,
  );
  const allVisibleSelected = computed(
    () =>
      visibleRows.value.length > 0 &&
      visibleSelectedCount.value === visibleRows.value.length,
  );
  const someVisibleSelected = computed(
    () => visibleSelectedCount.value > 0 && !allVisibleSelected.value,
  );
  const selectedCount = computed(() => props.selectedRows.length);

  watch(
    () => props.page,
    (value, oldValue) => {
      if (!props.clearSelectionOnPageChange || value === oldValue) return;
      updateSelection([]);
    },
  );

  function isRowSelected(row) {
    return selectedKeys.value.has(resolveRowKey(row));
  }

  function updateSelection(rows) {
    emit("update:selectedRows", rows);
    emit("selection-change", rows);
  }

  function toggleRowSelection(row, selected) {
    const rowKey = resolveRowKey(row);
    const nextSelection = props.selectedRows.filter(
      (selectedRow) => resolveRowKey(selectedRow) !== rowKey,
    );

    if (selected) nextSelection.push(row);
    updateSelection(nextSelection);
  }

  function toggleVisibleSelection(selected) {
    const visibleKeys = new Set(visibleRows.value.map((row) => resolveRowKey(row)));
    const nextSelection = props.selectedRows.filter(
      (row) => !visibleKeys.has(resolveRowKey(row)),
    );

    if (selected) nextSelection.push(...visibleRows.value);
    updateSelection(nextSelection);
  }

  return {
    allVisibleSelected,
    isRowSelected,
    selectedCount,
    someVisibleSelected,
    toggleRowSelection,
    toggleVisibleSelection,
  };
}
