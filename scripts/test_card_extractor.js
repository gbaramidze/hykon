const fs = require('fs');
const cheerio = require('cheerio');

async function testListingExtractor() {
  const html = fs.readFileSync('scripts/sanotech_page1.html', 'utf8');
  const $ = cheerio.load(html);

  const products = [];
  $('.product-card').each((i, el) => {
    const card = $(el);
    const link = card.find('.title a, .product-thumb a').attr('href') || '';
    const title = card.find('.title a').text().trim() || card.find('.product-thumb img').attr('alt') || '';
    const imgUrl = card.find('.product-thumb img').attr('data-src') || card.find('.product-thumb img').attr('src') || '';
    const priceText = card.find('.price').text().replace(/[^0-9.]/g, '');
    const price = parseFloat(priceText) || 0;
    const descHtml = card.find('.single_content').html() || '';
    const descText = card.find('.single_content').text().trim();
    const dataId = card.find('button[data-id], .addToWishlist').attr('data-id') || `${i + 1}`;

    products.push({
      dataId,
      link,
      title,
      imgUrl,
      price,
      descText: descText.slice(0, 100)
    });
  });

  console.log(`Extracted ${products.length} products from page 1:`);
  console.log(JSON.stringify(products.slice(0, 3), null, 2));
}

testListingExtractor();
