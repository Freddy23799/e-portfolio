<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRaf } from '../../composables/useRaf'
import { prefersReducedMotion } from '../../store'

const props = defineProps({ active: Boolean })
const canvas = ref(null)
const shown = ref(0) // nombre de bougies affichées (fractionnaire)
const reduce = prefersReducedMotion()

// Série déterministe qui rebondit entre un support et une résistance.
const SUP = 1.0820
const RES = 1.0900
const candles = (() => {
  let seed = 11
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
  const out = []
  let p = 1.0850
  let dir = 1
  for (let i = 0; i < 44; i++) {
    const o = p
    let c = o + dir * (0.0006 + rnd() * 0.0012) + (rnd() - 0.5) * 0.0008
    if (c > RES - 0.0002) { c = RES - 0.0003 - rnd() * 0.0004; dir = -1 }
    if (c < SUP + 0.0002) { c = SUP + 0.0003 + rnd() * 0.0004; dir = 1 }
    const h = Math.max(o, c) + rnd() * 0.0006
    const l = Math.min(o, c) - rnd() * 0.0006
    out.push({ o, c, h: Math.min(h, RES + 0.0004), l: Math.max(l, SUP - 0.0004) })
    p = c
  }
  return out
})()

const captions = [
  { at: 0, text: '90 % des débutants perdent.' },
  { at: 10, text: 'Le prix rebondit sur le support.' },
  { at: 20, text: 'Il bute sous la résistance.' },
  { at: 31, text: 'Achète près du support, pas au sommet.' }
]
const caption = computed(() => {
  let c = captions[0]
  for (const k of captions) if (shown.value >= k.at) c = k
  return c
})

let ctx, W = 0, H = 0, dpr = 1
function resize() {
  const el = canvas.value
  if (!el) return
  dpr = Math.min(2, window.devicePixelRatio || 1)
  W = el.clientWidth; H = el.clientHeight
  el.width = W * dpr; el.height = H * dpr
  ctx = el.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  draw()
}

function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)
  const pad = 14
  const lo = SUP - 0.0012, hi = RES + 0.0012
  const y = (v) => pad + (1 - (v - lo) / (hi - lo)) * (H - pad * 2)
  const n = candles.length
  const cw = (W - pad * 2) / n
  const visible = Math.min(n, shown.value)

  // grille
  ctx.strokeStyle = 'rgba(120, 220, 255, .07)'
  ctx.lineWidth = 1
  for (let g = 0; g < 6; g++) {
    const gy = pad + (g / 5) * (H - pad * 2)
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke()
  }

  // niveaux
  const lineP = (from) => Math.max(0, Math.min(1, (visible - from) / 6))
  const level = (v, color, label, from) => {
    const p = lineP(from)
    if (p <= 0) return
    ctx.save()
    ctx.strokeStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = 12
    ctx.lineWidth = 2
    ctx.setLineDash([6, 5])
    ctx.beginPath(); ctx.moveTo(pad, y(v)); ctx.lineTo(pad + (W - pad * 2) * p, y(v)); ctx.stroke()
    ctx.setLineDash([])
    ctx.shadowBlur = 0
    ctx.fillStyle = color
    ctx.font = '600 10px Archivo, sans-serif'
    ctx.globalAlpha = p
    ctx.fillText(label, pad + 4, y(v) + (v === SUP ? 14 : -6))
    ctx.restore()
  }
  level(SUP, '#F2B705', 'Support', 8)
  level(RES, '#FF5A6E', 'Résistance', 18)

  // bougies
  for (let i = 0; i < Math.ceil(visible); i++) {
    const k = candles[i]
    const grow = Math.min(1, visible - i)
    const up = k.c >= k.o
    const color = up ? '#3EE6C1' : '#FF5A6E'
    const x = pad + i * cw + cw / 2
    const c = k.o + (k.c - k.o) * grow
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = 8
    ctx.lineWidth = 1.2
    ctx.beginPath(); ctx.moveTo(x, y(k.h)); ctx.lineTo(x, y(k.l)); ctx.stroke()
    const top = y(Math.max(k.o, c)), bot = y(Math.min(k.o, c))
    ctx.fillRect(x - cw * 0.32, top, cw * 0.64, Math.max(1.5, bot - top))
    ctx.shadowBlur = 0
  }
}

useRaf((dt) => {
  if (!props.active || reduce) return
  if (shown.value < candles.length + 12) {
    shown.value += dt / 110
    draw()
  } else {
    shown.value = 0 // boucle
  }
})
watch(() => props.active, (v) => { if (v && !reduce) shown.value = 0 })

let ro
onMounted(() => {
  if (reduce) shown.value = candles.length
  resize()
  ro = new ResizeObserver(resize)
  ro.observe(canvas.value)
})
onBeforeUnmount(() => ro && ro.disconnect())
</script>

<template>
  <div class="mock" :class="{ on: active }" aria-hidden="true">
    <div class="phone">
      <div class="screen">
        <div class="pair"><b>EUR/USD</b><span>H1</span></div>
        <canvas ref="canvas" class="chart"></canvas>
        <transition name="cap" mode="out-in">
          <p class="cap" :key="caption.text">{{ caption.text }}</p>
        </transition>
        <div class="side">
          <span class="ic">♥</span>
          <span class="ic">✦</span>
          <span class="ic">➦</span>
        </div>
        <div class="prog"><span :style="{ transform: `scaleX(${Math.min(1, shown / (candles.length + 12))})` }"></span></div>
      </div>
    </div>
    <div class="spec">
      <div><b>9:16</b><span>Format vertical</span></div>
      <div><b>33 s</b><span>Durée</span></div>
      <div><b>-14 LUFS</b><span>Volume calibré pour TikTok</span></div>
    </div>
  </div>
</template>

<style scoped>
.mock { display: flex; align-items: center; justify-content: center; gap: clamp(20px, 4vw, 48px); flex-wrap: wrap; }
.phone {
  width: min(280px, 72vw);
  aspect-ratio: 9 / 16;
  border-radius: 34px;
  padding: 9px;
  background: #05070F;
  box-shadow: 0 40px 90px -30px rgba(0, 0, 0, .8), inset 0 0 0 1.5px #2A3060;
  transform: rotate(-4deg) translateY(30px);
  opacity: .4;
  transition: transform 1.1s var(--ease-out), opacity .8s;
}
.on .phone { transform: rotate(-2deg) translateY(0); opacity: 1; }
.screen {
  position: relative; height: 100%; border-radius: 26px; overflow: hidden;
  background: radial-gradient(120% 70% at 50% 30%, #0C2B4A 0%, #050A18 70%);
  display: flex; flex-direction: column;
}
.pair { display: flex; justify-content: space-between; padding: 22px 16px 6px; color: #BFEFFF; font-size: 12px; }
.pair b { font-weight: 800; font-variation-settings: 'wdth' 120; letter-spacing: .02em; }
.chart { flex: 1; width: 100%; min-height: 0; }
.cap {
  margin: 0 14px 34px; padding: 8px 10px;
  background: rgba(5, 10, 24, .7);
  border: 1px solid rgba(62, 230, 193, .35);
  border-radius: 10px;
  color: #fff; text-align: center;
  font-weight: 800; font-size: 15px; line-height: 1.15;
  font-variation-settings: 'wdth' 105;
}
.cap-enter-active, .cap-leave-active { transition: opacity .25s, transform .35s var(--ease-out); }
.cap-enter-from { opacity: 0; transform: translateY(10px) scale(.96); }
.cap-leave-to { opacity: 0; transform: translateY(-8px); }
.side { position: absolute; right: 10px; bottom: 96px; display: grid; gap: 12px; }
.ic { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; background: rgba(255, 255, 255, .1); color: #fff; font-size: 13px; }
.prog { position: absolute; left: 14px; right: 14px; bottom: 14px; height: 3px; background: rgba(255, 255, 255, .15); border-radius: 3px; overflow: hidden; }
.prog span { display: block; height: 100%; background: #3EE6C1; transform-origin: left; }
.spec { display: grid; gap: 16px; }
.spec div { display: grid; }
.spec b { font-size: var(--t-4); font-weight: 800; font-variation-settings: 'wdth' 120; color: var(--chalk); line-height: 1; }
.spec span { font-size: var(--t-0); color: var(--mist-dim); }
</style>
