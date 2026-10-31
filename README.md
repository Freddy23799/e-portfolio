# Portfolio de Freddy — Vue.js

Site portfolio en Vue 3 + Vite, sans autre dépendance : toutes les animations sont écrites à la main.

## Lancer le site

Il faut Node.js 18 ou plus récent.

```bash
npm install
npm run dev
```

Ouvrez ensuite l’adresse affichée (en général http://localhost:5173).

## Mettre en ligne

```bash
npm run build
```

Le dossier `dist/` contient le site prêt à publier (Nginx, Netlify, Vercel, GitHub Pages, hébergement mutualisé…).

## Personnaliser

- **Textes, projets, liens** : tout est dans `src/data/profile.js`.
- **Votre photo** : déposez `freddy.jpg` dans `public/images/`. Sans photo, un monogramme en motifs ndop s’affiche.
- **WhatsApp, GitHub, LinkedIn** : remplissez les champs dans `profile.js`, les boutons apparaissent automatiquement.
- **Couleurs** : variables en haut de `src/styles/base.css`.

## Ce qu’il y a dedans

| Section | Animation |
|---|---|
| Chargement | Motifs ndop tracés trait par trait, compteur synchronisé sur le chargement des polices |
| Accueil | Le titre est un montage vidéo : pistes, images-clés et tête de lecture que l’on peut faire glisser pour rejouer l’ouverture |
| Navigation | Barre de montage : chaque section est un clip, la tête de lecture suit le défilement |
| Travaux | Défilement horizontal des 4 projets, interfaces animées en direct (Wedivo, INNOVENT & HOME, prospection, vidéo trading) |
| Méthode | La tête de lecture avance d’étape en étape au défilement |
| Outils | Les couches s’élargissent au survol |
| Contact | Les lettres de l’adresse s’élargissent à l’approche du curseur, bouton copier |

Le site respecte le réglage « réduire les animations » du système, fonctionne au clavier et s’adapte au téléphone.

## Structure

```
src/
  App.vue
  data/profile.js          ← vos informations
  styles/base.css          ← couleurs, typographie
  components/
    Preloader.vue  TimelineNav.vue  Hero.vue  Projects.vue
    Method.vue  Stack.vue  About.vue  Contact.vue  Cursor.vue  NdopBand.vue
    mocks/  WedivoMock.vue  InnoventMock.vue  ProspectionMock.vue  TradingMock.vue
public/images/
  og.png                   ← aperçu lors d’un partage de lien
  freddy.jpg               ← à ajouter
```
