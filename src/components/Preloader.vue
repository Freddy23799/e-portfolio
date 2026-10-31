<script setup>
import { ref, onMounted } from 'vue'
import NdopBand from './NdopBand.vue'
import { app, prefersReducedMotion } from '../store'
import { profile } from '../data/profile'

const count = ref(0)
const leaving = ref(false)
const gone = ref(false)

onMounted(async () => {
  document.body.classList.add('is-loading')
  if (prefersReducedMotion()) return finish(true)

  const minTime = 1500
  const start = performance.now()
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve()
  let fontsDone = false
  fonts.then(() => { fontsDone = true })

  const tick = (now) => {
    const elapsed = now - start
    // Le compteur ralentit vers 90 tant que les polices ne sont pas prêtes.
    const target = fontsDone ? 100 : 90
    const p = Math.min(1, elapsed / minTime)
    count.value = Math.round(Math.min(target, p * 100))
    if (count.value >= 100) return finish(false)
    if (elapsed > 6000) return finish(false) // sécurité réseau lent
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})

function finish(instant) {
  count.value = 100
  leaving.value = true
  document.body.classList.remove('is-loading')
  setTimeout(() => { app.loaded = true }, instant ? 0 : 350)
  setTimeout(() => { gone.value = true }, instant ? 0 : 1100)
}
</script>

<template>
  <div v-if="!gone" class="loader" :class="{ 'loader--out': leaving }" role="status" aria-live="polite">
    <div class="band"><NdopBand :tiles="24" draw bg="transparent" /></div>
    <div class="meta">
      <span class="name">{{ profile.firstName }}</span>
      <span class="count" aria-label="Chargement">{{ String(count).padStart(3, '0') }}</span>
    </div>
  </div>
</template>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--indigo);
  color: var(--chalk);
  display: grid;
  align-content: center;
  gap: 28px;
  transition: clip-path 1s var(--ease-out);
  clip-path: inset(0 0 0 0);
}
.loader--out { clip-path: inset(0 0 100% 0); }
.band { height: 80px; opacity: .9; }
.meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0 var(--gutter);
}
.name { font-weight: 700; font-variation-settings: 'wdth' 125; font-size: var(--t-3); }
.count {
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 200;
  font-variation-settings: 'wdth' 62;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
</style>
