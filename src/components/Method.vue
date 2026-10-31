<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { method } from '../data/profile'

// La tête de lecture avance d'étape en étape au fil du défilement.
const root = ref(null)
const p = ref(0)
let raf = 0
function update() {
  raf = 0
  if (!root.value) return
  const r = root.value.getBoundingClientRect()
  const vh = window.innerHeight
  p.value = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height * 0.8)))
}
const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
onMounted(() => { update(); window.addEventListener('scroll', onScroll, { passive: true }) })
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const reached = (i) => p.value >= i / method.length + 0.02
</script>

<template>
  <section id="methode" ref="root" class="method" aria-labelledby="methode-titre">
    <div class="wrap">
      <div class="head">
        <h2 id="methode-titre" class="section-title">Méthode</h2>
        <p class="lead">Du premier échange à la vidéo de lancement, un projet passe par quatre étapes.</p>
      </div>

      <div class="line" aria-hidden="true">
        <span class="fill" :style="{ transform: `scaleX(${p})` }"></span>
        <span class="head-mark" :style="{ left: p * 100 + '%' }"></span>
      </div>

      <ol class="steps">
        <li v-for="(s, i) in method" :key="s.title" class="step" :class="{ on: reached(i) }">
          <span class="n">{{ i + 1 }}</span>
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.method { padding: clamp(80px, 14vh, 160px) 0; background: var(--chalk); }
.head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 16px 40px; }
.section-title { color: var(--indigo); }
.lead { max-width: 36ch; margin: 0; font-size: var(--t-2); line-height: 1.35; }

.line { position: relative; height: 2px; background: var(--mist); margin: clamp(40px, 7vh, 72px) 0 0; }
.fill { position: absolute; inset: 0; background: var(--indigo); transform-origin: left; }
.head-mark {
  position: absolute; top: 50%; width: 14px; height: 14px; background: var(--bead);
  transform: translate(-50%, -50%) rotate(45deg);
}

.steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; }
.step { padding-top: 24px; opacity: .38; transition: opacity .5s var(--ease-out); }
.step.on { opacity: 1; }
.n {
  display: block;
  font-size: clamp(3rem, 6vw, 5rem);
  line-height: 1;
  font-weight: 200;
  font-variation-settings: 'wdth' 62;
  color: var(--indigo);
  transition: font-variation-settings .8s var(--ease-out);
}
.step.on .n { font-variation-settings: 'wdth' 62, 'wght' 800; }
.step h3 { margin: 10px 0 8px; font-size: var(--t-3); font-variation-settings: 'wdth' 112; font-weight: 750; }
.step p { margin: 0; color: #3B4370; max-width: 32ch; }

@media (max-width: 900px) {
  .steps { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .steps { grid-template-columns: 1fr; }
}
</style>
