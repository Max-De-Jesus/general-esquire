const https = require('https');

const SUPABASE_URL = 'szyirafviiswvaooubzs.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eWlyYWZ2aWlzd3Zhb291YnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NTIzMTksImV4cCI6MjEwMDMyODMxOX0.eohPjJyvz-OqLFe1-2W3xhV4Ia6lkJHg3ScvrUemaVw';

const email = process.argv[2] || 'admin@generalesquire.com';
const password = process.argv[3];
if (!password) {
  console.error('Usage : node test-login.js <email> <mot de passe>  (aucun mot de passe par défaut)');
  process.exit(1);
}

const postData = JSON.stringify({
  email: email,
  password: password
});

const options = {
  hostname: SUPABASE_URL,
  path: '/auth/v1/token?grant_type=password',
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
      if (res.statusCode === 200) {
        console.log('\n🔑 Connexion réussie ! Identifiants valides.');
        console.log('User Email:', parsed.user?.email);
        console.log('User Role:', parsed.user?.user_metadata?.role || parsed.user?.role);
      } else {
        console.log('\n⚠️ Résultat connexion:', parsed.error_description || parsed.msg || responseData);
      }
    } catch (e) {
      console.log('Raw Response:', responseData);
    }
  });
});

req.on('error', (err) => {
  console.error('Erreur:', err.message);
});

req.write(postData);
req.end();
