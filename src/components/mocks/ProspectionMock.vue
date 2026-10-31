<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { prefersReducedMotion } from '../../store'

const props = defineProps({ active: Boolean })

// Trois vagues de 50 prospects : on analyse le site, puis on envoie le message.
const waves = [
  { label: 'Vague 1', when: 'Lundi' },
  { label: 'Vague 2', when: 'Mercredi' },
  { label: 'Vague 3', when: 'Samedi' }
]
const step = ref(0) // nombre de points traités au total (0..150)
const phase = ref('Analyse des sites')
let timer = 0

function run() {
  clearInterval(timer)
  if (prefersReducedMotion()) { step.value = 150; phase.value = 'Messages envoyés'; return }
  step.value = 0
  timer = setInterval(() => {
    step.value += 2
    phase.value = step.value % 50 < 30 ? 'Analyse des sites' : 'Envoi des messages'
    if (step.value >= 150) {
      step.value = 150
      phase.value = 'Messages envoyés'
      clearInterval(timer)
    }
  }, 45)
}
watch(() => props.active, (v) => { if (v) run() }, { immediate: true })
onBeforeUnmount(() => clearInterval(timer))

const state = (w, i) => {
  const idx = w * 50 + i
  if (idx < step.value - 10) return 'sent'
  if (idx < step.value) return 'scan'
  return ''
}
</script>

<template>
  <div class="mock" :class="{ on: active }" aria-hidden="true">
    <div class="panel">
      <div class="top">
        <span class="phase"><i></i>{{ phase }}</span>
        <span class="num">{{ step }} / 150</span>
      </div>
      <div class="waves">
        <div v-for="(w, wi) in waves" :key="w.label" class="wave">
          <div class="w-head"><b>{{ w.label }}</b><span>{{ w.when }}</span></div>
          <div class="grid">
            <span v-for="i in 50" :key="i" class="pt" :class="state(wi, i - 1)"></span>
          </div>
        </div>
      </div>
      <div class="legend">
        <span><i class="l-scan"></i>Site analysé</span>
        <span><i class="l-sent"></i>Message envoyé</span>
      </div>
    </div>

    <div class="chat">
      <div class="c-head"><span class="av">A</span><div><b>Atelier Kemo</b><small>WhatsApp</small></div></div>
      <div class="bubble">
        Bonjour, votre site met plus de 6 secondes à s’afficher sur téléphone et le bouton de contact ne fonctionne pas.
        <span class="b2">Je peux corriger ces deux points cette semaine. Voulez-vous voir comment ?</span>
        <small class="time">09:14 ✓✓</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mock { position: relative; padding-bottom: 80px; }
.panel {
  background: var(--night-2); border: 1px solid rgba(201, 206, 230, .16);
  border-radius: 16px; padding: 18px;
}
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-size: 13px; }
.phase { display: inline-flex; align-items: center; gap: 8px; color: var(--chalk); font-weight: 600; }
.phase i { width: 8px; height: 8px; border-radius: 50%; background: var(--bead); animation: blink 1s infinite; }
@keyframes blink { 50% { opacity: .3; } }
.num { font-variant-numeric: tabular-nums; color: var(--mist-dim); }
.waves { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.w-head { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px; color: var(--mist); }
.w-head b { color: var(--chalk); }
.grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 4px; }
.pt { aspect-ratio: 1; border-radius: 3px; background: rgba(201, 206, 230, .12); transition: background .25s, transform .25s; }
.pt.scan { background: var(--bead); transform: scale(1.15); }
.pt.sent { background: var(--wa); }
.legend { display: flex; gap: 18px; margin-top: 14px; font-size: 12px; color: var(--mist-dim); }
.legend span { display: inline-flex; align-items: center; gap: 6px; }
.legend i { width: 9px; height: 9px; border-radius: 2px; }
.l-scan { background: var(--bead); }
.l-sent { background: var(--wa); }

.chat {
  position: absolute; right: -8px; bottom: 0;
  width: min(300px, 78%);
  background: #ECE5DD; color: #111B21;
  border-radius: 14px; overflow: hidden;
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, .6);
  transform: translateY(30px); opacity: 0;
  transition: transform 1s var(--ease-out) 1.6s, opacity .6s 1.6s;
}
.on .chat { transform: translateY(0) rotate(-2deg); opacity: 1; }
.c-head { display: flex; align-items: center; gap: 10px; padding: 9px 12px; background: #075E54; color: #fff; font-size: 13px; }
.c-head small { display: block; font-size: 10px; opacity: .8; }
.av { width: 28px; height: 28px; border-radius: 50%; background: #128C7E; display: grid; place-items: center; font-weight: 700; }
.bubble { margin: 10px 12px 12px auto; max-width: 92%; background: #DCF8C6; padding: 8px 10px 4px; border-radius: 9px 0 9px 9px; font-size: 12.5px; line-height: 1.4; }
.b2 { display: block; margin-top: 6px; }
.time { display: block; text-align: right; font-size: 10px; color: #667781; }

@media (max-width: 600px) {
  .waves { grid-template-columns: 1fr; }
  .chat { position: relative; right: auto; margin: 16px 0 0 auto; }
  .mock { padding-bottom: 0; }
}
</style>
