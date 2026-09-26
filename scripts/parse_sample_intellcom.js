const fs = require('fs');
const html = fs.readFileSync('scripts/intellcom_product_sample.html', 'utf8');

console.log('--- BREADCRUMB IN PAGE ---');
const breadcrumbBlock = html.match(/<ol[^>]+class=["'][^"']*breadcrumb[^"']*["'][\s\S]*?<\/ol>/i) ||
                        html.match(/<ul[^>]+class=["'][^"']*breadcrumb[^"']*["'][\s\S]*?<\/ul>/i) ||
                        html.match(/<div[^>]+class=["'][^"']*breadcrumb[^"']*["'][\s\S]*?<\/div>/i);
if (breadcrumbBlock) {
  console.log('Breadcrumb Block:', breadcrumbBlock[0]);
}

console.log('--- IMAGES IN PRODUCT PAGE ---');
const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
let m;
while ((m = imgRegex.exec(html)) !== null) {
  console.log(m[0]);
}

console.log('--- PRICE IN PRODUCT PAGE ---');
const priceBlock = html.match(/<div[^>]+class=["'][^"']*price[^"']*["'][\s\S]*?<\/div>/gi);
console.log('Price Blocks:', priceBlock);

console.log('--- SPECIFICATION TABS / BLOCKS ---');
const tabBlocks = [...html.matchAll(/<div[^>]+id=["']tab-([^"']+)["'][\s\S]*?<\/div>/gi)].map(m => ({
  id: m[1],
  content: m[0].substring(0, 300)
}));
console.log('Tab blocks:', tabBlocks);

const allTabs = [...html.matchAll(/class=["'][^"']*(spec|desc|param|charact|feature)[^"']*["']/gi)].map(m => m[0]);
console.log('All spec/desc classes:', [...new Set(allTabs)]);
