const fs = require('fs');
const cheerio = require('cheerio');

async function testCrawler() {
  console.log('Testing category list and pagination crawling...');
  
  // 1. Get total pages
  const firstRes = await fetch('https://www.sanotech.ge/products');
  const firstHtml = await firstRes.text();
  const $ = cheerio.load(firstHtml);
  
  let maxPage = 1;
  $('a[href*="page="]').each((i, el) => {
    const m = $(el).attr('href').match(/page=(\d+)/);
    if (m) {
      const p = parseInt(m[1], 10);
      if (p > maxPage) maxPage = p;
    }
  });
  
  console.log(`Max page detected from pagination: ${maxPage}`);
  
  // Extract all categories from header/sidebar
  const catMenu = [];
  $('a[href*="/products/"]').each((i, el) => {
    const name = $(el).text().trim();
    const href = $(el).attr('href');
    if (name && href && !href.includes('?')) {
      catMenu.push({ name, slug: href.split('/products/')[1] || href, href });
    }
  });
  
  // Deduplicate
  const uniqueCats = Array.from(new Map(catMenu.map(c => [c.slug, c])).values());
  console.log(`Categories found: ${uniqueCats.length}`);
  console.log('Sample categories:', uniqueCats.slice(0, 10));
}

testCrawler().catch(console.error);
