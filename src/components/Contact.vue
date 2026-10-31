<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { profile } from '../data/profile'
import NdopBand from './NdopBand.vue'

// Les lettres de l'adresse s'élargissent à l'approche du curseur.
const chars = profile.email.split('')
const widths = ref(chars.map(() => 72))
const big = ref(null)
const copied = ref(false)
let resetTimer = 0

function onMove(e) {
  const spans = big.value.querySelectorAll('.ch')
  spans.forEach((s, i) => {
    const r = s.getBoundingClientRect()
    const d = Math.abs(e.clientX - (r.left + r.width / 2))
    const k = Math.max(0, 1 - d / 220)
    widths.value[i] = 72 + 53 * k * k
  })
}
function onLeave() { widths.value = chars.map(() => 72) }

async function copy() {
  try {
    await navigator.clipboard.writeText(profile.email)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = profile.email
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
  copied.value = true
  clearTimeout(resetTimer)
  resetTimer = setTimeout(() => { copied.value = false }, 2400)
}
onBeforeUnmount(() => clearTimeout(resetTimer))

const links = [
  { label: 'WhatsApp', href: profile.whatsapp },
  { label: 'GitHub', href: profile.github },
  { label: 'LinkedIn', href: profile.linkedin }
].filter((l) => l.href)
const year = new Date().getFullYear()
</script>

<template>
  <section id="contact" class="contact" aria-labelledby="contact-titre">
    <div class="wrap">
      <h2 id="contact-titre" class="section-title">Un projet en tête ?</h2>
      <p class="lead">Décrivez-moi votre métier et ce qui vous fait perdre du temps. Je vous réponds avec une proposition concrète.</p>

      <a
        ref="big"
        class="email"
        :href="`mailto:${profile.email}`"
        @mousemove="onMove"
        @mouseleave="onLeave"
      >
        <span class="sr-only">{{ profile.email }}</span>
        <span
          v-for="(c, i) in chars"
          :key="i"
          class="ch"
          aria-hidden="true"
          :style="{ fontVariationSettings: `'wdth' ${widths[i]}, 'wght' ${500 + (widths[i] - 72) * 6}` }"
        >{{ c }}</span>
      </a>

      <div class="actions">
        <a class="btn btn--solid" :href="`mailto:${profile.email}`">Écrire un e-mail</a>
        <button class="btn" type="button" @click="copy">{{ copied ? 'Adresse copiée' : 'Copier l’adresse' }}</button>
        <a v-for="l in links" :key="l.label" class="btn" :href="l.href" target="_blank" rel="noopener">{{ l.label }}</a>
      </div>
      <p class="sr-only" aria-live="polite">{{ copied ? 'Adresse copiée dans le presse-papiers' : '' }}</p>
    </div>

    <footer class="foot">
      <div class="band"><NdopBand :tiles="30" /></div>
      <div class="wrap fl">
        <span>© {{ year }} {{ profile.fullName }}</span>
        <span>Site conçu et développé en Vue.js</span>
      </div>
    </footer>
  </section>
</template>

<style scoped>
.contact { background: var(--night); color: var(--chalk); padding-top: clamp(80px, 14vh, 160px); }
.lead { max-width: 44ch; font-size: var(--t-2); line-height: 1.35; color: var(--mist); margin: 18px 0 clamp(36px, 7vh, 72px); }
.email {
  display: block;
  text-decoration: none;
  font-size: clamp(1.6rem, 6.2vw, 6rem);
  line-height: 1;
  color: var(--bead);
  white-space: nowrap;
  overflow: hidden;
  padding-bottom: .12em;
  border-bottom: 2px solid rgba(242, 183, 5, .35);
}
.ch { display: inline-block; transition: font-variation-settings .25s var(--ease-out); }
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }

.foot { margin-top: clamp(80px, 14vh, 140px); }
.band { height: 64px; }
.fl { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 24px; padding-top: 22px; padding-bottom: 28px; font-size: 14px; color: var(--mist-dim); }

@media (max-width: 560px) {
  .email { white-space: normal; word-break: break-all; }
}
</style>
