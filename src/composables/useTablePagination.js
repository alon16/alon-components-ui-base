import { computed, ref, watch } from "vue";

export function useTablePagination(props, emit, normalizedColumns, resolveValue) {
  const sortState = ref(props.sort);

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(props.totalItems / props.pageSize)),
  );
  const currentPage = computed(() =>
    Math.min(Math.max(props.page, 1), totalPages.value),
  );
  const rowOffset = computed(() => (currentPage.value - 1) * props.pageSize);
  const sortedRows = computed(() => {
    if (props.paginationMode === "remote" || !sortState.value?.key)
      return props.rows;

    const column = normalizedColumns.value.find(
      (item) => item.key === sortState.value.key,
    );
    if (!column) return props.rows;

    return [...props.rows].sort((firstRow, secondRow) => {
      const result = compareValues(
        resolveValue(firstRow, column),
        resolveValue(secondRow, column),
      );
      return sortState.value.direction === "desc" ? -result : result;
    });
  });
  const visibleRows = computed(() => {
    if (props.paginationMode === "remote") return props.rows;
    return sortedRows.value.slice(
      rowOffset.value,
      rowOffset.value + props.pageSize,
    );
  });
  const visibleCount = computed(() => visibleRows.value.length);
  const summaryStart = computed(() =>
    props.totalItems && visibleCount.value ? rowOffset.value + 1 : 0,
  );
  const summaryEnd = computed(() =>
    visibleCount.value
      ? Math.min(summaryStart.value + visibleCount.value - 1, props.totalItems)
      : 0,
  );
  const paginationItems = computed(() => createPaginationItems(currentPage.value, totalPages.value));

  watch(
    [() => props.page, totalPages, () => props.loading],
    () => {
      if (!props.loading && props.page !== currentPage.value)
        emitPageChange(currentPage.value);
    },
    { immediate: true },
  );

  watch(
    () => props.sort,
    (value) => {
      sortState.value = value;
    },
  );

  function emitPageChange(page) {
    emit("update:page", page);
    emit("page-change", { page, pageSize: props.pageSize });
  }

  function goToPage(page) {
    const nextPage = Math.min(Math.max(page, 1), totalPages.value);
    if (props.loading || nextPage === currentPage.value) return;
    emitPageChange(nextPage);
  }

  function sortDirection(column) {
    if (sortState.value?.key !== column.key) return "none";
    return sortState.value.direction === "desc" ? "descending" : "ascending";
  }

  function sortLabel(column) {
    const direction = sortDirection(column);
    if (direction === "ascending") return `Orden descendente por ${column.label}`;
    if (direction === "descending") return `Quitar orden por ${column.label}`;
    return `Ordenar por ${column.label}`;
  }

  function toggleSort(column) {
    if (props.loading || !column.sortable) return;

    const nextSort =
      sortState.value?.key !== column.key
        ? { key: column.key, direction: "asc" }
        : sortState.value.direction === "asc"
          ? { key: column.key, direction: "desc" }
          : null;

    sortState.value = nextSort;
    emit("update:sort", nextSort);
    emit("sort-change", nextSort);
  }

  return {
    currentPage,
    goToPage,
    paginationItems,
    rowOffset,
    sortDirection,
    sortLabel,
    summaryEnd,
    summaryStart,
    totalPages,
    visibleCount,
    visibleRows,
  };
}

function compareValues(firstValue, secondValue) {
  const firstEmpty = firstValue === null || firstValue === undefined || firstValue === "";
  const secondEmpty = secondValue === null || secondValue === undefined || secondValue === "";

  if (firstEmpty && secondEmpty) return 0;
  if (firstEmpty) return 1;
  if (secondEmpty) return -1;
  if (typeof firstValue === "number" && typeof secondValue === "number") {
    return firstValue - secondValue;
  }

  return String(firstValue).localeCompare(String(secondValue), "es", {
    numeric: true,
    sensitivity: "base",
  });
}

function createPaginationItems(currentPage, lastPage) {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, index) => ({
      type: "page",
      key: `page-${index + 1}`,
      page: index + 1,
    }));
  }

  const pages = new Set([
    1,
    lastPage,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  if (currentPage <= 4) [2, 3, 4].forEach((page) => pages.add(page));
  if (currentPage >= lastPage - 3) {
    [lastPage - 3, lastPage - 2, lastPage - 1].forEach((page) =>
      pages.add(page),
    );
  }

  const validPages = [...pages]
    .filter((page) => page >= 1 && page <= lastPage)
    .sort((a, b) => a - b);
  const items = [];

  validPages.forEach((page, index) => {
    const previousPage = validPages[index - 1];
    if (previousPage && page - previousPage > 1) {
      items.push({ type: "ellipsis", key: `ellipsis-${previousPage}-${page}` });
    }
    items.push({ type: "page", key: `page-${page}`, page });
  });

  return items;
}
