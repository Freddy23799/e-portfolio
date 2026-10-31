<script setup>
import { computed } from 'vue'
defineProps({ active: Boolean })

const menu = ['Tableau de bord', 'Événements', 'Devis', 'Billets', 'Prestataires', 'Relances']
const tasks = [
  { t: 'Signer le contrat du traiteur', who: 'F' },
  { t: 'Repérage photo du lieu', who: 'D' },
  { t: 'Choisir la voiture des mariés', who: 'A' },
  { t: 'Envoyer les billets aux invités', who: 'F' }
]

// QR décoratif : grille pseudo-aléatoire déterministe avec les trois repères de coin.
const N = 21
const qr = computed(() => {
  let seed = 7
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
  const cells = []
  const finder = (x, y) => {
    for (const [fx, fy] of [[0, 0], [N - 7, 0], [0, N - 7]]) {
      if (x >= fx && x < fx + 7 && y >= fy && y < fy + 7) {
        const dx = x - fx, dy = y - fy
        const ring = dx === 0 || dy === 0 || dx === 6 || dy === 6
        const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4
        return ring || core ? 1 : 0
      }
    }
    return -1
  }
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const f = finder(x, y)
    const on = f === -1 ? rnd() > 0.52 : f === 1
    if (on) cells.push({ x, y, d: (x + y) * 12 })
  }
  return cells
})
</script>

<template>
  <div class="mock" :class="{ on: active }" aria-hidden="true">
    <div class="win">
      <div class="bar"><i></i><i></i><i></i><span>wedivo / tableau de bord</span></div>
      <div class="body">
        <aside class="side">
          <div class="logo">Wedivo</div>
          <span v-for="(m, i) in menu" :key="m" class="item" :class="{ cur: i === 1 }">{{ m }}</span>
        </aside>
        <main class="main">
          <div class="head">
            <div>
              <div class="kicker">Mariage</div>
              <div class="title">Estelle et Hervé</div>
            </div>
            <span class="date">12 déc. 2026</span>
          </div>
          <div class="budget">
            <div class="row"><span>Budget engagé</span><b>68 %</b></div>
            <div class="bar2"><span class="fillb"></span></div>
          </div>
          <ul class="tasks">
            <li v-for="(k, i) in tasks" :key="k.t" :style="{ '--i': i }">
              <span class="check"><svg viewBox="0 0 16 16"><path d="M3 8.5l3 3 7-7" /></svg></span>
              <span class="tt">{{ k.t }}</span>
              <span class="who">{{ k.who }}</span>
            </li>
          </ul>
          <div class="toast"><span class="wa"></span>Relance envoyée au client, devis n° 2026-041</div>
        </main>
      </div>
    </div>

    <div class="ticket">
      <div class="t-left">
        <div class="t-k">Billet invité</div>
        <div class="t-n">Estelle &amp; Hervé</div>
        <div class="t-m">Table 7, place 3</div>
        <div class="t-ok">Valide à l’entrée</div>
      </div>
      <svg class="qr" :viewBox="`0 0 ${N} ${N}`">
        <rect v-for="(c, i) in qr" :key="i" :x="c.x" :y="c.y" width="1" height="1" :style="{ transitionDelay: c.d + 'ms' }" />
        <rect class="scan" x="0" y="0" :width="N" height="0.6" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.mock { position: relative; padding: 0 0 70px 0; }
.win {
  background: var(--chalk); color: var(--night);
  border-radius: 14px; overflow: hidden;
  box-shadow: 0 40px 80px -30px rgba(0, 0, 0, .6);
  transform: perspective(1400px) rotateY(-8deg) rotateX(3deg);
  transition: transform 1.2s var(--ease-out);
}
.on .win { transform: perspective(1400px) rotateY(-3deg) rotateX(1deg); }
.bar { display: flex; align-items: center; gap: 6px; padding: 10px 14px; background: #E2E5EF; font-size: 11px; color: #6B7199; }
.bar i { width: 9px; height: 9px; border-radius: 50%; background: #C3C8E0; }
.bar span { margin-left: 10px; }
.body { display: grid; grid-template-columns: 150px 1fr; min-height: 330px; }
.side { background: var(--indigo); color: var(--mist); padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; font-size: 12px; }
.logo { color: var(--chalk); font-weight: 800; font-variation-settings: 'wdth' 120; margin-bottom: 12px; font-size: 15px; }
.item { padding: 6px 8px; border-radius: 6px; }
.item.cur { background: rgba(243, 244, 248, .14); color: var(--chalk); }
.main { padding: 18px 20px; display: flex; flex-direction: column; gap: 14px; position: relative; }
.head { display: flex; justify-content: space-between; align-items: flex-start; }
.kicker { font-size: 11px; color: #6B7199; }
.title { font-weight: 800; font-size: 20px; font-variation-settings: 'wdth' 110; }
.date { font-size: 12px; padding: 4px 10px; border-radius: 999px; background: #E2E5EF; }
.row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; }
.bar2 { height: 8px; border-radius: 99px; background: #E2E5EF; overflow: hidden; }
.fillb { display: block; height: 100%; width: 68%; background: var(--indigo); transform: scaleX(0); transform-origin: left; transition: transform 1.4s var(--ease-out) .3s; }
.on .fillb { transform: scaleX(1); }
.tasks { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.tasks li { display: flex; align-items: center; gap: 10px; font-size: 12.5px; padding: 7px 10px; border-radius: 8px; background: #fff; border: 1px solid #E2E5EF; }
.check { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid #9AA0C6; display: grid; place-items: center; transition: background .3s, border-color .3s; transition-delay: calc(.6s + var(--i) * .35s); }
.check svg { width: 12px; fill: none; stroke: var(--chalk); stroke-width: 2.2; stroke-dasharray: 16; stroke-dashoffset: 16; transition: stroke-dashoffset .4s; transition-delay: calc(.7s + var(--i) * .35s); }
.on .tasks li:nth-child(-n+3) .check { background: var(--indigo); border-color: var(--indigo); }
.on .tasks li:nth-child(-n+3) .check svg { stroke-dashoffset: 0; }
.tt { flex: 1; }
.who { width: 22px; height: 22px; border-radius: 50%; background: var(--mist); display: grid; place-items: center; font-size: 10px; font-weight: 700; }
.toast {
  display: flex; align-items: center; gap: 8px; font-size: 12px;
  padding: 8px 12px; border-radius: 8px; background: var(--night); color: var(--chalk);
  align-self: flex-start;
  opacity: 0; transform: translateY(10px);
  transition: opacity .5s, transform .6s var(--ease-out); transition-delay: 2s;
}
.on .toast { opacity: 1; transform: none; }
.wa { width: 8px; height: 8px; border-radius: 50%; background: var(--wa); }

.ticket {
  position: absolute; right: -10px; bottom: 0;
  width: min(330px, 70%);
  display: flex; gap: 14px; align-items: center;
  background: var(--bead); color: var(--night);
  padding: 14px 16px; border-radius: 12px;
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, .55);
  transform: translateY(40px) rotate(6deg); opacity: 0;
  transition: transform 1.1s var(--ease-out) .5s, opacity .6s .5s;
  -webkit-mask: radial-gradient(circle at 0 50%, transparent 9px, #000 10px) left / 51% 100% no-repeat,
                radial-gradient(circle at 100% 50%, transparent 9px, #000 10px) right / 51% 100% no-repeat;
          mask: radial-gradient(circle at 0 50%, transparent 9px, #000 10px) left / 51% 100% no-repeat,
                radial-gradient(circle at 100% 50%, transparent 9px, #000 10px) right / 51% 100% no-repeat;
}
.on .ticket { transform: translateY(0) rotate(-3deg); opacity: 1; }
.t-left { flex: 1; }
.t-k { font-size: 11px; font-weight: 600; }
.t-n { font-weight: 800; font-variation-settings: 'wdth' 112; font-size: 17px; line-height: 1.1; }
.t-m { font-size: 12px; margin-top: 4px; }
.t-ok { margin-top: 8px; font-size: 11px; font-weight: 700; display: inline-block; padding: 2px 8px; border-radius: 99px; background: var(--night); color: var(--bead); }
.qr { width: 82px; height: 82px; background: var(--chalk); padding: 4px; border-radius: 6px; flex: none; }
.qr rect { fill: var(--night); opacity: 0; transition: opacity .2s; }
.on .qr rect { opacity: 1; }
.qr .scan { fill: var(--bead-red); opacity: 0; }
.on .qr .scan { opacity: .85; animation: scan 2.4s ease-in-out 2.2s infinite; }
@keyframes scan { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(20px); } }

@media (max-width: 600px) {
  .body { grid-template-columns: 1fr; }
  .side { display: none; }
  .win, .on .win { transform: none; }
}
</style>
