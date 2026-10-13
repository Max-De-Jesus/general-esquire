const https = require('https');

const SUPABASE_URL = 'szyirafviiswvaooubzs.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eWlyYWZ2aWlzd3Zhb291YnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NTIzMTksImV4cCI6MjEwMDMyODMxOX0.eohPjJyvz-OqLFe1-2W3xhV4Ia6lkJHg3ScvrUemaVw';

const postData = JSON.stringify({
  title: 'Test Article',
  summary: 'Summary test',
  content: 'Content test',
  category: 'Annonce',
  date: new Date().toISOString().split('T')[0],
  image_url: '/images/Femmezen2.jpg',
  author: 'Admin',
  is_featured: false,
  is_published: true
});

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
  let responseData = '';
  res.on('data', chunk => responseData += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', responseData);
  });
});

req.on('error', (err) => console.error(err));
req.write(postData);
req.end();
