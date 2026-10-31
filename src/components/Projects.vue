<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { projects } from '../data/profile'
import WedivoMock from './mocks/WedivoMock.vue'
import InnoventMock from './mocks/InnoventMock.vue'
import ProspectionMock from './mocks/ProspectionMock.vue'
import TradingMock from './mocks/TradingMock.vue'

const mocks = { wedivo: WedivoMock, innovent: InnoventMock, prospection: ProspectionMock, trading: TradingMock }

// Sur grand écran : la section reste fixe et les projets défilent à l'horizontale.
const root = ref(null)
const rail = ref(null)
const wide = ref(false)
const progress = ref(0)
const x = ref(0)
const panelVisible = ref(projects.map(() => false))
let raf = 0
let io

const active = computed(() => Math.min(projects.length - 1, Math.round(progress.value * (projects.length - 1))))
const isOn = (i) => (wide.value ? active.value === i : panelVisible.value[i])

function update() {
  raf = 0
  if (!wide.value || !root.value) return
  const r = root.value.getBoundingClientRect()
  const span = r.height - window.innerHeight
  progress.value = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0
  const travel = rail.value.scrollWidth - window.innerWidth
  x.value = progress.value * travel
}
const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
function onResize() {
  wide.value = window.matchMedia('(min-width: 900px)').matches
  update()
}

function goTo(i) {
  if (!wide.value) {
    document.getElementById(`projet-${projects[i].id}`)?.scrollIntoView({ behavior: 'smooth' })
    return
  }
  const r = root.value.getBoundingClientRect()
  const span = r.height - window.innerHeight
  const top = r.top + window.scrollY + span * (i / (projects.length - 1))
  window.scrollTo({ top, behavior: 'smooth' })
}

onMounted(() => {
  onResize()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
  io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const i = Number(e.target.dataset.index)
      panelVisible.value[i] = e.isIntersecting
    })
  }, { threshold: 0.35 })
  root.value.querySelectorAll('.panel').forEach((p) => io.observe(p))
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  io && io.disconnect()
  cancelAnimationFrame(raf)
})
</script>

<template>
  <section
    id="travaux"
    ref="root"
    class="work"
    :class="{ 'work--wide': wide }"
    :style="wide ? { height: `${projects.length * 100}vh` } : null"
    aria-labelledby="travaux-titre"
  >
    <div class="sticky">
      <div class="top wrap">
        <h2 id="travaux-titre" class="section-title">Travaux</h2>
        <div class="pager" role="tablist" aria-label="Projets">
          <button
            v-for="(p, i) in projects"
            :key="p.id"
            type="button"
            role="tab"
            class="pg"
            :class="{ on: wide && active === i }"
            :aria-selected="wide && active === i"
            @click="goTo(i)"
          >{{ p.name }}</button>
        </div>
      </div>

      <div ref="rail" class="rail" :style="wide ? { transform: `translate3d(${-x}px,0,0)` } : null">
        <article
          v-for="(p, i) in projects"
          :id="`projet-${p.id}`"
          :key="p.id"
          class="panel"
          :class="{ on: isOn(i) }"
          :data-index="i"
          :aria-label="p.name"
        >
          <div class="text">
            <div class="meta">
              <span class="kind">{{ p.kind }}</span>
              <span class="status">{{ p.status }}</span>
            </div>
            <h3 class="pname">{{ p.name }}</h3>
            <p class="pitch">{{ p.pitch }}</p>
            <dl class="facts">
              <div><dt>Le problème</dt><dd>{{ p.problem }}</dd></div>
              <div><dt>Ce que j’ai construit</dt><dd>{{ p.built }}</dd></div>
              <div><dt>Mon rôle</dt><dd>{{ p.myRole }}</dd></div>
            </dl>
            <ul class="stack" aria-label="Technologies">
              <li v-for="s in p.stack" :key="s">{{ s }}</li>
            </ul>
          </div>
          <div class="visual">
            <component :is="mocks[p.mock]" :active="isOn(i)" />
            <p class="mock-note">Illustration de l’interface</p>
          </div>
        </article>
      </div>

      <div v-if="wide" class="progress" aria-hidden="true">
        <span :style="{ transform: `scaleX(${progress})` }"></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.work { background: var(--night); color: var(--chalk); position: relative; }
.sticky { padding: calc(var(--nav-h) + 40px) 0 60px; }
.work--wide .sticky {
  position: sticky; top: 0;
  height: 100vh;
  padding: calc(var(--nav-h) + 28px) 0 0;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
}

.top { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; flex-wrap: wrap; }
.pager { display: flex; flex-wrap: wrap; gap: 6px; }
.pg {
  border: 1px solid rgba(201, 206, 230, .25);
  background: transparent; color: var(--mist);
  padding: .4em .9em; border-radius: 999px; font-size: 13px; cursor: pointer;
  transition: background .25s, color .25s, border-color .25s;
}
.pg:hover { border-color: var(--chalk); color: var(--chalk); }
.pg.on { background: var(--bead); border-color: var(--bead); color: var(--night); }

.rail { display: grid; gap: 80px; margin-top: 40px; }
.work--wide .rail {
  display: flex; gap: 0; margin-top: 0;
  width: max-content; height: 100%;
  will-change: transform;
}

.panel {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(28px, 4vw, 72px);
  align-items: center;
  padding: 0 var(--gutter);
}
.work--wide .panel { width: 100vw; height: 100%; padding-bottom: 40px; }

.text { max-width: 520px; }
.meta { display: flex; flex-wrap: wrap; gap: 8px 14px; align-items: center; font-size: 13px; color: var(--mist); }
.status { padding: .2em .7em; border-radius: 999px; border: 1px solid var(--bead); color: var(--bead); }
.pname {
  margin: 14px 0 12px;
  font-size: clamp(2.2rem, 5vw, 4.4rem);
  line-height: .95;
  font-weight: 800;
  letter-spacing: -0.02em;
  font-variation-settings: 'wdth' 70;
  transition: font-variation-settings 1s var(--ease-out);
}
.panel.on .pname { font-variation-settings: 'wdth' 118; }
.pitch { font-size: var(--t-2); line-height: 1.35; margin: 0 0 20px; color: var(--chalk); }
.facts { margin: 0; display: grid; gap: 12px; }
.facts dt { font-size: 13px; font-weight: 700; color: var(--bead); }
.facts dd { margin: 2px 0 0; font-size: 15px; color: var(--mist); line-height: 1.5; }
.stack { list-style: none; margin: 18px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
.stack li { font-size: 12.5px; padding: .3em .75em; border-radius: 6px; background: var(--night-2); color: var(--mist); }

.visual { min-width: 0; }

.progress { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: rgba(201, 206, 230, .1); }
.progress span { display: block; height: 100%; background: var(--bead); transform-origin: left; }

@media (max-width: 1100px) and (min-width: 900px) {
  .facts div:nth-child(1) { display: none; }
}
@media (max-height: 760px) and (min-width: 900px) {
  .facts { display: none; }
}
@media (max-width: 899px) {
  .panel { grid-template-columns: 1fr; }
  .pname { font-variation-settings: 'wdth' 110; }
}
</style>
