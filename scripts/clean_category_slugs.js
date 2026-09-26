const fs = require('fs');
const path = require('path');

const categoriesPath = path.join(__dirname, '..', 'src', 'data', 'categories.json');
const productsPath = path.join(__dirname, '..', 'src', 'data', 'products.json');

const SLUG_MAP = {
  'ip-კამერები': 'ip-cameras',
  'ანალოგური-კამერები': 'analog-cameras',
  'ip-ვიდეო-ჩამწერები-nvr': 'ip-nvr-recorders',
  'ანალოგური-ვიდეო-ჩამწერები-dvr': 'analog-dvr-recorders',
  'დაცვითი-სიგნალიზაცია': 'security-alarm-systems',
  'დაშვების-კონტროლი': 'access-control-intercoms',
  'მყარი-დისკები': 'hard-drives-storage',
  'poe-სვიჩები': 'poe-network-switches',
  'როუტერები-და-wifi': 'routers-wifi-access-points',
  'კვების-ბლოკები': 'power-supplies-poe',
  'სამაგრები-და-აქსესუარები': 'brackets-accessories',
  'კაბელები-და-აქსესუარები': 'cables-connectors',
  'უსაფრთხოების-სისტემები': 'security-systems',
};

const transliterate = (str) => {
  if (SLUG_MAP[str]) return SLUG_MAP[str];
  const geoToLat = {
    'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v', 'ზ': 'z', 'თ': 't',
    'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'zh',
    'რ': 'r', 'ს': 's', 'ტ': 't', 'უ': 'u', 'ფ': 'p', 'ქ': 'k', 'ღ': 'gh', 'ყ': 'q',
    'შ': 'sh', 'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh',
    'ჯ': 'j', 'ჰ': 'h'
  };
  return str.split('').map(c => geoToLat[c] || c).join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// 1. Update categories.json
const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
categories.forEach(cat => {
  if (SLUG_MAP[cat.slug]) {
    cat.slug = SLUG_MAP[cat.slug];
  } else if (/[^\x00-\x7F]/.test(cat.slug)) {
    cat.slug = transliterate(cat.slug);
  }
});
fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2), 'utf8');
console.log('Updated categories.json with clean Latin slugs.');

// 2. Update products.json
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
let updatedCount = 0;
products.forEach(p => {
  if (p.categoryPath && Array.isArray(p.categoryPath)) {
    p.categoryPath.forEach(cp => {
      if (SLUG_MAP[cp.slug]) {
        cp.slug = SLUG_MAP[cp.slug];
        updatedCount++;
      } else if (/[^\x00-\x7F]/.test(cp.slug)) {
        cp.slug = transliterate(cp.slug);
        updatedCount++;
      }
    });
  }
});
fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
console.log(`Updated ${updatedCount} category path references in products.json.`);
