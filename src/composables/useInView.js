import { ref, onMounted, onBeforeUnmount } from 'vue'

// Indique si un élément est visible à l'écran (reste vrai une fois vu si `once`).
export function useInView(target, { threshold = 0.25, once = false } = {}) {
  const inView = ref(false)
  let observer

  onMounted(() => {
    if (!target.value) return
    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        inView.value = true
        if (once) observer.disconnect()
      } else if (!once) {
        inView.value = false
      }
    }, { threshold })
    observer.observe(target.value)
  })

  onBeforeUnmount(() => observer && observer.disconnect())

  return inView
}
