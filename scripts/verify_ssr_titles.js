const http = require('http');

http.get('http://localhost:3000/ru/catalog?filter=bestseller', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const regex = /title="([^"]+)"/g;
    let match;
    let count = 0;
    console.log('Sample SSR rendered product titles in Russian (/ru/catalog?filter=bestseller):');
    while ((match = regex.exec(data)) !== null && count < 15) {
      if (!match[1].includes('Избранное') && !match[1].includes('Сравнение')) {
        console.log(`[${++count}] ${match[1]}`);
      }
    }
  });
});
