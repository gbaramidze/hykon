const fs = require('fs');
const cheerio = require('cheerio');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function collectAllUrls() {
  const allProductUrls = new Set();
  const baseUrl = 'https://www.sanotech.ge/products';
  
  console.log('Collecting product URLs across all pages...');
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = page === 1 ? baseUrl : `${baseUrl}?page=${page}`;
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!res.ok) {
        console.log(`Page ${page} returned status ${res.status}. Stopping pagination.`);
        break;
      }
      
      const html = await res.text();
      const $ = cheerio.load(html);
      
      let pageProds = 0;
      $('a[href*="/product/"]').each((i, el) => {
        let href = $(el).attr('href');
        if (href) {
          if (!href.startsWith('http')) {
            href = 'https://www.sanotech.ge' + (href.startsWith('/') ? '' : '/') + href;
          }
          // Remove query params or hashes
          href = href.split('?')[0].split('#')[0];
          if (!allProductUrls.has(href)) {
            allProductUrls.add(href);
            pageProds++;
          }
        }
      });

      console.log(`Page ${page}: found ${pageProds} new product URLs (Total so far: ${allProductUrls.size})`);

      if (pageProds === 0 || page >= 50) {
        hasMore = false;
      } else {
        page++;
        await sleep(150); // Be respectful with slight throttle
      }
    } catch (err) {
      console.error(`Error fetching page ${page}:`, err.message);
      break;
    }
  }

  const urlList = Array.from(allProductUrls);
  console.log(`\nFinished! Collected a total of ${urlList.length} unique products.`);
  fs.writeFileSync('scripts/all_product_urls.json', JSON.stringify(urlList, null, 2));
}

collectAllUrls().catch(console.error);
