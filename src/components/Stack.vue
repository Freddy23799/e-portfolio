<script setup>
import { ref } from 'vue'
import { stack } from '../data/profile'

const hover = ref(-1)
</script>

<template>
  <section id="outils" class="stack" aria-labelledby="outils-titre">
    <div class="wrap">
      <h2 id="outils-titre" class="section-title">Outils</h2>
      <p class="lead">Rangés par couche, de ce que l’utilisateur voit jusqu’à la vidéo qui présente le produit.</p>

      <div class="layers">
        <div
          v-for="(l, i) in stack"
          :key="l.layer"
          class="layer"
          :class="{ hot: hover === i }"
          @mouseenter="hover = i"
          @mouseleave="hover = -1"
        >
          <h3 class="name">{{ l.layer }}</h3>
          <ul class="tools">
            <li v-for="t in l.tools" :key="t">{{ t }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stack { background: var(--indigo); color: var(--chalk); padding: clamp(80px, 14vh, 160px) 0; }
.lead { max-width: 44ch; font-size: var(--t-2); line-height: 1.35; color: var(--mist); margin: 16px 0 clamp(36px, 6vh, 64px); }
.layers { border-top: 1px solid rgba(201, 206, 230, .3); }
.layer {
  display: grid;
  grid-template-columns: minmax(160px, 1fr) 2fr;
  gap: 16px 32px;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid rgba(201, 206, 230, .3);
  transition: padding .4s var(--ease-out);
}
.layer.hot { padding-left: 14px; }
.name {
  margin: 0;
  font-size: var(--t-4);
  font-weight: 750;
  font-variation-settings: 'wdth' 80;
  transition: font-variation-settings .5s var(--ease-out), color .3s;
}
.layer.hot .name { font-variation-settings: 'wdth' 125; color: var(--bead); }
.tools { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.tools li { padding: .35em .9em; border-radius: 999px; border: 1px solid rgba(243, 244, 248, .45); font-size: 14px; }
.layer.hot .tools li { border-color: var(--chalk); }

@media (max-width: 640px) {
  .layer { grid-template-columns: 1fr; }
}
</style>
