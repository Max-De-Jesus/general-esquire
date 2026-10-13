const https = require('https');

const SUPABASE_URL = 'szyirafviiswvaooubzs.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eWlyYWZ2aWlzd3Zhb291YnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NTIzMTksImV4cCI6MjEwMDMyODMxOX0.eohPjJyvz-OqLFe1-2W3xhV4Ia6lkJHg3ScvrUemaVw';

const email = process.argv[2] || 'admin@generalesquire.com';
const password = process.argv[3];
if (!password) {
  console.error('Usage : node create-admin.js <email> <mot de passe>  (aucun mot de passe par défaut)');
  process.exit(1);
}

console.log(`Création du compte Admin pour: ${email}...`);

const postData = JSON.stringify({
  email: email,
  password: password,
  data: {
    full_name: 'Administrateur General Esquire',
    role: 'admin'
  }
});

const options = {
  hostname: SUPABASE_URL,
  path: '/auth/v1/signup',
  method: 'POST',
  headers: {
    'apikey': ANON_KEY,
    'Authorization': 'Bearer ' + ANON_KEY,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let responseData = '';
  res.on('data', chunk => responseData += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    try {
      const parsed = JSON.parse(responseData);
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('\n✅ Compte Administrateur créé avec succès dans Supabase !');
        console.log('---------------------------------------------------------');
        console.log('Email    :', email);
        console.log('Mot de passe : (non affiché)');
        console.log('Rôle     : admin');
        console.log('ID User  :', parsed.id || parsed.user?.id);
        console.log('---------------------------------------------------------');
      } else {
        console.log('\n⚠️ Réponse Supabase:', parsed.msg || parsed.error_description || parsed.message || responseData);
      }
    } catch (e) {
      console.log('Raw Response:', responseData);
    }
  });
});

req.on('error', (err) => {
  console.error('Erreur lors de la création:', err.message);
});

req.write(postData);
req.end();
