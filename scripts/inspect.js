const fs = require('fs');

async function main() {
  const res = await fetch('https://www.sanotech.ge/products');
  const html = await res.text();
  fs.writeFileSync('scripts/sanotech_page1.html', html);

  console.log('Saved page 1 HTML. Length:', html.length);

  // Check pagination
  const pageMatches = [...html.matchAll(/href="([^"]*page=\d+[^"]*)"/g)];
  console.log('Pagination links found:', pageMatches.map(m => m[1]));

  // Check category links
  const catMatches = [...html.matchAll(/href="([^"]*category[^"]*)"/g)];
  console.log('Category links count:', catMatches.length);
  console.log('Category links sample:', catMatches.slice(0, 10).map(m => m[1]));

  // Check product links
  const prodMatches = [...html.matchAll(/href="([^"]*product\/[^"]*)"/g)];
  console.log('Product links count:', prodMatches.length);
  console.log('Product links sample:', prodMatches.slice(0, 10).map(m => m[1]));
}

main().catch(console.error);
