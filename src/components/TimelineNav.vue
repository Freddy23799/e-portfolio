<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { profile } from '../data/profile'

// Navigation en forme de piste de montage : chaque section est un clip,
// la tête de lecture suit le défilement de la page.
const chapters = ref([
  { id: 'accueil', label: 'Accueil', start: 0, size: 0 },
  { id: 'travaux', label: 'Travaux', start: 0, size: 0 },
  { id: 'methode', label: 'Méthode', start: 0, size: 0 },
  { id: 'outils', label: 'Outils', start: 0, size: 0 },
  { id: 'apropos', label: 'À propos', start: 0, size: 0 },
  { id: 'contact', label: 'Contact', start: 0, size: 0 }
])
const progress = ref(0)
const scrollY = ref(0)
let total = 1
let ro

function measure() {
  const docH = document.documentElement.scrollHeight
  total = Math.max(1, docH)
  chapters.value.forEach((c) => {
    const el = document.getElementById(c.id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    c.start = top / total
    c.size = el.offsetHeight / total
  })
  onScroll()
}
function onScroll() {
  scrollY.value = window.scrollY
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0
}

const current = computed(() => {
  const y = (scrollY.value + window.innerHeight * 0.4) / total
  let cur = chapters.value[0]
  for (const c of chapters.value) if (y >= c.start) cur = c
  return cur.id
})

function go(id) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: reduce ? 'auto' : 'smooth' })
}

onMounted(() => {
  measure()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', measure)
  ro = new ResizeObserver(measure)
  ro.observe(document.body)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', measure)
  ro && ro.disconnect()
})
</script>

<template>
  <header class="nav">
    <a class="brand" href="#accueil" @click.prevent="go('accueil')" :aria-label="`${profile.firstName}, retour en haut`">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 L22 12 L12 22 L2 12 Z" /><path class="in" d="M12 8 L16 12 L12 16 L8 12 Z" /></svg>
      <span>{{ profile.firstName }}</span>
    </a>

    <nav class="track" aria-label="Sections">
      <a
        v-for="c in chapters"
        :key="c.id"
        :href="`#${c.id}`"
        class="chap"
        :class="{ on: current === c.id }"
        :style="{ left: c.start * 100 + '%', width: c.size * 100 + '%' }"
        :aria-current="current === c.id ? 'true' : undefined"
        @click.prevent="go(c.id)"
      >
        <span>{{ c.label }}</span>
      </a>
      <span class="head" :style="{ left: progress * 100 + '%' }" aria-hidden="true"></span>
    </nav>

    <a class="mail" :href="`mailto:${profile.email}`">Écrire</a>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: var(--nav-h);
  z-index: 50;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: clamp(12px, 3vw, 40px);
  padding: 0 var(--gutter);
  background: var(--night);
  color: var(--chalk);
}
.brand { display: inline-flex; align-items: center; gap: 8px; text-decoration: none; font-weight: 700; font-variation-settings: 'wdth' 120; }
.brand svg { width: 20px; height: 20px; fill: none; stroke: var(--chalk); stroke-width: 2; }
.brand .in { fill: var(--bead); stroke: none; }

.track {
  position: relative;
  height: 28px;
  border-radius: 6px;
  background: rgba(201, 206, 230, .06);
}
.chap {
  position: absolute; top: 3px; bottom: 3px;
  border-radius: 4px;
  border-left: 1px solid rgba(201, 206, 230, .25);
  padding: 0 8px;
  display: flex; align-items: center;
  text-decoration: none;
  font-size: 12px;
  color: var(--mist-dim);
  overflow: hidden;
  white-space: nowrap;
  transition: color .2s, background .2s;
}
.chap:hover { color: var(--chalk); background: rgba(201, 206, 230, .08); }
.chap.on { color: var(--chalk); background: var(--indigo); }
.head {
  position: absolute; top: -4px; bottom: -4px; width: 2px; margin-left: -1px;
  background: var(--bead); pointer-events: none;
}
.head::before {
  content: ''; position: absolute; top: -3px; left: 50%;
  width: 9px; height: 9px; background: var(--bead);
  transform: translateX(-50%) rotate(45deg);
}
.mail {
  font-weight: 600; text-decoration: none; font-size: 14px;
  padding: .45em 1em; border-radius: 999px; background: var(--bead); color: var(--night);
}

@media (max-width: 760px) {
  .chap span { opacity: 0; }
  .chap.on span { opacity: 1; }
  .brand span { display: none; }
}
</style>
