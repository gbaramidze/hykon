const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
const langContextFile = fs.readFileSync(path.join(__dirname, '../src/context/LanguageContext.tsx'), 'utf8');

// Extract MASTER_DICTIONARY
const match = langContextFile.match(/const MASTER_DICTIONARY:.*?=\s*(\[[\s\S]*?\]);/);
if (!match) {
  console.error('Could not extract MASTER_DICTIONARY');
  process.exit(1);
}

const MASTER_DICTIONARY = eval(match[1]);

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
  return res;
}

const slugMap = new Map();

products.forEach(p => {
  const enTitle = getEnglishTitle(p.title);
  const skuNum = p.sku ? p.sku.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  
  let cleanSlug = slugify(enTitle);

  // Shorten if excessively long, ensuring model is preserved
  if (cleanSlug.length > 70) {
    cleanSlug = cleanSlug.slice(0, 70).replace(/-[^-]*$/, '');
  }

  if (skuNum && !cleanSlug.includes(skuNum)) {
    cleanSlug = `${cleanSlug}-${skuNum}`;
  }

  // Ensure unique
  if (slugMap.has(cleanSlug)) {
    cleanSlug = `${cleanSlug}-${p.id.replace('prod-', '')}`;
  }

  slugMap.set(cleanSlug, p.id);
  p.oldSlug = p.slug; // preserve old slug for backward compatibility
  p.slug = cleanSlug;
});

console.log(`Updated ${products.length} products with clean English SEO slugs.`);
console.log('Sample updated products:');
products.slice(0, 10).forEach(p => {
  console.log(`- SKU: ${p.sku}`);
  console.log(`  Title: ${p.title}`);
  console.log(`  Slug: ${p.slug}\n`);
});

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
console.log('Successfully saved to src/data/products.json');
