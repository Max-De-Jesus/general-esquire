const https = require('https');

const SUPABASE_URL = 'szyirafviiswvaooubzs.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eWlyYWZ2aWlzd3Zhb291YnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NTIzMTksImV4cCI6MjEwMDMyODMxOX0.eohPjJyvz-OqLFe1-2W3xhV4Ia6lkJHg3ScvrUemaVw';

const seedNews = [
  {
    title: "Ouverture des Inscriptions pour le Séjour Cocooning Chrysalides 2027 au Bénin",
    subtitle: "Pension complète de 2 semaines sous le signe de la sérénité et de la bienveillance",
    summary: "Les réservations pour l'édition annuelle du séjour Chrysalides au Bénin sont désormais ouvertes. Places limitées à 10 pensionnaires pour un accompagnement d'exception.",
    content: "General Esquire et son enseigne Chrysalides sont heureux d'annoncer le lancement des inscriptions pour le grand séjour de cocooning touristique annuel au Bénin. Au début de chaque année, venez vous évader, découvrir un patrimoine culturel et gastronomique d'exception, et bénéficier d'une prise en charge bienveillante et d'un accompagnement psychologique sur mesure.",
    category: "Chrysalides",
    date: "2026-07-20",
    image_url: "/images/Femmezen2.jpg",
    author: "General Esquire",
    is_featured: true,
    is_published: true
  },
  {
    title: "Conférence Exclusive : Prévention des Risques Juridiques pour Dirigeants d'Entreprises",
    subtitle: "Protéger sa réputation et son patrimoine face aux sanctions administratives",
    summary: "General Esquire organise un petit-déjeuner débat à Paris sur la gestion anticipée des litiges commerciaux et des fermetures d'établissements.",
    content: "Le risque de fermeture d'établissement ou de poursuites judiciaires peut lourdement impacter le patrimoine et la réputation des chefs d'entreprise. Lors de ce séminaire interactif, Maître General Esquire partagera ses meilleures stratégies précontentieuses pour anticiper les contrôles et protéger efficacement vos actifs.",
    category: "Conseil Juridique",
    date: "2026-07-15",
    image_url: "/images/bannerchef.png",
    author: "Service Juridique",
    is_featured: true,
    is_published: true
  },
  {
    title: "Partenariat Culturel : Récitals & Événements Artistiques lors des Séjours Chrysalides",
    subtitle: "Célébrer la résilience par la musique, la poésie et les talents partagés",
    summary: "En enrichissant ses séjours de moments d'expression artistique et de spectacles vivants, Chrysalides offre une véritable parenthèse de résilience et de joie.",
    content: "Chrysalides dévoile son nouveau programme d'animations culturelles pour les soirées de détente. En plus des promenades guidées et des soins, les pensionnaires pourront assister à des récitals de musique traditionnelle, des spectacles vivants et participer s'ils le souhaitent à des scènes ouvertes conviviales.",
    category: "Événement",
    date: "2026-07-10",
    image_url: "/images/Chant2.jpg",
    author: "Équipe Animation",
    is_featured: false,
    is_published: true
  },
  {
    title: "Mise à Disposition de Services d'Assistance Gratuite pour les Particuliers",
    subtitle: "Scanner, photocopieur et traductions offertes pour vos démarches précontentieuses",
    summary: "Fidèle à ses engagements de proximité et d'écoute, General Esquire élargit son offre de services inclus pour tous les particuliers accompagnés par le cabinet.",
    content: "Dans le cadre de la prise en charge des dossiers individuels, General Esquire garantit à tout de ses client(e)s, personnes physiques, un accès gratuit à ses équipements d'impression et de numérisation, ainsi qu'une traduction intégrale en français et anglais de leurs pièces.",
    category: "Annonce",
    date: "2026-07-02",
    image_url: "/images/bannerparticulier.png",
    author: "Direction General Esquire",
    is_featured: false,
    is_published: true
  }
];

const postBody = JSON.stringify(seedNews);

const options = {
  hostname: SUPABASE_URL,
  path: '/rest/v1/actualites',
  method: 'POST',
  headers: {
    'apikey': ANON_KEY,
    'Authorization': 'Bearer ' + ANON_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (err) => {
  console.error('Error:', err);
});

req.write(postBody);
req.end();
