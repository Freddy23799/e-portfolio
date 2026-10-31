// Toutes les informations du portfolio sont ici.
// Modifiez ce fichier pour changer les textes, les liens ou les projets.

export const profile = {
  firstName: 'Freddy',
  fullName: 'Freddy Ndie',
  role: 'Je conçois et développe des produits web complets, de l’interface au serveur, puis je les présente en vidéo.',
  location: 'Cameroun',
  basedIn: 'au Cameroun', // phrase utilisée dans « Je suis basé au Cameroun »
  availability: 'Disponible pour de nouveaux projets',
  email: 'freddyndie6@gmail.com',
  // Laissez vide pour masquer le lien.
  whatsapp: '', // ex. 'https://wa.me/2376XXXXXXXX'
  github: '',
  linkedin: '',
  // Placez votre photo dans public/images/ sous ce nom.
  photo: './images/freddy.jpg',
  intro: [
    'Je construis des logiciels pour les métiers de l’événementiel et pour les entreprises qui veulent trouver plus de clients.',
    'Je m’occupe de tout le chemin : comprendre le métier, dessiner les écrans, écrire le code, mettre en ligne, puis réaliser la vidéo qui fait connaître le produit.'
  ],
  heroStack: ['Vue.js', 'Django', 'PostgreSQL', 'Redis', 'Motion design']
}

export const projects = [
  {
    id: 'wedivo',
    name: 'Wedivo',
    kind: 'Logiciel en ligne pour wedding planners',
    status: 'En développement',
    pitch: 'Chaque agence de mariage crée son compte et gère ses événements, ses devis, ses billets et ses prestataires au même endroit.',
    problem: 'Les wedding planners jonglent entre WhatsApp, des tableurs et des devis faits à la main. Les relances se perdent et les paiements arrivent en retard.',
    built: 'Une plateforme où plusieurs agences travaillent chacune dans leur espace : devis et billets au design soigné, billets avec QR code contrôlés à l’entrée, relances automatiques et paiement mobile.',
    myRole: 'Super administrateur de la plateforme : conception, développement et présentation aux futurs clients.',
    stack: ['Vue.js', 'Django', 'PostgreSQL', 'Redis', 'Nginx', 'FreeMoPay'],
    mock: 'wedivo'
  },
  {
    id: 'innovent',
    name: 'INNOVENT & HOME',
    kind: 'Écosystème de services pour l’événement et la maison',
    status: 'Lancement en préparation',
    pitch: 'Une seule plateforme pour organiser un événement, louer du matériel, trouver un prestataire, aménager son intérieur, se former et voyager.',
    problem: 'Pour un événement ou un projet de maison, il faut aujourd’hui contacter dix entreprises différentes, sans vision d’ensemble.',
    built: 'Un espace client et un espace prestataire qui réunissent huit services. J’ai aussi réalisé la vidéo de lancement en motion design, avec voix off.',
    myRole: 'Produit, interface et vidéo de lancement.',
    stack: ['Interface web', 'Espace mobile', 'Motion design', 'Voix off IA'],
    mock: 'innovent'
  },
  {
    id: 'prospection',
    name: 'Plateforme de prospection',
    kind: 'Relances automatiques par e-mail et WhatsApp',
    status: 'En préparation',
    pitch: 'Le système analyse le site de chaque entreprise prospectée, repère ce qui ne va pas et envoie un message qui part du problème pour proposer la solution.',
    problem: 'Les messages de prospection génériques sont ignorés. Écrire un message personnalisé à chaque entreprise prend des heures.',
    built: 'Une analyse automatique des sites web, puis un envoi par vagues de 50 prospects tous les 2 à 3 jours via l’API WhatsApp et par e-mail, avec un agent IA qui gère les relances.',
    myRole: 'Architecture et développement complet.',
    stack: ['Python', 'JavaScript', 'Redis', 'API WhatsApp', 'Agent IA'],
    mock: 'prospection'
  },
  {
    id: 'trading',
    name: 'Vidéos de trading',
    kind: 'Formats courts verticaux pour débutants',
    status: 'Première vidéo réalisée',
    pitch: 'Des vidéos de 30 secondes qui expliquent le trading aux grands débutants, avec un graphique animé, une voix énergique et des sous-titres synchronisés au mot près.',
    problem: 'Les vidéos de trading pour débutants sont souvent statiques, avec une voix monotone et un écran à moitié vide.',
    built: 'Une première vidéo sur les supports et résistances de l’EUR/USD : rendu 3D néon, musique et effets sonores synthétisés, voix féminine, sous-titres calés sur la voix.',
    myRole: 'Scénario, animation et montage.',
    stack: ['Animation en code', 'Voix IA', 'Sound design', 'Format 9:16'],
    mock: 'trading'
  }
]

// Une vraie séquence : l'ordre compte.
export const method = [
  { title: 'Cadrer', text: 'Je pars du métier du client : qui utilise l’outil, ce qui lui fait perdre du temps, ce qu’il doit pouvoir faire dès le premier jour.' },
  { title: 'Concevoir', text: 'Je dessine les écrans et les documents importants, comme un devis ou un billet, jusqu’à ce que le rendu soit exactement celui attendu.' },
  { title: 'Construire', text: 'J’écris l’interface en Vue.js, le serveur en Django ou en Python, et je branche les paiements, les e-mails et WhatsApp.' },
  { title: 'Lancer', text: 'Je mets en ligne et je réalise la vidéo qui présente le produit à ses futurs clients.' }
]

export const stack = [
  { layer: 'Interface', tools: ['Vue.js', 'JavaScript', 'HTML et CSS', 'Animation web'] },
  { layer: 'Serveur', tools: ['Django', 'Python', 'API REST'] },
  { layer: 'Données', tools: ['PostgreSQL', 'MySQL', 'Redis'] },
  { layer: 'Mise en ligne', tools: ['Nginx', 'Linux'] },
  { layer: 'Paiement et messages', tools: ['FreeMoPay', 'API WhatsApp', 'E-mail automatique'] },
  { layer: 'Vidéo', tools: ['Motion design', 'Voix off IA', 'Sound design'] }
]
