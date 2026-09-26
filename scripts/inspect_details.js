const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('scripts/sanotech_product_sample.html', 'utf8');
const $ = cheerio.load(html);

console.log('=== PRODUCT DETAILS HTML ===');
console.log($('.product-details').html()?.slice(0, 1500));

console.log('=== CATEGORIES / TAGS / SKU IN PRODUCT DETAILS ===');
$('.product-details').find('a, span, p, div').each((i, el) => {
  const text = $(el).text().trim().replace(/\s+/g, ' ');
  const href = $(el).attr('href');
  if (text && text.length < 100) {
    console.log(`${el.tagName} (${$(el).attr('class') || ''}): "${text}" [href: ${href || ''}]`);
  }
});

console.log('=== SLIDER / IMAGES HTML ===');
$('[class*="slider"], [class*="gallery"], [class*="thumb"], [class*="image"]').each((i, el) => {
  const cls = $(el).attr('class');
  const imgs = $(el).find('img').map((_, img) => $(img).attr('src') || $(img).attr('data-src')).get();
  if (imgs.length > 0) {
    console.log(`Class: ${cls}, Images:`, imgs);
  }
});

console.log('=== DESCRIPTION / SPECS HTML ===');
console.log($('.products-description').html()?.slice(0, 1500));
