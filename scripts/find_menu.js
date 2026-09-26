const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('scripts/sanotech_home.html', 'utf8');
const $ = cheerio.load(html);

$('[class*="category"], [class*="menu"]').each((i, el) => {
  const cls = $(el).attr('class');
  const links = $(el).find('a').length;
  if (links > 5) {
    console.log(`Class: ${cls}, Link count: ${links}`);
  }
});
