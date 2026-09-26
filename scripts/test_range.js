const fs = require('fs');
const urls = JSON.parse(fs.readFileSync('scripts/all_product_urls.json', 'utf8'));

async function testRange() {
  for (let i = 15; i < 30; i++) {
    const url = urls[i];
    try {
      const t0 = Date.now();
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      console.log(`[${i}] Status: ${res.status} (${Date.now() - t0}ms) - ${url}`);
    } catch (e) {
      console.log(`[${i}] ERROR: ${e.message} - ${url}`);
    }
  }
}

testRange();
