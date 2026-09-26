const fs = require('fs');
const path = require('path');

const products = require('../src/data/products.json');
const langContextFile = fs.readFileSync(path.join(__dirname, '../src/context/LanguageContext.tsx'), 'utf8');

// Extract MASTER_DICTIONARY
const match = langContextFile.match(/const MASTER_DICTIONARY:.*?=\s*(\[[\s\S]*?\]);/);
if (!match) {
  console.error('Could not extract MASTER_DICTIONARY');
  process.exit(1);
}

// Convert dictionary string to object array
let dictCode = match[1];
const MASTER_DICTIONARY = eval(dictCode);

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[\(\)\[\]\{\}\,\/\:\;\+\*\#\!\?\'\"\&^\%\$\@\~\`\|\<\>\=\_]+/g, ' ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getEnglishTitle(title) {
  let res = title;
  for (const item of MASTER_DICTIONARY) {
    if (res.includes(item.geo)) {
      res = res.replaceAll(item.geo, ' ' + item.en + ' ');
    }
  }
  // Strip any remaining Georgian letters if any
  return res;
}

console.log('Sample clean slugs:');
const slugMap = new Map();
const duplicates = [];

products.forEach(p => {
  const enTitle = getEnglishTitle(p.title);
  const skuNum = p.sku ? p.sku.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  let cleanSlug = slugify(enTitle);
  
  if (skuNum && !cleanSlug.includes(skuNum)) {
    cleanSlug = `${cleanSlug}-${skuNum}`;
  }
  
  // shorten if excessively long
  if (cleanSlug.length > 80) {
    cleanSlug = cleanSlug.slice(0, 80).replace(/-[^-]*$/, '');
    if (skuNum && !cleanSlug.includes(skuNum)) {
      cleanSlug = `${cleanSlug}-${skuNum}`;
    }
  }

  if (slugMap.has(cleanSlug)) {
    duplicates.push({ original: p.title, cleanSlug, sku: p.sku });
    cleanSlug = `${cleanSlug}-${p.id.replace('prod-', '')}`;
  }

  slugMap.set(cleanSlug, p.id);
  p.cleanSlug = cleanSlug;
});

products.slice(0, 20).forEach(p => {
  console.log(`${p.sku} | ${p.title}`);
  console.log(`  OLD: ${p.slug}`);
  console.log(`  NEW: ${p.cleanSlug}\n`);
});

console.log(`Total unique clean slugs: ${slugMap.size} / ${products.length}`);
