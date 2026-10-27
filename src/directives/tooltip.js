let tooltipId = 0;

const tooltipState = Symbol("tooltipState");

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function createTooltipElement() {
  const element = document.createElement("span");
  element.className = "v-tooltip__content";
  element.setAttribute("role", "tooltip");
  element.id = `tooltip-${++tooltipId}`;
  return element;
}

function positionTooltip(el, state) {
  if (!state.tooltip || state.tooltip.hidden) return;

  const hostRect = el.getBoundingClientRect();
  const tooltipRect = state.tooltip.getBoundingClientRect();
  const viewportPadding = 8;
  const halfWidth = tooltipRect.width / 2;
  const left = Math.min(
    Math.max(hostRect.left + hostRect.width / 2, halfWidth + viewportPadding),
    window.innerWidth - halfWidth - viewportPadding,
  );
  const top = Math.max(
    hostRect.top - tooltipRect.height - viewportPadding,
    viewportPadding,
  );

  state.tooltip.style.left = `${left}px`;
  state.tooltip.style.top = `${top}px`;
}

function updateDescribedBy(el, state) {
  const describedBy = state.originalDescribedBy
    ? `${state.originalDescribedBy} ${state.tooltip.id}`
    : state.tooltip.id;

  el.setAttribute("aria-describedby", describedBy);
}

function removeTooltip(el, state) {
  state.tooltip?.classList.remove("v-tooltip-visible");
  state.tooltip?.remove();
  state.tooltip = undefined;

  if (state.originalDescribedBy)
    el.setAttribute("aria-describedby", state.originalDescribedBy);
  else el.removeAttribute("aria-describedby");
}

function setTooltipText(el, state, value) {
  const text = normalizeText(value);

  if (!text) {
    removeTooltip(el, state);
    return;
  }

  if (!state.tooltip) state.tooltip = createTooltipElement();

  state.tooltip.textContent = text;
  state.tooltip.hidden = true;
  state.tooltip.setAttribute("aria-hidden", "true");
  updateDescribedBy(el, state);

  if (!state.tooltip.isConnected) document.body.appendChild(state.tooltip);
}

function showTooltip(el) {
  const state = el[tooltipState];
  if (!state?.tooltip) return;

  state.tooltip.hidden = false;
  state.tooltip.setAttribute("aria-hidden", "false");
  state.tooltip.classList.add("v-tooltip-visible");
  positionTooltip(el, state);
}

function hideTooltip(el) {
  const state = el[tooltipState];
  if (!state?.tooltip) return;

  state.tooltip.hidden = true;
  state.tooltip.setAttribute("aria-hidden", "true");
  state.tooltip.classList.remove("v-tooltip-visible");
}

export const tooltip = {
  mounted(el, binding) {
    const state = {
      originalDescribedBy: el.getAttribute("aria-describedby"),
      tooltip: undefined,
      show: () => showTooltip(el),
      hide: () => hideTooltip(el),
      reposition: () => positionTooltip(el, state),
    };

    el.addEventListener("mouseenter", state.show);
    el.addEventListener("mouseleave", state.hide);
    el.addEventListener("focusin", state.show);
    el.addEventListener("focusout", state.hide);
    window.addEventListener("resize", state.reposition);
    window.addEventListener("scroll", state.reposition, true);
    el[tooltipState] = state;

    setTooltipText(el, state, binding.value);
  },

  updated(el, binding) {
    const state = el[tooltipState];
    if (!state || binding.value === binding.oldValue) return;

    setTooltipText(el, state, binding.value);
  },

  unmounted(el) {
    const state = el[tooltipState];
    if (!state) return;

    el.removeEventListener("mouseenter", state.show);
    el.removeEventListener("mouseleave", state.hide);
    el.removeEventListener("focusin", state.show);
    el.removeEventListener("focusout", state.hide);
    window.removeEventListener("resize", state.reposition);
    window.removeEventListener("scroll", state.reposition, true);
    removeTooltip(el, state);
    delete el[tooltipState];
  },
};
