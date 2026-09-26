const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('scripts/sanotech_page1.html', 'utf8');
const $ = cheerio.load(html);

console.log($('.product-card').first().html());
