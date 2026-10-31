<script setup>
import { ref } from 'vue'
import { profile } from '../data/profile'
import NdopBand from './NdopBand.vue'

// Si public/images/freddy.jpg n'existe pas encore, un portrait en motifs ndop le remplace.
const photoOk = ref(true)
</script>

<template>
  <section id="apropos" class="about" aria-labelledby="apropos-titre">
    <div class="wrap grid">
      <figure class="portrait">
        <img
          v-if="photoOk"
          :src="profile.photo"
          :alt="`Portrait de ${profile.fullName}`"
          loading="lazy"
          @error="photoOk = false"
        />
        <div v-else class="fallback" role="img" :aria-label="`Monogramme de ${profile.firstName}`">
          <div class="pattern"><NdopBand :tiles="4" /></div>
          <div class="pattern"><NdopBand :tiles="4" /></div>
          <div class="pattern"><NdopBand :tiles="4" /></div>
          <div class="pattern"><NdopBand :tiles="4" /></div>
          <span class="mono">{{ profile.firstName.charAt(0) }}</span>
        </div>
      </figure>

      <div class="text">
        <h2 id="apropos-titre" class="section-title">À propos</h2>
        <p v-for="(p, i) in profile.intro" :key="i" :class="{ big: i === 0 }">{{ p }}</p>
        <p>Je suis basé {{ profile.basedIn }} et je travaille aussi à distance.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about { padding: clamp(80px, 14vh, 160px) 0; background: var(--chalk); }
.grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(32px, 6vw, 96px); align-items: center; }
.portrait { margin: 0; aspect-ratio: 4 / 5; border-radius: 18px; overflow: hidden; background: var(--indigo); }
.portrait img { width: 100%; height: 100%; object-fit: cover; }
.fallback { position: relative; height: 100%; display: grid; grid-template-rows: repeat(4, 1fr); }
.pattern { overflow: hidden; }
.pattern:nth-child(even) { transform: scaleX(-1); }
.mono {
  position: absolute; inset: 0;
  display: grid; place-items: center;
  font-size: clamp(8rem, 22vw, 18rem);
  font-weight: 900;
  font-variation-settings: 'wdth' 125;
  color: var(--bead);
  line-height: 1;
  text-shadow: 0 0 0 var(--indigo);
  -webkit-text-stroke: 10px var(--indigo);
  paint-order: stroke fill;
}
.section-title { color: var(--indigo); margin-bottom: 24px; }
.text p { max-width: 58ch; margin: 0 0 1em; font-size: var(--t-1); color: #3B4370; }
.text p.big { font-size: var(--t-3); line-height: 1.3; color: var(--night); font-weight: 500; font-variation-settings: 'wdth' 95; }

@media (max-width: 820px) {
  .grid { grid-template-columns: 1fr; }
  .portrait { max-width: 420px; }
}
</style>
