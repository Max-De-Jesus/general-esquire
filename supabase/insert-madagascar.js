const https = require('https');

const SUPABASE_URL = 'szyirafviiswvaooubzs.supabase.co';
// Mot de passe fourni par variable d'environnement (jamais écrit dans le dépôt) :
//   ADMIN_PASSWORD='...' node insert-madagascar.js
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.error('ADMIN_PASSWORD manquant : ADMIN_PASSWORD=... node insert-madagascar.js');
  process.exit(1);
}
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eWlyYWZ2aWlzd3Zhb291YnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NTIzMTksImV4cCI6MjEwMDMyODMxOX0.eohPjJyvz-OqLFe1-2W3xhV4Ia6lkJHg3ScvrUemaVw';

// 1. Sign in as Admin to get JWT token
const loginData = JSON.stringify({
  email: 'admin@generalesquire.com',
  password: ADMIN_PASSWORD
});

const loginOptions = {
  hostname: SUPABASE_URL,
  path: '/auth/v1/token?grant_type=password',
  method: 'POST',
  headers: {
    'apikey': ANON_KEY,
    'Authorization': 'Bearer ' + ANON_KEY,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
};

const req = https.request(loginOptions, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    let parsed;
    try {
      parsed = JSON.parse(data);
    } catch(e) {
      console.error('Failed to parse login response:', data);
      return;
    }
    const token = parsed.access_token;
    if (!token) {
      console.log('Login failed:', data);
      return;
    }
    console.log('Admin token retrieved successfully!');

    // 2. Call Edge Function manage-news to create Madagascar article
    const payload = JSON.stringify({
      action: 'create',
      article: {
        title: "Bientôt : Voyage touristique exceptionnel à Madagascar",
        subtitle: "Une aventure unique au cœur de l'océan Indien",
        summary: "General Esquire prépare un voyage touristique exceptionnel à Madagascar. Découvrez prochainement un séjour unique au cœur d'une île aux paysages spectaculaires, à la biodiversité incomparable et à la richesse culturelle fascinante.",
        content: "General Esquire a le plaisir d'annoncer l'organisation prochaine d'un voyage touristique exceptionnel à Madagascar.\n\nCette aventure offrira aux participants une immersion au cœur de l'une des plus belles destinations d'Afrique et de l'océan Indien, réputée pour sa biodiversité unique, ses paysages grandioses et son patrimoine culturel exceptionnel.\n\nAu programme :\n\n• Découverte des célèbres lémuriens dans leur habitat naturel ;\n• Visite des sites emblématiques et des réserves naturelles ;\n• Exploration des plages paradisiaques et des paysages majestueux ;\n• Immersion dans les traditions et la culture malgaches ;\n• Accompagnement personnalisé durant tout le séjour.\n\nCe voyage s'inscrit dans notre volonté de proposer des expériences enrichissantes, favorisant la découverte, les échanges culturels et le développement personnel.\n\nLes dates, le programme détaillé et les modalités d'inscription seront communiqués très prochainement sur notre plateforme.\n\nRestez connectés à notre espace Actualités & Annonces pour être parmi les premiers informés de l'ouverture officielle des inscriptions.",
        category: "Espace Activités",
        date: "2026-08-04",
        imageUrl: "/images/images.webp",
        images: [
          "/images/images.webp",
          "/images/@-LemursPark-Lemur-Catta.jpg"
        ],
        author: "Administration General Esquire",
        isFeatured: true,
        isPublished: true
      }
    });

    const fnOptions = {
      hostname: SUPABASE_URL,
      path: '/functions/v1/manage-news',
      method: 'POST',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const fnReq = https.request(fnOptions, (fnRes) => {
      let fnData = '';
      fnRes.on('data', c => fnData += c);
      fnRes.on('end', () => {
        console.log('Edge Function Status:', fnRes.statusCode);
        console.log('Edge Function Response:', fnData);
      });
    });

    fnReq.on('error', (err) => console.error('Edge function error:', err));
    fnReq.write(payload);
    fnReq.end();
  });
});

req.on('error', (err) => console.error('Login error:', err));
req.write(loginData);
req.end();
