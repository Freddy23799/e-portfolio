import { reactive } from 'vue'

// État partagé : le préchargement terminé déclenche l'animation d'ouverture.
export const app = reactive({
  loaded: false
})

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
