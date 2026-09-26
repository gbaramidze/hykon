const fs = require('fs');

function unescapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
}

const products = JSON.parse(fs.readFileSync('src/data/sanotech_products.json', 'utf8'));

console.log('Cleaning and unescaping HTML in', products.length, 'products...');

products.forEach(p => {
  if (p.fullDescription) {
    p.fullDescription = unescapeHtml(p.fullDescription);
  }
  if (p.shortDescription) {
    // If shortDescription has broken HTML or starts with <h3>, make a clean plain text snippet
    const unescapedShort = unescapeHtml(p.shortDescription);
    const plain = stripHtml(unescapedShort);
    p.shortDescription = plain.slice(0, 240) + (plain.length > 240 ? '...' : '');
  }
});

fs.writeFileSync('src/data/sanotech_products.json', JSON.stringify(products, null, 2));
console.log('Finished updating sanotech_products.json with unescaped HTML.');
