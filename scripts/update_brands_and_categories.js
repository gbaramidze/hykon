const fs = require('fs');
const path = require('path');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u10A0-\u10FF-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function detectBrand(title, sku, currentBrand) {
  const t = ((title || '') + ' ' + (sku || '')).toLowerCase();

  // Specific brand checks
  if (t.includes('ezviz') || t.includes('cs-') || t.includes('cs-dl') || t.includes('cs-hp') || t.includes('cs-bm') || t.includes('cs-eb') || t.includes('cs-h8') || t.includes('cs-h9') || t.includes('cs-h6') || t.includes('cs-dp')) return 'EZVIZ';
  if (t.includes('hiwatch') || t.includes('ds-i') || t.includes('ds-t') || t.includes('ds-n') || t.includes('ds-h') || t.includes('hw-')) return 'HiWatch';
  if (t.includes('hilook') || t.includes('thc-') || t.includes('ipc-b1') || t.includes('ipc-t2') || t.includes('nvr-1') || t.includes('dvr-2')) return 'HiLook';
  if (t.includes('ajax') || t.includes('motionprotect') || t.includes('doorprotect') || t.includes('fireprotect') || t.includes('spacecontrol') || t.includes('streetsiren') || t.includes('lightcore') || t.includes('solobutton') || t.includes('outletcore') || t.includes('solocover') || t.includes('lifequality')) return 'Ajax';
  if (t.includes('paradox') || t.includes('476pet') || t.includes('pro476') || t.includes('k636') || t.includes('k656') || t.includes('zx8') || t.includes('pgm4') || t.includes('pcs-265') || t.includes('ip150') || t.includes('mg50') || t.includes('sp40') || t.includes('sp60')) return 'Paradox';
  if (t.includes('zkteco') || t.includes('tf1700') || t.includes('speedface') || t.includes('mb200') || t.includes('k1-1')) return 'ZKTeco';
  if (t.includes('uniview') || t.includes('unv ') || t.includes('unv-') || t.includes('mw32') || t.includes('ipc2') || t.includes('ipc3') || t.includes('nvr3')) return 'Uniview';
  if (t.includes('seagate') || t.includes('skyhawk') || t.includes('ironwolf') || t.includes('barracuda') || t.includes('st2000vx') || t.includes('st1000vx') || t.includes('st4000vx') || t.includes('st6000vx') || t.includes('st8000vx')) return 'Seagate';
  if (t.includes('western digital') || t.includes('wd purple') || t.includes('wd red') || t.includes('wd gold') || t.includes('wd blue') || t.includes('purz') || t.includes('purx')) return 'Western Digital';
  if (t.includes('toshiba') || t.includes('mg10') || t.includes('mg08') || t.includes('dt01')) return 'Toshiba';
  if (t.includes('ruijie') || t.includes('reyee') || t.includes('rg-') || t.includes('eap660') || t.includes('eap225')) return 'Ruijie';
  if (t.includes('mikrotik') || t.includes('routerboard')) return 'MikroTik';
  if (t.includes('ubiquiti') || t.includes('unifi')) return 'Ubiquiti';
  if (t.includes('detnov') || t.includes('mad-4') || t.includes('pcd-1') || t.includes('dgd-') || t.includes('dod-') || t.includes('z-200')) return 'Detnov';
  if (t.includes('beninca') || t.includes('pupilla')) return 'Beninca';
  if (t.includes('bigbat') || t.includes('np40-12')) return 'BigBat';
  if (t.includes('cdvi') || t.includes('nanopw') || t.includes('caa470') || t.includes('ctv900')) return 'CDVI';
  if (t.includes('yli electronic') || t.includes('yli-') || t.includes('abk-800') || t.includes('wb-')) return 'YLI';
  if (t.includes('unipos') || t.includes('db8000')) return 'Unipos';
  if (t.includes('gsn') || t.includes('tx4rc')) return 'GSN';
  if (t.includes('draka') || t.includes('uc300') || t.includes('uc400') || t.includes('uc500')) return 'Draka';
  if (t.includes('dahua') || t.includes('imou')) return 'Dahua';
  if (t.includes('tp-link') || t.includes('tplink')) return 'TP-Link';
  if (t.includes('cisco')) return 'Cisco';

  // Hikvision models and variants
  if (t.includes('hikvision') || t.includes('hikvion') || t.includes('ds-2cd') || t.includes('ds-2ce') || t.includes('ds-2de') || t.includes('ds-2cv') || t.includes('ds-2cf') || t.includes('ds-76') || t.includes('ds-77') || t.includes('ds-86') || t.includes('ds-71') || t.includes('ds-72') || t.includes('ds-kd') || t.includes('ds-kh') || t.includes('ds-kv') || t.includes('ds-kis') || t.includes('ds-k1') || t.includes('ds-k2') || t.includes('ds-k4') || t.includes('ds-k7') || t.includes('ds-pk') || t.includes('ds-pm') || t.includes('ds-pdb') || t.includes('ds-pdp') || t.includes('ds-pd') || t.includes('ds-3e') || t.includes('ds-3w') || t.includes('ds-d5') || t.includes('ds-tmg') || t.includes('ds-12') || t.includes('ds-14') || t.includes('ds-16') || t.includes('ds-1m') || t.includes('ds-2fa') || t.includes('ds-ups') || t.includes('ds-mp') || t.includes('ds100hk') || t.includes('ae-md') || t.includes('ae-vc') || t.includes('ae-dc') || t.includes('ae-mc') || t.includes('ids-') || t.includes('ax pro')) {
    return 'Hikvision';
  }

  if (currentBrand && currentBrand !== 'Hykon' && currentBrand !== 'Other') return currentBrand;
  return 'Accessories';
}

const productsPath = path.join(__dirname, '..', 'src', 'data', 'products.json');
const brandsPath = path.join(__dirname, '..', 'src', 'data', 'brands.json');
const categoriesPath = path.join(__dirname, '..', 'src', 'data', 'categories.json');

const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));

// 1. Update products
for (const p of products) {
  p.brand = detectBrand(p.title, p.sku, p.brand);
  if (!p.warranty || p.warranty.trim() === '') {
    p.warranty = '2 წელი';
  }
  if (!p.deliveryTime || p.deliveryTime.trim() === '') {
    p.deliveryTime = '1-2 დღე';
  }
}

// 2. Count brands
const brandCounts = {};
for (const p of products) {
  brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
}

const brandDetails = {
  Hikvision: { description: 'Hikvision Official Security & Surveillance', country: 'Global' },
  Uniview: { description: 'Uniview IP Video Surveillance Pioneer', country: 'Global' },
  HiWatch: { description: 'HiWatch by Hikvision Professional Video', country: 'Global' },
  HiLook: { description: 'HiLook by Hikvision Cost-Effective Security', country: 'Global' },
  Ajax: { description: 'Ajax Systems Smart Wireless Security & Alarms', country: 'Europe' },
  EZVIZ: { description: 'EZVIZ Smart Home & Cloud Cameras', country: 'Global' },
  Paradox: { description: 'Paradox Security Systems High Reliability', country: 'Canada' },
  Ruijie: { description: 'Ruijie Networks & Reyee Enterprise Wi-Fi', country: 'Global' },
  Ubiquiti: { description: 'Ubiquiti UniFi Networking Solutions', country: 'USA' },
  Seagate: { description: 'Seagate SkyHawk Surveillance Hard Drives', country: 'USA' },
  'Western Digital': { description: 'WD Purple Video Surveillance Storage', country: 'USA' },
  Toshiba: { description: 'Toshiba Enterprise & Surveillance Storage', country: 'Japan' },
  ZKTeco: { description: 'ZKTeco Biometrics & Access Control', country: 'Global' },
  Detnov: { description: 'Detnov Fire Detection & Safety Systems', country: 'Spain' },
  Accessories: { description: 'Cables, Mounts, Power Supplies & Connectors', country: 'Global' },
};

const updatedBrands = Object.entries(brandCounts)
  .map(([name, count]) => {
    const slug = slugify(name);
    const details = brandDetails[name] || { description: `${name} Security Equipment`, country: 'Global' };
    return {
      id: `brand-${slug}`,
      name,
      slug,
      productCount: count,
      logo: `/images/brands/${slug}.svg`,
      description: details.description,
      country: details.country,
    };
  })
  .sort((a, b) => b.productCount - a.productCount);

// 3. Update Category Images
const categoryImages = {
  'cat-ip-cameras': '/images/products/kamera-ip-hikvisionds-2cd1043g3-liu-1559c566.png',
  'cat-analog-cameras': '/images/products/kamerahikvision-ds-2ce10kf3t-l-28mm-4362aaa5.png',
  'cat-nvr': '/images/products/chamtseri-nvr-hikvision-ds-7608nxi--c12e7fe5.png',
  'cat-dvr': '/images/products/chamtseri-dvrhiwatchds-h208qac1sata-6327b09a.png',
  'cat-alarms': '/images/products/deteqtori-modzraobis-ukabelo-ds-pdp-ceaf500c.png',
  'cat-access-control': '/images/products/domofoni-ds-kh6350-wte1-1d68f0bd.png',
  'cat-storage': '/images/products/myari-diski-seagate-2tb-st2000vx003-b0c6d496.jpg',
  'cat-switches': '/images/products/svichi-poe-hikvisionds-3e0510p-eb-8-0412c89c.jpg',
  'cat-routers': '/images/products/routeri-hikvision-ds-3wr15xwi-fi-6--40ac49d1.png',
  'cat-power-cctv': '/images/products/kvebis-bloki-220vac-12-vdc-10-a-120-c569715b.jpg',
  'cat-brackets': '/images/products/kameris-samagri-ds-1273zj-dm32-c188093e.png',
  'cat-cables': '/images/products/denis-kabeli-2x25-h05vv-f-outdoor-5ae4d2fd.png'
};

for (const c of categories) {
  if (categoryImages[c.id]) {
    c.image = categoryImages[c.id];
  }
}

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
fs.writeFileSync(brandsPath, JSON.stringify(updatedBrands, null, 2), 'utf8');
fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2), 'utf8');

console.log('Successfully updated:');
console.log('- products.json:', products.length, 'products');
console.log('- brands.json:', updatedBrands.length, 'brands');
console.log('- categories.json:', categories.length, 'categories');
console.log('Top Brands:');
updatedBrands.slice(0, 10).forEach(b => console.log(`  ${b.name}: ${b.productCount}`));
