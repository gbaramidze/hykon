const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('scripts/sanotech_home.html', 'utf8');
const $ = cheerio.load(html);

const categoryTree = [];

$('.category-dropdown > ul > li').each((i, el) => {
  const topLink = $(el).children('a');
  const topName = topLink.text().trim().replace(/\s+/g, ' ');
  const topHref = topLink.attr('href') || '';
  const topSlug = topHref.split('/products/')[1] || topHref;
  
  if (!topName) return;

  const topCat = {
    id: `cat-root-${i + 1}`,
    name: topName,
    slug: topSlug,
    href: topHref,
    level: 1,
    children: []
  };

  // Check subcategories in mega menu or sub-menu
  $(el).find('.categories__mega-menu-list, .sub-menu').each((subI, subEl) => {
    // Check if there is a heading or category group
    const heading = $(subEl).find('h5, .mega-menu-title, h6').text().trim();
    
    $(subEl).find('li a, a').each((linkI, aEl) => {
      const subName = $(aEl).text().trim().replace(/\s+/g, ' ');
      const subHref = $(aEl).attr('href') || '';
      const subSlug = subHref.split('/products/')[1] || subHref;
      
      if (subName && subHref && subSlug !== topSlug && !topCat.children.some(c => c.slug === subSlug)) {
        topCat.children.push({
          id: `cat-sub-${i + 1}-${topCat.children.length + 1}`,
          name: subName,
          slug: subSlug,
          href: subHref,
          parentId: topCat.id,
          group: heading || null,
          level: 2
        });
      }
    });
  });

  categoryTree.push(topCat);
});

console.log('Extracted Root Categories:', categoryTree.length);
categoryTree.forEach(c => {
  console.log(`- [${c.slug}] ${c.name} (${c.children.length} subcategories)`);
  if (c.children.length > 0) {
    c.children.slice(0, 3).forEach(sub => console.log(`   -> [${sub.slug}] ${sub.name}`));
  }
});

fs.writeFileSync('scripts/category_tree.json', JSON.stringify(categoryTree, null, 2));
