const fs = require('fs');

async function inspectProduct() {
  const prodUrl = 'https://www.sanotech.ge/product/dashvebis-tsertili-kedlebshi-chasashenebeli-hikvision-ds-3wap5112e-ei-wi-fi-5-1200m';
  const res = await fetch(prodUrl);
  const html = await res.text();
  fs.writeFileSync('scripts/sanotech_product_sample.html', html);
  console.log('Saved product sample. Length:', html.length);

  // Check home page for categories
  const homeRes = await fetch('https://www.sanotech.ge');
  const homeHtml = await homeRes.text();
  fs.writeFileSync('scripts/sanotech_home.html', homeHtml);
  console.log('Saved home HTML. Length:', homeHtml.length);
}

inspectProduct().catch(console.error);
