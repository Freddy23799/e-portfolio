<script setup>
import { ref } from 'vue'
import { useRaf } from '../../composables/useRaf'
import { prefersReducedMotion } from '../../store'

const props = defineProps({ active: Boolean })

const services = [
  'Événements', 'Location de matériel', 'Prestataires', 'Boutique',
  'Décoration intérieure', 'Academy', 'Talents', 'Voyages'
]
const angle = ref(0)
const hovered = ref(-1)
const reduce = prefersReducedMotion()

useRaf((dt) => {
  if (!props.active || reduce || hovered.value !== -1) return
  angle.value = (angle.value + dt * 0.006) % 360
})

const pos = (i) => {
  const a = ((i / services.length) * 360 + angle.value - 90) * Math.PI / 180
  return { x: 50 + Math.cos(a) * 40, y: 50 + Math.sin(a) * 40 }
}
</script>

<template>
  <div class="mock" :class="{ on: active }">
    <div class="orbit">
      <svg class="rings" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="40" />
        <circle cx="50" cy="50" r="26" class="r2" />
        <line
          v-for="(s, i) in services"
          :key="'l' + i"
          x1="50" y1="50"
          :x2="pos(i).x" :y2="pos(i).y"
          :class="{ hot: hovered === i }"
        />
      </svg>

      <div class="core" aria-hidden="true">
        <span class="brand">INNOVENT</span>
        <span class="amp">&amp; HOME</span>
      </div>

      <ul class="nodes" aria-label="Services de la plateforme">
        <li
          v-for="(s, i) in services"
          :key="s"
          class="node"
          :class="{ hot: hovered === i }"
          :style="{ left: pos(i).x + '%', top: pos(i).y + '%', transitionDelay: (active ? i * 80 : 0) + 'ms' }"
          tabindex="0"
          @mouseenter="hovered = i"
          @mouseleave="hovered = -1"
          @focus="hovered = i"
          @blur="hovered = -1"
        >{{ s }}</li>
      </ul>
    </div>

    <div class="phone" aria-hidden="true">
      <div class="p-top">Espace prestataire</div>
      <div class="p-card"><b>Demande reçue</b><span>Location de 120 chaises</span></div>
      <div class="p-card"><b>Devis accepté</b><span>Décoration salle</span></div>
      <div class="p-card dim"><b>Paiement</b><span>En attente</span></div>
    </div>
  </div>
</template>

<style scoped>
.mock { position: relative; }
.orbit { position: relative; width: min(520px, 100%); aspect-ratio: 1; margin: 0 auto; }
.rings { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.rings circle { fill: none; stroke: rgba(201, 206, 230, .22); stroke-width: .3; stroke-dasharray: 1 1.4; }
.rings .r2 { stroke: rgba(242, 183, 5, .35); stroke-dasharray: none; transform-origin: 50% 50%; transform: scale(.6); opacity: 0; transition: transform 1.2s var(--ease-out), opacity .8s; }
.on .rings .r2 { transform: scale(1); opacity: 1; }
.rings line { stroke: rgba(201, 206, 230, .14); stroke-width: .25; transition: stroke .2s; }
.rings line.hot { stroke: var(--bead); stroke-width: .45; }

.core {
  position: absolute; left: 50%; top: 50%;
  width: 34%; aspect-ratio: 1; border-radius: 50%;
  transform: translate(-50%, -50%) scale(.7);
  background: var(--bead); color: var(--night);
  display: grid; place-content: center; text-align: center;
  line-height: 1;
  transition: transform 1s var(--ease-out);
}
.on .core { transform: translate(-50%, -50%) scale(1); }
.brand { font-weight: 900; font-variation-settings: 'wdth' 125; font-size: clamp(14px, 2.4vw, 22px); letter-spacing: -.01em; }
.amp { font-weight: 600; font-size: clamp(10px, 1.4vw, 13px); margin-top: 4px; }

.nodes { list-style: none; margin: 0; padding: 0; }
.node {
  position: absolute;
  transform: translate(-50%, -50%) scale(.6);
  opacity: 0;
  padding: .45em .85em;
  border-radius: 999px;
  background: var(--night-2);
  border: 1px solid rgba(201, 206, 230, .25);
  color: var(--chalk);
  font-size: clamp(11px, 1.15vw, 13.5px);
  font-weight: 600;
  white-space: nowrap;
  cursor: default;
  transition: opacity .6s, transform .7s var(--ease-out), background .2s, color .2s, border-color .2s;
}
.on .node { opacity: 1; transform: translate(-50%, -50%) scale(1); }
.node.hot { background: var(--bead); color: var(--night); border-color: var(--bead); transform: translate(-50%, -50%) scale(1.1); }

.phone {
  position: absolute; right: 0; bottom: -10px;
  width: 170px; padding: 12px;
  background: var(--chalk); color: var(--night);
  border-radius: 22px; border: 5px solid #000;
  display: grid; gap: 8px;
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, .6);
  transform: translateY(30px) rotate(6deg); opacity: 0;
  transition: transform 1s var(--ease-out) .6s, opacity .6s .6s;
}
.on .phone { transform: translateY(0) rotate(4deg); opacity: 1; }
.p-top { font-size: 11px; font-weight: 800; font-variation-settings: 'wdth' 115; padding-bottom: 4px; border-bottom: 1px solid #E2E5EF; }
.p-card { display: grid; padding: 7px 9px; border-radius: 9px; background: #fff; border: 1px solid #E2E5EF; font-size: 10.5px; }
.p-card b { font-size: 11px; color: var(--indigo); }
.p-card.dim b { color: #8C93BD; }

@media (max-width: 600px) {
  .phone { display: none; }
}
</style>
