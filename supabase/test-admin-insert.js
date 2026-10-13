const https = require('https');

const SUPABASE_URL = 'szyirafviiswvaooubzs.supabase.co';
// Mot de passe fourni par variable d'environnement (jamais écrit dans le dépôt) :
//   ADMIN_PASSWORD='...' node test-admin-insert.js
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.error('ADMIN_PASSWORD manquant : ADMIN_PASSWORD=... node test-admin-insert.js');
  process.exit(1);
}
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eWlyYWZ2aWlzd3Zhb291YnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NTIzMTksImV4cCI6MjEwMDMyODMxOX0.eohPjJyvz-OqLFe1-2W3xhV4Ia6lkJHg3ScvrUemaVw';

// 1. Sign in as Admin
const postData = JSON.stringify({
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
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(loginOptions, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const parsed = JSON.parse(data);
    const token = parsed.access_token;
    if (!token) {
      console.log('Login failed:', data);
      return;
    }
    console.log('Admin token retrieved successfully!');

    // 2. Try inserting actualite with Admin Token
    const articleData = JSON.stringify({
      title: 'Test Article Admin',
      summary: 'Summary test admin',
      content: 'Content test admin',
      category: 'Annonce',
      date: new Date().toISOString().split('T')[0],
      image_url: '/images/Femmezen2.jpg',
      author: 'Administration General Esquire',
      is_featured: false,
      is_published: true
    });

    const insertOptions = {
      hostname: SUPABASE_URL,
      path: '/rest/v1/actualites',
      method: 'POST',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    };

    const insertReq = https.request(insertOptions, (insertRes) => {
      let insertData = '';
      insertRes.on('data', c => insertData += c);
      insertRes.on('end', () => {
        console.log('Insert Status:', insertRes.statusCode);
        console.log('Insert Result:', insertData);
      });
    });

    insertReq.write(articleData);
    insertReq.end();
  });
});

req.write(postData);
req.end();
