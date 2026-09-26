const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('scripts/sanotech_home.html', 'utf8');
const $ = cheerio.load(html);

console.log('=== CATEGORY MEGA MENU / SIDEBAR STRUCTURE ===');
$('.all-categories, .category-menu, .sub-category, .categories-menu, .sidebar-menu, nav, .header-bottom, .category-list').each((i, el) => {
  console.log('Found Container Class:', $(el).attr('class'));
});

// Let's find elements containing 'ვიდეო მეთვალყურეობა'
$('*').filter((i, el) => {
  return $(el).children().length > 0 && $(el).text().includes('ვიდეო მეთვალყურეობა') && $(el).find('ul, li').length > 5;
}).slice(0, 5).each((i, el) => {
  console.log('--- Matching Container ---', el.tagName, $(el).attr('class'));
  console.log($(el).html()?.slice(0, 1000));
});
