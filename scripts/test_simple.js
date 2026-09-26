const fs = require('fs');

async function testSimple() {
  const t0 = Date.now();
  const res = await fetch('https://www.sanotech.ge/products', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const html = await res.text();
  console.log(`Page 1 fetched in ${Date.now() - t0}ms, length: ${html.length}`);

  const t1 = Date.now();
  const res2 = await fetch('https://www.sanotech.ge/products?page=2', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const html2 = await res2.text();
  console.log(`Page 2 fetched in ${Date.now() - t1}ms, length: ${html2.length}`);
}

testSimple().catch(console.error);
