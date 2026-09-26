const fs = require('fs');
const products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));

// Extract all unique Georgian words from product titles
const wordsMap = {};
products.forEach(p => {
  const words = (p.title || '').split(/[\s,+/()\-:]+/);
  words.forEach(w => {
    const trimmed = w.trim();
    if (/[ა-ჰ]/.test(trimmed)) {
      wordsMap[trimmed] = (wordsMap[trimmed] || 0) + 1;
    }
  });
});

const sortedWords = Object.entries(wordsMap).sort((a, b) => b[1] - a[1]);
console.log('Total unique Georgian words in titles:', sortedWords.length);
console.log('Top 100 most frequent Georgian words:');
sortedWords.slice(0, 100).forEach(([w, count]) => {
  console.log(`${w}: ${count}`);
});
