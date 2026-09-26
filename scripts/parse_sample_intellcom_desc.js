const fs = require('fs');
const html = fs.readFileSync('scripts/intellcom_product_sample.html', 'utf8');

// Find all product images (including thumbnails, sliders, large images)
const prodImgMatches = [...html.matchAll(/\/files\/product_imgs\/[^\s"']+/gi)].map(m => m[0]);
console.log('Product image files found:', [...new Set(prodImgMatches)]);

// Find description block
const descBlock = html.match(/<div[^>]+class=["'][^"']*description-white-block[^"']*["'][\s\S]*?<\/div>/i);
if (descBlock) {
  console.log('\n--- DESCRIPTION BLOCK ---\n', descBlock[0].substring(0, 1000));
}

// Find specs table or params
const tableMatch = html.match(/<table[\s\S]*?<\/table>/gi);
console.log('\nTables found:', tableMatch ? tableMatch.length : 0);
if (tableMatch) {
  console.log(tableMatch[0]);
}

// Find all info blocks
const infoBlocks = [...html.matchAll(/<div[^>]+class=["'][^"']*(info|feature|param|attribute|detail)[^"']*["'][\s\S]*?<\/div>/gi)].map(m => m[0]);
console.log('\nInfo blocks found:', infoBlocks.length);
infoBlocks.slice(0, 3).forEach(b => console.log(b.substring(0, 300)));
