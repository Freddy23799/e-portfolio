<script setup>
// Bande de motifs géométriques inspirée du tissu ndop (Ouest Cameroun).
const props = defineProps({
  tiles: { type: Number, default: 24 },
  draw: { type: Boolean, default: false }, // trace les motifs au montage
  color: { type: String, default: 'var(--chalk)' },
  bg: { type: String, default: 'var(--indigo)' }
})
const S = 80
const kinds = ['diamond', 'rings', 'zigzag', 'cross']
const items = Array.from({ length: props.tiles }, (_, i) => ({ i, kind: kinds[i % kinds.length], x: i * S }))
</script>

<template>
  <svg
    class="ndop"
    :class="{ 'ndop--draw': draw }"
    :viewBox="`0 0 ${tiles * S} ${S}`"
    preserveAspectRatio="xMinYMid slice"
    aria-hidden="true"
    :style="{ background: bg, color }"
  >
    <g v-for="it in items" :key="it.i" :transform="`translate(${it.x} 0)`" :style="{ '--d': it.i * 0.035 + 's' }">
      <template v-if="it.kind === 'diamond'">
        <path class="s" pathLength="1" d="M40 8 L72 40 L40 72 L8 40 Z" />
        <path class="s" pathLength="1" d="M40 24 L56 40 L40 56 L24 40 Z" />
        <circle class="f" cx="40" cy="40" r="3.5" />
      </template>
      <template v-else-if="it.kind === 'rings'">
        <circle class="s" pathLength="1" cx="40" cy="40" r="28" />
        <circle class="s" pathLength="1" cx="40" cy="40" r="17" />
        <circle class="s" pathLength="1" cx="40" cy="40" r="6" />
      </template>
      <template v-else-if="it.kind === 'zigzag'">
        <path class="s" pathLength="1" d="M4 22 L18 10 L32 22 L46 10 L60 22 L76 10" />
        <path class="s" pathLength="1" d="M4 46 L18 34 L32 46 L46 34 L60 46 L76 34" />
        <path class="s" pathLength="1" d="M4 70 L18 58 L32 70 L46 58 L60 70 L76 58" />
      </template>
      <template v-else>
        <path class="s" pathLength="1" d="M40 6 V74 M6 40 H74" />
        <circle class="f" cx="20" cy="20" r="4" />
        <circle class="f" cx="60" cy="20" r="4" />
        <circle class="f" cx="20" cy="60" r="4" />
        <circle class="f" cx="60" cy="60" r="4" />
      </template>
    </g>
  </svg>
</template>

<style scoped>
.ndop { display: block; width: 100%; height: 100%; }
.s { fill: none; stroke: currentColor; stroke-width: 3; stroke-linejoin: round; stroke-linecap: round; }
.f { fill: currentColor; }

.ndop--draw .s {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw .9s var(--ease-out) forwards;
  animation-delay: var(--d);
}
.ndop--draw .f {
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0);
  animation: pop .5s var(--ease-out) forwards;
  animation-delay: calc(var(--d) + .4s);
}
@keyframes draw { to { stroke-dashoffset: 0; } }
@keyframes pop { to { transform: scale(1); } }
</style>
