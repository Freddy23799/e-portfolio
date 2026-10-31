<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { profile } from '../data/profile'
import { app, prefersReducedMotion } from '../store'
import { useRaf, clamp, easeOutCubic, easeOutBack } from '../composables/useRaf'

// L'ouverture du site est un montage : chaque élément du titre est un « clip »
// sur une piste, et la tête de lecture peut être déplacée pour rejouer l'animation.
const DURATION = 3600 // ms
const FPS = 25

const t = ref(0)
const playing = ref(false)
const dragging = ref(false)
const trackArea = ref(null)

const tracks = [
  { id: 'nom', label: 'Nom', from: 0, to: 0.42 },
  { id: 'role', label: 'Rôle', from: 0.3, to: 0.62 },
  { id: 'outils', label: 'Outils', from: 0.5, to: 0.84 },
  { id: 'lieu', label: 'Lieu', from: 0.68, to: 1 }
]
const local = (id) => {
  const tr = tracks.find((x) => x.id === id)
  return clamp((t.value - tr.from) / (tr.to - tr.from))
}

// --- Nom, lettre par lettre ---
const letters = profile.firstName.split('')
const letterStyle = (i) => {
  const L = local('nom')
  const p = easeOutCubic(clamp((L - i * 0.07) / 0.62))
  return {
    transform: `translate3d(0, ${(1 - p) * 105}%, 0)`,
    fontVariationSettings: `'wdth' ${62 + 63 * p}, 'wght' ${220 + 580 * p}`
  }
}

// --- Rôle ---
const roleStyle = computed(() => {
  const p = easeOutCubic(local('role'))
  return { clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }
})

// --- Outils ---
const chipStyle = (j) => {
  const L = local('outils')
  const raw = clamp((L - j * 0.13) / 0.45)
  const p = easeOutBack(raw)
  return {
    opacity: clamp(raw * 2.5),
    transform: `translate3d(0, ${(1 - p) * 24}px, 0) scale(${0.85 + 0.15 * p})`
  }
}

// --- Lieu ---
const lieuP = computed(() => easeOutCubic(local('lieu')))

// --- Lecture ---
const timecode = computed(() => {
  const frames = Math.round(t.value * (DURATION / 1000) * FPS)
  const s = Math.floor(frames / FPS)
  const f = frames % FPS
  return `00:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`
})
const totalFrames = Math.round((DURATION / 1000) * FPS)

useRaf((dt) => {
  if (!playing.value || dragging.value) return
  t.value = Math.min(1, t.value + dt / DURATION)
  if (t.value >= 1) playing.value = false
})

function play() {
  if (t.value >= 1) t.value = 0
  playing.value = true
}
function togglePlay() {
  if (playing.value) playing.value = false
  else play()
}

watch(() => app.loaded, (v) => {
  if (!v) return
  if (prefersReducedMotion()) { t.value = 1; return }
  t.value = 0
  play()
})
onMounted(() => { if (app.loaded) t.value = 1 })

// --- Tête de lecture déplaçable ---
function setFromPointer(e) {
  const r = trackArea.value.getBoundingClientRect()
  t.value = clamp((e.clientX - r.left) / r.width)
}
function onDown(e) {
  dragging.value = true
  playing.value = false
  trackArea.value.setPointerCapture(e.pointerId)
  setFromPointer(e)
}
function onMove(e) { if (dragging.value) setFromPointer(e) }
function onUp() { dragging.value = false }
function onKey(e) {
  const step = 1 / totalFrames
  if (e.key === 'ArrowRight') t.value = clamp(t.value + (e.shiftKey ? step * 10 : step))
  else if (e.key === 'ArrowLeft') t.value = clamp(t.value - (e.shiftKey ? step * 10 : step))
  else if (e.key === 'Home') t.value = 0
  else if (e.key === 'End') t.value = 1
  else if (e.key === ' ' || e.key === 'Enter') togglePlay()
  else return
  playing.value = e.key === ' ' || e.key === 'Enter' ? playing.value : false
  e.preventDefault()
}

const ticks = Array.from({ length: 37 }, (_, i) => ({ i, major: i % 10 === 0, x: (i / 36) * 100 }))
const isActive = (tr) => t.value >= tr.from && t.value <= tr.to
</script>

<template>
  <section id="accueil" class="hero" aria-label="Présentation">
    <div class="stage wrap">
      <h1 class="name" :aria-label="profile.fullName">
        <span v-for="(l, i) in letters" :key="i" class="mask" aria-hidden="true">
          <span class="letter" :style="letterStyle(i)">{{ l }}</span>
        </span>
      </h1>

      <p class="role" :style="roleStyle">{{ profile.role }}</p>

      <div class="foot">
        <ul class="chips" aria-label="Outils principaux">
          <li v-for="(s, j) in profile.heroStack" :key="s" class="chip" :style="chipStyle(j)">{{ s }}</li>
        </ul>
        <div class="lieu" :style="{ opacity: lieuP }">
          <span class="line" :style="{ transform: `scaleX(${lieuP})` }"></span>
          <span class="dot" aria-hidden="true"></span>
          <span>{{ profile.location }}. {{ profile.availability }}.</span>
        </div>
      </div>
    </div>

    <div class="editor" aria-label="Montage de l’animation d’ouverture">
      <div class="wrap editor-inner">
        <div class="toolbar">
          <button class="play" type="button" @click="togglePlay" :aria-label="playing ? 'Mettre en pause' : 'Lire l’animation'">
            <svg v-if="playing" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            <svg v-else-if="t >= 1" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5a7 7 0 1 1-6.6 4.7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" /><path d="M4 4v6h6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" /></svg>
          </button>
          <span class="tc" aria-hidden="true">{{ timecode }}</span>
          <span class="hint">Faites glisser la tête de lecture pour rejouer l’ouverture.</span>
        </div>

        <div class="timeline">
          <div class="labels" aria-hidden="true">
            <span class="ruler-spacer"></span>
            <span v-for="tr in tracks" :key="tr.id" class="lab" :class="{ on: isActive(tr) }">{{ tr.label }}</span>
          </div>

          <div
            ref="trackArea"
            class="area"
            role="slider"
            tabindex="0"
            aria-label="Position de la tête de lecture"
            aria-valuemin="0"
            :aria-valuemax="totalFrames"
            :aria-valuenow="Math.round(t * totalFrames)"
            :aria-valuetext="timecode"
            @pointerdown="onDown"
            @pointermove="onMove"
            @pointerup="onUp"
            @pointercancel="onUp"
            @keydown="onKey"
          >
            <div class="ruler" aria-hidden="true">
              <span v-for="k in ticks" :key="k.i" class="tick" :class="{ major: k.major }" :style="{ left: k.x + '%' }"></span>
              <span class="sec" style="left:0%">0 s</span>
              <span class="sec" :style="{ left: (1000 / DURATION) * 100 + '%' }">1 s</span>
              <span class="sec" :style="{ left: (2000 / DURATION) * 100 + '%' }">2 s</span>
              <span class="sec" :style="{ left: (3000 / DURATION) * 100 + '%' }">3 s</span>
            </div>
            <div v-for="tr in tracks" :key="tr.id" class="lane" aria-hidden="true">
              <div
                class="clip"
                :class="{ on: isActive(tr), done: t > tr.to }"
                :style="{ left: tr.from * 100 + '%', width: (tr.to - tr.from) * 100 + '%' }"
              >
                <span class="fill" :style="{ transform: `scaleX(${local(tr.id)})` }"></span>
                <span class="kf kf-a"></span>
                <span class="kf kf-b"></span>
              </div>
            </div>
            <div class="head" :class="{ grab: dragging }" :style="{ left: t * 100 + '%' }" aria-hidden="true">
              <span class="head-knob"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100svh;
  display: grid;
  grid-template-rows: 1fr auto;
  padding-top: var(--nav-h);
  background: var(--chalk);
  overflow: hidden;
}
.stage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: clamp(24px, 5vh, 64px);
  padding-bottom: clamp(24px, 5vh, 56px);
}

.name {
  margin: 0;
  font-size: clamp(4.5rem, 17.5vw, 18rem);
  line-height: .86;
  letter-spacing: -0.035em;
  color: var(--indigo);
  white-space: nowrap;
}
.mask {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  padding: 0 .01em .04em;
  margin: 0 -.01em;
}
.letter { display: inline-block; will-change: transform; }

.role {
  margin: clamp(18px, 3vh, 32px) 0 0;
  max-width: 34ch;
  font-size: clamp(1.25rem, 2.4vw, 2rem);
  line-height: 1.22;
  font-weight: 500;
  font-variation-settings: 'wdth' 92;
}

.foot {
  margin-top: clamp(24px, 4vh, 44px);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 18px 32px;
}
.chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.chip {
  padding: .35em .9em;
  border: 1.5px solid var(--indigo);
  border-radius: 999px;
  font-size: var(--t-0);
  font-weight: 600;
  color: var(--indigo);
  will-change: transform;
}
.chip:last-child { background: var(--indigo); color: var(--chalk); }

.lieu { display: flex; align-items: center; gap: 10px; font-weight: 500; position: relative; padding-top: 10px; }
.lieu .line {
  position: absolute; top: 0; left: 0; right: 0; height: 1.5px;
  background: var(--night); transform-origin: left;
}
.lieu .dot {
  width: 9px; height: 9px; border-radius: 50%;
  background: var(--wa);
  box-shadow: 0 0 0 0 rgba(37, 211, 102, .6);
  animation: ping 2.2s infinite;
}
@keyframes ping { 70% { box-shadow: 0 0 0 9px rgba(37, 211, 102, 0); } 100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); } }

/* --- Panneau de montage --- */
.editor { background: var(--night); color: var(--mist); padding: 14px 0 18px; }
.toolbar { display: flex; align-items: center; gap: 14px; margin-bottom: 10px; }
.play {
  width: 36px; height: 36px; border-radius: 50%;
  border: 0; background: var(--bead); color: var(--night);
  display: grid; place-items: center; cursor: pointer;
  transition: transform .25s var(--ease-out);
}
.play:hover { transform: scale(1.08); }
.play svg { width: 18px; height: 18px; fill: currentColor; }
.tc { font-variant-numeric: tabular-nums; font-weight: 600; color: var(--chalk); letter-spacing: .02em; }
.hint { font-size: var(--t-0); color: var(--mist-dim); }

.timeline { display: grid; grid-template-columns: 74px 1fr; }
.labels { display: grid; grid-template-rows: 22px repeat(4, 26px); font-size: var(--t-0); }
.lab { align-self: center; color: var(--mist-dim); transition: color .2s; }
.lab.on { color: var(--bead); }

.area {
  position: relative;
  display: grid;
  grid-template-rows: 22px repeat(4, 26px);
  cursor: ew-resize;
  touch-action: pan-y;
  border-radius: 6px;
}
.ruler { position: relative; border-bottom: 1px solid rgba(201, 206, 230, .18); }
.tick { position: absolute; bottom: 0; width: 1px; height: 5px; background: rgba(201, 206, 230, .35); }
.tick.major { height: 10px; background: rgba(201, 206, 230, .7); }
.sec { position: absolute; top: 0; transform: translateX(4px); font-size: 11px; color: var(--mist-dim); }

.lane { position: relative; border-bottom: 1px solid rgba(201, 206, 230, .07); }
.clip {
  position: absolute; top: 5px; bottom: 5px;
  border-radius: 4px;
  background: var(--night-2);
  border: 1px solid rgba(201, 206, 230, .22);
  overflow: visible;
  transition: border-color .2s;
}
.clip .fill {
  position: absolute; inset: 0; border-radius: 3px;
  background: var(--indigo);
  transform-origin: left;
}
.clip.on { border-color: var(--bead); }
.clip.done .fill { background: #2C3A93; }
.kf {
  position: absolute; top: 50%; width: 8px; height: 8px;
  background: var(--chalk);
  transform: translate(-50%, -50%) rotate(45deg);
  z-index: 1;
}
.kf-a { left: 0; }
.kf-b { left: 100%; }
.clip.on .kf, .clip.done .kf { background: var(--bead); }

.head { position: absolute; top: 0; bottom: -4px; width: 2px; margin-left: -1px; background: var(--bead); pointer-events: none; z-index: 2; }
.head-knob {
  position: absolute; top: -3px; left: 50%;
  width: 14px; height: 14px; background: var(--bead);
  transform: translateX(-50%) rotate(45deg);
  border-radius: 2px;
  transition: transform .2s var(--ease-out);
}
.head.grab .head-knob { transform: translateX(-50%) rotate(45deg) scale(1.3); }

@media (max-width: 700px) {
  .hint { display: none; }
  .timeline { grid-template-columns: 54px 1fr; }
  .foot { flex-direction: column; align-items: flex-start; }
}
</style>
