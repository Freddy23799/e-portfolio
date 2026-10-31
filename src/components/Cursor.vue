<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { lerp } from '../composables/useRaf'

// Curseur en losange, comme une image-clé de montage. Désactivé sur écran tactile
// et quand l'utilisateur préfère réduire les animations.
const enabled = ref(false)
const pos = ref({ x: -100, y: -100 })
const big = ref(false)
const down = ref(false)
let target = { x: -100, y: -100 }
let id = 0

const onMove = (e) => {
  target = { x: e.clientX, y: e.clientY }
  big.value = !!e.target.closest('a, button, [role="slider"], [tabindex="0"]')
}
const onDown = () => { down.value = true }
const onUp = () => { down.value = false }

function loop() {
  pos.value = { x: lerp(pos.value.x, target.x, 0.22), y: lerp(pos.value.y, target.y, 0.22) }
  id = requestAnimationFrame(loop)
}

onMounted(() => {
  const fine = window.matchMedia('(pointer: fine)').matches
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || reduce) return
  enabled.value = true
  document.body.classList.add('has-cursor')
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onDown)
  window.addEventListener('pointerup', onUp)
  id = requestAnimationFrame(loop)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(id)
  document.body.classList.remove('has-cursor')
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerdown', onDown)
  window.removeEventListener('pointerup', onUp)
})
</script>

<template>
  <div
    v-if="enabled"
    class="cursor"
    :class="{ big, down }"
    :style="{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }"
    aria-hidden="true"
  >
    <span></span>
  </div>
</template>

<style scoped>
.cursor { position: fixed; left: 0; top: 0; z-index: 200; pointer-events: none; mix-blend-mode: difference; }
.cursor span {
  display: block;
  width: 14px; height: 14px;
  margin: -7px 0 0 -7px;
  background: var(--bead);
  transform: rotate(45deg) scale(1);
  border-radius: 2px;
  transition: transform .3s var(--ease-out), background .3s;
}
.cursor.big span { transform: rotate(45deg) scale(2.6); background: var(--chalk); }
.cursor.down span { transform: rotate(135deg) scale(1.8); }
</style>
