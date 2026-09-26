const fs = require('fs');
const html = fs.readFileSync('scripts/intellcom_test.html', 'utf8');

const hrefMatches = html.match(/href=["']([^"']+)["']/g) || [];
const hrefs = hrefMatches.map(h => h.replace(/^href=["']|["']$/g, ''));

const productLinks = hrefs.filter(h => h.includes('/product/') || h.includes('/products/'));
const catalogLinks = hrefs.filter(h => h.includes('/catalog/'));
const pageLinks = hrefs.filter(h => h.includes('page=') || h.includes('/page/'));

console.log('Product links count (unique):', new Set(productLinks).size);
console.log('Sample product links:', [...new Set(productLinks)].slice(0, 10));
console.log('Catalog links count (unique):', new Set(catalogLinks).size);
console.log('Sample catalog links:', [...new Set(catalogLinks)].slice(0, 15));
console.log('Pagination links:', [...new Set(pageLinks)]);
