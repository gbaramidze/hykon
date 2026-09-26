const fs = require('fs');

const products = JSON.parse(fs.readFileSync('src/data/sanotech_products.json', 'utf8'));
const categories = JSON.parse(fs.readFileSync('src/data/sanotech_categories.json', 'utf8'));

console.log('Total categories:', categories.length);
console.log('Total products:', products.length);

// Count products per category
const catCountMap = new Map();
categories.forEach(c => catCountMap.set(c.id, 0));

products.forEach(p => {
  const cId = p.categoryId;
  if (catCountMap.has(cId)) {
    catCountMap.set(cId, catCountMap.get(cId) + 1);
  }
});

// Also bubble counts up to parent root categories
categories.forEach(c => {
  if (c.parentId) {
    const parentCount = catCountMap.get(c.parentId) || 0;
    const subCount = catCountMap.get(c.id) || 0;
    catCountMap.set(c.parentId, parentCount + subCount);
  }
});

const activeCategories = [];
categories.forEach(c => {
  const count = catCountMap.get(c.id) || 0;
  if (count > 0) {
    activeCategories.push({
      ...c,
      productCount: count
    });
  }
});

console.log('Active categories with >0 products:', activeCategories.length);
console.log('Empty categories hidden:', categories.length - activeCategories.length);

fs.writeFileSync('src/data/sanotech_categories.json', JSON.stringify(activeCategories, null, 2));
console.log('Saved active categories into sanotech_categories.json');
