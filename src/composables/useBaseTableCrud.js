import { ref, toRaw, watch } from "vue";

export function useBaseTableCrud(props, emit, resolveValue, resolveRowKey) {
  const adding = ref(props.addable);
  const editingRowKey = ref(null);
  const addDraftRow = ref({});
  const addErrors = ref({});
  const editDraftRow = ref({});
  const originalEditingRow = ref(null);

  watch(
    () => props.addable,
    (value) => {
      adding.value = value;
      if (value) {
        addDraftRow.value = {};
        addErrors.value = {};
      }
    },
  );

  function startAdd() {
    if (props.loading || !props.addable || adding.value) return;

    adding.value = true;
    editingRowKey.value = null;
    addDraftRow.value = {};
    addErrors.value = {};
    emit("add-start");
  }

  function cancelAdd() {
    adding.value = props.addable;
    addDraftRow.value = {};
    addErrors.value = {};
    emit("add-cancel");
  }

  function saveAdd() {
    const errors = validateAdd();
    addErrors.value = errors;

    if (Object.keys(errors).length) {
      emit("add-invalid", errors);
      return;
    }

    emit("add", addDraftRow.value, resetAddRow);
  }

  function resetAddRow() {
    addDraftRow.value = {};
    addErrors.value = {};
  }

  function validateAdd() {
    return Object.fromEntries(
      props.columns
        .filter((column) => column.required)
        .map((column) => [
          column.key,
          isEmptyValue(resolveValue(addDraftRow.value, column))
            ? column.requiredMessage || `${column.label} es obligatorio.`
            : null,
        ])
        .filter(([, error]) => error),
    );
  }

  function startEdit(row, index) {
    if (props.loading || !props.editable) return;

    originalEditingRow.value = row;
    editDraftRow.value = cloneRow(row);
    editingRowKey.value = resolveRowKey(row, index);
    emit("edit-start", row);
  }

  function cancelEdit() {
    editingRowKey.value = null;
    editDraftRow.value = {};
    originalEditingRow.value = null;
    adding.value = props.addable;
    emit("edit-cancel");
  }

  function saveEdit() {
    emit("edit", editDraftRow.value, cancelEdit);
  }

  function deleteRow(row) {
    if (props.loading || !props.deletable) return;
    emit("delete", row);
  }

  function isEditing(row, index) {
    return (
      editingRowKey.value !== null &&
      editingRowKey.value === resolveRowKey(row, index)
    );
  }

  return {
    addDraftRow,
    addErrors,
    adding,
    cancelAdd,
    cancelEdit,
    deleteRow,
    editDraftRow,
    editingRowKey,
    isEditing,
    originalEditingRow,
    resetAddRow,
    saveAdd,
    saveEdit,
    startAdd,
    startEdit,
  };
}

function isEmptyValue(value) {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

function cloneRow(row) {
  const rawRow = toRaw(row);

  if (typeof structuredClone === "function") {
    try {
      return structuredClone(rawRow);
    } catch {
      // Algunas filas pueden contener proxies reactivos anidados.
    }
  }

  return JSON.parse(JSON.stringify(rawRow));
}
