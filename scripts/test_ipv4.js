const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const https = require('https');

function fetchHttps(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      family: 4, // force IPv4
      timeout: 8000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function test() {
  console.log('Testing HTTPS IPv4 request...');
  const t0 = Date.now();
  const res = await fetchHttps('https://www.sanotech.ge/products');
  console.log(`Success in ${Date.now() - t0}ms! Status: ${res.status}, Length: ${res.data.length}`);
}

test().catch(console.error);
