const fs = require('fs');

const products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
let fixedCount = 0;

for (const p of products) {
  if (!p.images || !Array.isArray(p.images) || p.images.length === 0) {
    p.images = ['/images/placeholder.svg'];
    fixedCount++;
  }
  if (!p.thumbnail) {
    p.thumbnail = p.images[0] || '/images/placeholder.svg';
    fixedCount++;
  }
  if (!p.categoryPath || !Array.isArray(p.categoryPath) || p.categoryPath.length === 0) {
    p.categoryPath = [
      { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
      { id: 'cat-cctv', name: 'ვიდეო მეთვალყურეობა', slug: 'ვიდეო-მეთვალყურეობა' }
    ];
    p.categoryId = 'cat-cctv';
  }
}

console.log(`Checked ${products.length} products. Fixed: ${fixedCount}`);
fs.writeFileSync('src/data/products.json', JSON.stringify(products, null, 2), 'utf8');

// Also update admin page to safely handle optional images
