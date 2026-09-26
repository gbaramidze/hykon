const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('scripts/sanotech_home.html', 'utf8');
const $ = cheerio.load(html);

console.log('VIEW CATEGORY HTML:');
console.log($('.view-category').html());
