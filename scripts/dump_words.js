const fs = require('fs');
const products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));

const wordsMap = new Map();
products.forEach(p => {
  const text = `${p.title} ${p.shortDescription || ''} ${p.fullDescription || ''}`;
  const words = text.match(/[\u10A0-\u10FF]+/g) || [];
  words.forEach(w => {
    wordsMap.set(w, (wordsMap.get(w) || 0) + 1);
  });
});

const sorted = Array.from(wordsMap.entries()).sort((a, b) => b[1] - a[1]);
console.log(`Found ${sorted.length} unique Georgian words across the entire database.`);

fs.writeFileSync('scripts/all_words.json', JSON.stringify(sorted, null, 2), 'utf8');
console.log('Saved to scripts/all_words.json');
