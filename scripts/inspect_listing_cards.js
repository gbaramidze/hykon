const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('scripts/sanotech_page1.html', 'utf8');
const $ = cheerio.load(html);

console.log('=== PRODUCT CARDS ON LISTING PAGE ===');
$('[class*="product-item"], [class*="product-card"], .single-product, .col-lg-3, .col-md-4, .col-sm-6').slice(0, 3).each((i, el) => {
  console.log(`\n--- Card ${i + 1} Class: ${$(el).attr('class')} ---`);
  console.log($(el).html()?.slice(0, 1000));
});
