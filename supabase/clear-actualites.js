const https = require('https');

const SUPABASE_URL = 'szyirafviiswvaooubzs.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eWlyYWZ2aWlzd3Zhb291YnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NTIzMTksImV4cCI6MjEwMDMyODMxOX0.eohPjJyvz-OqLFe1-2W3xhV4Ia6lkJHg3ScvrUemaVw';

console.log('Suppression de toutes les actualités existantes de la base de données Supabase...');

const options = {
  hostname: SUPABASE_URL,
  path: '/rest/v1/actualites?id=neq.00000000-0000-0000-0000-000000000000',
  method: 'DELETE',
  headers: {
    'apikey': ANON_KEY,
    'Authorization': 'Bearer ' + ANON_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }
};

const req = https.request(options, (res) => {
  let responseData = '';
  res.on('data', chunk => responseData += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('✅ Toutes les anciennes actualités ont été supprimées de Supabase !');
    } else {
      console.log('⚠️ Réponse:', responseData);
    }
  });
});

req.on('error', (err) => {
  console.error('Erreur:', err.message);
});

req.end();
