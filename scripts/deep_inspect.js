const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('scripts/sanotech_product_sample.html', 'utf8');
const $ = cheerio.load(html);

console.log('--- ALL H-TAGS ---');
$('h1, h2, h3, h4, h5, h6').each((i, el) => {
  console.log(el.tagName, $(el).text().trim().replace(/\s+/g, ' '));
});

console.log('--- ALL TABLES OR LISTS ---');
$('table').each((i, el) => {
  console.log('TABLE:', $(el).text().trim().replace(/\s+/g, ' ').slice(0, 200));
});

console.log('--- PRODUCT INFO SECTIONS ---');
$('[class*="product"], [class*="detail"], [class*="info"], [class*="desc"]').each((i, el) => {
  const cls = $(el).attr('class');
  const txt = $(el).text().trim().replace(/\s+/g, ' ').slice(0, 100);
  if (cls && !cls.includes('container') && !cls.includes('row') && !cls.includes('col') && txt.length > 10) {
    console.log(`Class: ${cls} -> ${txt}`);
  }
});
