const fs = require('fs');
const cheerio = require('cheerio');

// Inspect Home Categories
const homeHtml = fs.readFileSync('scripts/sanotech_home.html', 'utf8');
const $home = cheerio.load(homeHtml);

console.log('=== CATEGORIES ON HOME / NAV ===');
const categories = [];
$home('a[href*="/category/"], a[href*="/products?category"], nav a, .category, .categories').each((i, el) => {
  const text = $home(el).text().trim();
  const href = $home(el).attr('href');
  if (href && text) {
    categories.push({ text, href });
  }
});
console.log('Found potential cat links:', categories.slice(0, 20));

// Check any navigation dropdowns or sidebar in home/page1
console.log('=== PRODUCT SAMPLE ===');
const prodHtml = fs.readFileSync('scripts/sanotech_product_sample.html', 'utf8');
const $prod = cheerio.load(prodHtml);

console.log('Title:', $prod('h1').text().trim());
console.log('Price:', $prod('.price, [class*="price"]').text().trim());
console.log('Breadcrumbs:', $prod('.breadcrumb, [class*="breadcrumb"], nav[aria-label="breadcrumb"]').text().trim());

const breadcrumbItems = [];
$prod('nav[aria-label="breadcrumb"] a, .breadcrumb a, ol.breadcrumb li, ul.breadcrumb li').each((i, el) => {
  breadcrumbItems.push({ text: $prod(el).text().trim(), href: $prod(el).find('a').attr('href') || $prod(el).attr('href') });
});
console.log('Breadcrumb details:', breadcrumbItems);

const images = [];
$prod('img').each((i, el) => {
  const src = $prod(el).attr('src') || $prod(el).attr('data-src');
  if (src && (src.includes('/product') || src.includes('/upload') || src.includes('/storage') || src.includes('/media') || src.includes('sanotech'))) {
    images.push(src);
  }
});
console.log('Images found:', [...new Set(images)]);

console.log('=== PAGE 1 PRODUCTS LISTING ===');
const page1Html = fs.readFileSync('scripts/sanotech_page1.html', 'utf8');
const $page1 = cheerio.load(page1Html);

const prodsOnPage1 = [];
$page1('a[href*="/product/"]').each((i, el) => {
  prodsOnPage1.push($page1(el).attr('href'));
});
console.log('Unique product URLs on page 1:', [...new Set(prodsOnPage1)].length);
console.log('Sample product URLs:', [...new Set(prodsOnPage1)].slice(0, 5));
