const fs = require('fs');
const subcats = JSON.parse(fs.readFileSync('scripts/intellcom_subcats.json', 'utf8'));

// Filter subcategories that look related to video surveillance or catalog
console.log('Total catalog entries in menu:', subcats.length);
subcats.forEach(s => {
  console.log(`${s.id}: ${decodeURIComponent(s.slug)} -> ${s.text}`);
});
