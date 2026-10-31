import { onMounted, onBeforeUnmount } from 'vue'

// Boucle requestAnimationFrame liée au cycle de vie du composant.
export function useRaf(callback) {
  let id = 0
  let last = 0
  const loop = (now) => {
    const dt = last ? Math.min(64, now - last) : 16
    last = now
    callback(dt, now)
    id = requestAnimationFrame(loop)
  }
  onMounted(() => { id = requestAnimationFrame(loop) })
  onBeforeUnmount(() => cancelAnimationFrame(id))
}

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const lerp = (a, b, t) => a + (b - a) * t
export const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3)
export const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
export const easeOutBack = (x) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}
