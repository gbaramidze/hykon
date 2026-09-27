const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BRANDS_DIR = path.join(__dirname, '..', 'public', 'images', 'brands');
if (!fs.existsSync(BRANDS_DIR)) {
  fs.mkdirSync(BRANDS_DIR, { recursive: true });
}

function fetchUrl(url, customHeaders = {}) {
  const lib = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': 'HykonStore/1.0 (contact: info@hykon.ge)',
      ...customHeaders
    };
    lib.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (!loc.startsWith('http')) {
          const u = new URL(url);
          loc = u.origin + loc;
        }
        return fetchUrl(loc, customHeaders).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return resolve({ status: res.statusCode, data: null });
      }
      let chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({ status: 200, data: buffer });
      });
    }).on('error', (err) => resolve({ status: 500, error: err }));
  });
}

// Get direct image URL from Wikimedia API
async function getWikiFileUrl(fileName) {
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url&format=json`;
  const res = await fetchUrl(apiUrl);
  if (res.status === 200 && res.data) {
    try {
      const json = JSON.parse(res.data.toString('utf8'));
      const pages = json.query.pages;
      for (const k in pages) {
        if (pages[k].imageinfo && pages[k].imageinfo[0]) {
          return pages[k].imageinfo[0].url;
        }
      }
    } catch(e) {}
  }
  return null;
}

async function main() {
  console.log('--- Starting Official Brand Logo Downloads ---');

  const wikimediaFiles = {
    'hikvision.svg': 'File:Hikvision logo.svg',
    'seagate.svg': 'File:Seagate logo.svg',
    'western-digital.svg': 'File:Western Digital logo.svg',
    'toshiba.svg': 'File:Toshiba logo.svg',
    'dahua.svg': 'File:Dahua Technology logo.svg',
  };

  for (const [filename, wikiTitle] of Object.entries(wikimediaFiles)) {
    console.log(`Fetching ${wikiTitle}...`);
    const directUrl = await getWikiFileUrl(wikiTitle);
    if (directUrl) {
      console.log(`Downloading from ${directUrl}...`);
      const fileRes = await fetchUrl(directUrl);
      if (fileRes.status === 200 && fileRes.data) {
        fs.writeFileSync(path.join(BRANDS_DIR, filename), fileRes.data);
        console.log(`✓ Saved ${filename} (${fileRes.data.length} bytes)`);
      }
    }
  }

  // Simple-icons raw downloads
  const simpleIcons = {
    'ubiquiti.svg': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/ubiquiti.svg',
    'mikrotik.svg': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/mikrotik.svg',
    'tp-link.svg': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/tplink.svg',
    'cisco.svg': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/cisco.svg',
  };

  for (const [filename, url] of Object.entries(simpleIcons)) {
    console.log(`Fetching simple-icon ${filename}...`);
    const res = await fetchUrl(url);
    if (res.status === 200 && res.data) {
      fs.writeFileSync(path.join(BRANDS_DIR, filename), res.data);
      console.log(`✓ Saved ${filename} (${res.data.length} bytes)`);
    }
  }

  console.log('--- Checking remaining vector assets ---');
}

main();
