const https = require('https');

const SUPABASE_URL = 'szyirafviiswvaooubzs.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eWlyYWZ2aWlzd3Zhb291YnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NTIzMTksImV4cCI6MjEwMDMyODMxOX0.eohPjJyvz-OqLFe1-2W3xhV4Ia6lkJHg3ScvrUemaVw';

// Test de connexion - lire les actualites
const options = {
  hostname: SUPABASE_URL,
  path: '/rest/v1/actualites?select=id,title&limit=5',
  method: 'GET',
  headers: {
    'apikey': ANON_KEY,
    'Authorization': 'Bearer ' + ANON_KEY,
    'Content-Type': 'application/json',
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    if (res.statusCode === 200) {
      console.log('\n✅ Supabase connecte avec succes ! Tables existantes detectees.');
    } else if (res.statusCode === 404) {
      console.log('\n❌ Table "actualites" introuvable - le schema doit etre cree dans Supabase Dashboard.');
    } else {
      console.log('\n⚠️  Code status:', res.statusCode);
    }
  });
});

req.on('error', (err) => {
  console.error('Erreur connexion:', err.message);
});

req.end();
