<script setup>
import Preloader from './components/Preloader.vue'
import TimelineNav from './components/TimelineNav.vue'
import Hero from './components/Hero.vue'
import Projects from './components/Projects.vue'
import Method from './components/Method.vue'
import Stack from './components/Stack.vue'
import About from './components/About.vue'
import Contact from './components/Contact.vue'
import Cursor from './components/Cursor.vue'
</script>

<template>
  <a class="skip" href="#travaux">Aller aux projets</a>
  <Preloader />
  <TimelineNav />
  <main>
    <Hero />
    <Projects />
    <Method />
    <Stack />
    <About />
    <Contact />
  </main>
  <Cursor />
</template>

<style>
.skip {
  position: fixed; top: 8px; left: 8px; z-index: 300;
  padding: .6em 1em; background: var(--bead); color: var(--night);
  border-radius: 8px; font-weight: 700; text-decoration: none;
  transform: translateY(-150%);
  transition: transform .2s;
}
.skip:focus { transform: none; }
</style>
