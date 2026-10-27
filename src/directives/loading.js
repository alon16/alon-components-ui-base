const loadingState = Symbol('loadingState')

function setLoadingState(el, isLoading) {
  const state = el[loadingState]
  if (!state) return

  state.overlay.hidden = !isLoading
  el.setAttribute('aria-busy', String(Boolean(isLoading)))
}

export const loading = {
  mounted(el, binding) {
    const previousPosition = el.style.position
    const computedPosition = window.getComputedStyle(el).position

    if (computedPosition === 'static') el.style.position = 'relative'

    const overlay = document.createElement('div')
    overlay.className = 'v-loading-overlay'
    overlay.setAttribute('role', 'status')
    overlay.setAttribute('aria-label', 'Cargando')
    overlay.innerHTML = '<span class="v-loading-overlay__spinner" aria-hidden="true"></span>'
    el.appendChild(overlay)

    el[loadingState] = { overlay, previousPosition }
    setLoadingState(el, binding.value)
  },

  updated(el, binding) {
    setLoadingState(el, binding.value)
  },

  unmounted(el) {
    const state = el[loadingState]
    if (!state) return

    state.overlay.remove()
    el.style.position = state.previousPosition
    el.removeAttribute('aria-busy')
    delete el[loadingState]
  },
}
