const fs = require('fs');

const content = fs.readFileSync('scripts/initial_seed_raw.ts', 'utf8');

// Use ts-node or eval or regex to extract arrays
const extractArray = (varName) => {
  const startIdx = content.indexOf(`export const ${varName}`);
  if (startIdx === -1) return null;
  const eqIdx = content.indexOf('=', startIdx);
  const semiIdx = content.indexOf(';\n\nexport const', eqIdx);
  const endIdx = semiIdx !== -1 ? semiIdx : content.lastIndexOf(';');
  const code = content.substring(eqIdx + 1, endIdx).trim();
  try {
    return eval(`(${code})`);
  } catch (e) {
    console.error(`Failed to eval ${varName}:`, e.message);
    return null;
  }
};

const initialCats = extractArray('INITIAL_CATEGORIES');
const initialBrands = extractArray('INITIAL_BRANDS');
const initialProds = extractArray('INITIAL_PRODUCTS');
const initialBlog = extractArray('INITIAL_BLOG_POSTS');
const initialOrders = extractArray('INITIAL_ORDERS');

console.log('Initial Categories:', initialCats ? initialCats.length : 0);
console.log('Initial Brands:', initialBrands ? initialBrands.length : 0);
console.log('Initial Products:', initialProds ? initialProds.length : 0);

if (initialProds) {
  console.log('Sample initial products:', initialProds.map(p => p.title));
  fs.writeFileSync('scripts/initial_products.json', JSON.stringify(initialProds, null, 2));
  fs.writeFileSync('scripts/initial_categories.json', JSON.stringify(initialCats, null, 2));
  fs.writeFileSync('scripts/initial_brands.json', JSON.stringify(initialBrands, null, 2));
}
