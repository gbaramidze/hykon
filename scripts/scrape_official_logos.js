const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BRANDS_DIR = path.join(__dirname, '..', 'public', 'images', 'brands');
if (!fs.existsSync(BRANDS_DIR)) fs.mkdirSync(BRANDS_DIR, { recursive: true });

function fetchHtml(url) {
  const lib = url.startsWith('https') ? https : http;
  return new Promise((resolve) => {
    lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (!loc.startsWith('http')) {
          const u = new URL(url);
          loc = u.origin + loc;
        }
        return fetchHtml(loc).then(resolve);
      }
      let chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        resolve({ status: res.statusCode, data: Buffer.concat(chunks).toString('utf8') });
      });
    }).on('error', () => resolve({ status: 500, data: '' }));
  });
}

function downloadBinary(url, filename) {
  const lib = url.startsWith('https') ? https : http;
  return new Promise((resolve) => {
    lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (!loc.startsWith('http')) {
          const u = new URL(url);
          loc = u.origin + loc;
        }
        return downloadBinary(loc, filename).then(resolve);
      }
      if (res.statusCode !== 200) return resolve(false);
      let chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        fs.writeFileSync(path.join(BRANDS_DIR, filename), buf);
        console.log(`Saved ${filename} (${buf.length} bytes)`);
        resolve(true);
      });
    }).on('error', () => resolve(false));
  });
}

async function run() {
  console.log('--- Inspecting Brand Sites for Logos ---');

  // 1. Ajax Systems
  const ajax = await fetchHtml('https://ajax.systems/');
  const ajaxSvg = ajax.data.match(/<svg[^>]*>[\s\S]*?<\/svg>/gi);
  if (ajaxSvg) {
    const logoSvg = ajaxSvg.find(s => s.toLowerCase().includes('ajax') || s.includes('M12') || s.includes('viewBox="0 0 106 20"') || s.includes('viewBox="0 0 130 24"'));
    if (logoSvg) {
      fs.writeFileSync(path.join(BRANDS_DIR, 'ajax.svg'), logoSvg);
      console.log('✓ Found Ajax SVG from official site!');
    }
  }

  // 2. EZVIZ
  const ezviz = await fetchHtml('https://www.ezviz.com/');
  const ezvizImgs = ezviz.data.match(/https?:\/\/[^"'\s]+\/(?:logo|ezviz)[^"'\s]*\.(?:svg|png)/gi);
  console.log('EZVIZ logo candidates:', ezvizImgs);
  if (ezvizImgs && ezvizImgs[0]) {
    const ext = ezvizImgs[0].endsWith('.png') ? 'png' : 'svg';
    await downloadBinary(ezvizImgs[0], `ezviz.${ext}`);
  }

  // 3. Uniview
  const unv = await fetchHtml('https://www.uniview.com/');
  const unvImgs = unv.data.match(/(?:\/|https?:\/\/)[^"'\s]+\/(?:logo|unv|uniview)[^"'\s]*\.(?:svg|png)/gi);
  console.log('Uniview logo candidates:', unvImgs);
  if (unvImgs && unvImgs[0]) {
    let u = unvImgs[0];
    if (u.startsWith('/')) u = 'https://www.uniview.com' + u;
    const ext = u.endsWith('.png') ? 'png' : 'svg';
    await downloadBinary(u, `uniview.${ext}`);
  }

  // 4. Ruijie
  const ruijie = await fetchHtml('https://www.ruijienetworks.com/');
  const rImgs = ruijie.data.match(/(?:\/|https?:\/\/)[^"'\s]+\/(?:logo|ruijie|reyee)[^"'\s]*\.(?:svg|png)/gi);
  console.log('Ruijie logo candidates:', rImgs);
  if (rImgs && rImgs[0]) {
    let u = rImgs[0];
    if (u.startsWith('/')) u = 'https://www.ruijienetworks.com' + u;
    const ext = u.endsWith('.png') ? 'png' : 'svg';
    await downloadBinary(u, `ruijie.${ext}`);
  }

  // 5. ZKTeco
  const zk = await fetchHtml('https://www.zkteco.com/');
  const zkImgs = zk.data.match(/(?:\/|https?:\/\/)[^"'\s]+\/(?:logo|zkteco)[^"'\s]*\.(?:svg|png)/gi);
  console.log('ZKTeco logo candidates:', zkImgs);
  if (zkImgs && zkImgs[0]) {
    let u = zkImgs[0];
    if (u.startsWith('/')) u = 'https://www.zkteco.com' + u;
    const ext = u.endsWith('.png') ? 'png' : 'svg';
    await downloadBinary(u, `zkteco.${ext}`);
  }

  // 6. Paradox
  const paradox = await fetchHtml('https://www.paradox.com/');
  const pImgs = paradox.data.match(/(?:\/|https?:\/\/)[^"'\s]+\/(?:logo|paradox)[^"'\s]*\.(?:svg|png|gif)/gi);
  console.log('Paradox logo candidates:', pImgs);
  if (pImgs && pImgs[0]) {
    let u = pImgs[0];
    if (u.startsWith('/')) u = 'https://www.paradox.com' + u;
    const ext = u.endsWith('.png') ? 'png' : u.endsWith('.gif') ? 'gif' : 'svg';
    await downloadBinary(u, `paradox.${ext}`);
  }

  // 7. Detnov
  const detnov = await fetchHtml('https://www.detnov.com/');
  const dImgs = detnov.data.match(/(?:\/|https?:\/\/)[^"'\s]+\/(?:logo|detnov)[^"'\s]*\.(?:svg|png)/gi);
  console.log('Detnov logo candidates:', dImgs);
  if (dImgs && dImgs[0]) {
    let u = dImgs[0];
    if (u.startsWith('/')) u = 'https://www.detnov.com' + u;
    const ext = u.endsWith('.png') ? 'png' : 'svg';
    await downloadBinary(u, `detnov.${ext}`);
  }
}

run();
