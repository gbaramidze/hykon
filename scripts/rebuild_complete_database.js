const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

function decodeEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&bull;/g, '•')
    .replace(/&deg;/g, '°')
    .replace(/&times;/g, '×')
    .replace(/&plusmn;/g, '±')
    .replace(/&middot;/g, '·');
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u10A0-\u10FF-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function detectBrand(title) {
  const t = (title || '').toLowerCase();
  if (t.includes('hikvision')) return 'Hikvision';
  if (t.includes('hiwatch')) return 'HiWatch';
  if (t.includes('hilook')) return 'HiLook';
  if (t.includes('dahua')) return 'Dahua';
  if (t.includes('imou')) return 'Imou';
  if (t.includes('uniview') || t.includes('unv')) return 'Uniview';
  if (t.includes('ezviz')) return 'EZVIZ';
  if (t.includes('ubiquiti') || t.includes('unifi')) return 'Ubiquiti';
  if (t.includes('mikrotik')) return 'MikroTik';
  if (t.includes('ruijie') || t.includes('reyee')) return 'Ruijie';
  if (t.includes('tp-link') || t.includes('tplink')) return 'TP-Link';
  if (t.includes('cisco')) return 'Cisco';
  if (t.includes('seagate')) return 'Seagate';
  if (t.includes('western digital') || t.includes('wd ') || t.includes('wd_') || t.includes('wd-')) return 'Western Digital';
  if (t.includes('tiandy')) return 'Tiandy';
  if (t.includes('ajax')) return 'Ajax';
  if (t.includes('zkteco')) return 'ZKTeco';
  if (t.includes('draytek')) return 'DrayTek';
  if (t.includes('paradox')) return 'Paradox';
  if (t.includes('commax')) return 'Commax';
  if (t.includes('kstar')) return 'KSTAR';
  if (t.includes('leoch')) return 'Leoch';
  if (t.includes('dsppa')) return 'DSPPA';
  if (t.includes('draka')) return 'Draka';
  return 'Hykon';
}

function classifyProduct(title, sku) {
  const t = ((title || '') + ' ' + (sku || '')).toLowerCase();

  // Alarms
  if (t.includes('ajax') || t.includes('paradox') || t.includes('დეტექტორი') || t.includes('სირენა') || t.includes('სიგნალიზაცია') || t.includes('sensor') || t.includes('hub 2') || t.includes('motionprotect') || t.includes('doorprotect')) {
    return {
      categoryId: 'cat-alarms',
      categoryPath: [
        { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
        { id: 'cat-alarms', name: 'დაცვითი სიგნალიზაცია (Ajax / Paradox)', slug: 'დაცვითი-სიგნალიზაცია' }
      ]
    };
  }

  // Intercom / Access Control / Barriers
  if (t.includes('დომოფონი') || t.includes('დაშვებ') || t.includes('zkteco') || t.includes('საკეტი') || t.includes('ბარათი') || t.includes('intercom') || t.includes('შლაგბაუმ') || t.includes('ტურნიკეტ')) {
    return {
      categoryId: 'cat-access-control',
      categoryPath: [
        { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
        { id: 'cat-access-control', name: 'დაშვების კონტროლი და დომოფონები', slug: 'დაშვების-კონტროლი' }
      ]
    };
  }

  // Storage
  if (t.includes('hdd') || t.includes('seagate') || t.includes('skyhawk') || t.includes('wd purple') || t.includes('მყარი დისკი') || t.includes('მეხსიერების ბარათი') || t.includes('micro sd') || t.includes('ssd')) {
    return {
      categoryId: 'cat-storage',
      categoryPath: [
        { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
        { id: 'cat-storage', name: 'მყარი დისკები და მეხსიერება', slug: 'მყარი-დისკები' }
      ]
    };
  }

  // Power
  if (t.includes('კვების ბლოკი') || t.includes('ადაპტერი') || t.includes('power supply') || t.includes('12v') || t.includes('კვება') || t.includes('battery') || t.includes('ups') || t.includes('აკუმულატორ')) {
    return {
      categoryId: 'cat-power-cctv',
      categoryPath: [
        { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
        { id: 'cat-cctv', name: 'ვიდეო მეთვალყურეობა', slug: 'ვიდეო-მეთვალყურეობა' },
        { id: 'cat-power-cctv', name: 'კვების ბლოკები და PoE', slug: 'კვების-ბლოკები' }
      ]
    };
  }

  // Brackets
  if (t.includes('სამაგრი') || t.includes('კრონშტეინი') || t.includes('ყუთი') || t.includes('bracket') || t.includes('junction') || t.includes('მონტაჟ') || t.includes('კარადა')) {
    return {
      categoryId: 'cat-brackets',
      categoryPath: [
        { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
        { id: 'cat-cctv', name: 'ვიდეო მეთვალყურეობა', slug: 'ვიდეო-მეთვალყურეობა' },
        { id: 'cat-brackets', name: 'სამაგრები და აქსესუარები', slug: 'სამაგრები-და-აქსესუარები' }
      ]
    };
  }

  // NVR
  if (t.includes('nvr') || t.includes('ქსელური ჩამწერ') || t.includes('ip ვიდეო ჩამწერ') || t.includes('ip-ვიდეო-ჩამწერ')) {
    return {
      categoryId: 'cat-nvr',
      categoryPath: [
        { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
        { id: 'cat-cctv', name: 'ვიდეო მეთვალყურეობა', slug: 'ვიდეო-მეთვალყურეობა' },
        { id: 'cat-nvr', name: 'IP ვიდეო-ჩამწერები (NVR)', slug: 'ip-ვიდეო-ჩამწერები-nvr' }
      ]
    };
  }

  // DVR
  if (t.includes('dvr') || t.includes('xvr') || t.includes('ანალოგური ჩამწერ') || t.includes('turbo hd ჩამწერ')) {
    return {
      categoryId: 'cat-dvr',
      categoryPath: [
        { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
        { id: 'cat-cctv', name: 'ვიდეო მეთვალყურეობა', slug: 'ვიდეო-მეთვალყურეობა' },
        { id: 'cat-dvr', name: 'ანალოგური ვიდეო-ჩამწერები (DVR/XVR)', slug: 'ანალოგური-ვიდეო-ჩამწერები-dvr' }
      ]
    };
  }

  // Switches
  if (t.includes('სვიჩ') || t.includes('switch') || t.includes('კომუტატორ')) {
    return {
      categoryId: 'cat-switches',
      categoryPath: [
        { id: 'cat-network-root', name: 'ქსელური მოწყობილობები', slug: 'ქსელური-მოწყობილობები' },
        { id: 'cat-switches', name: 'PoE და ქსელური სვიჩები', slug: 'poe-სვიჩები' }
      ]
    };
  }

  // Routers / WiFi
  if (t.includes('როუტერ') || t.includes('router') || t.includes('access point') || t.includes('wi-fi') || t.includes('wifi') || t.includes('unifi') || t.includes('mikrotik') || t.includes('ruijie')) {
    return {
      categoryId: 'cat-routers',
      categoryPath: [
        { id: 'cat-network-root', name: 'ქსელური მოწყობილობები', slug: 'ქსელური-მოწყობილობები' },
        { id: 'cat-routers', name: 'როუტერები და Wi-Fi წერტილები', slug: 'როუტერები-და-wifi' }
      ]
    };
  }

  // Cables
  if (t.includes('კაბელ') || t.includes('cable') || t.includes('utp') || t.includes('ftp') || t.includes('rj45') || t.includes('ოპტიკ')) {
    return {
      categoryId: 'cat-cables',
      categoryPath: [
        { id: 'cat-network-root', name: 'ქსელური მოწყობილობები', slug: 'ქსელური-მოწყობილობები' },
        { id: 'cat-cables', name: 'კაბელები და კონექტორები', slug: 'კაბელები-და-აქსესუარები' }
      ]
    };
  }

  // Analog Cameras
  if (t.includes('ანალოგურ') || t.includes('turbo hd') || t.includes('tvi') || t.includes('thc-') || t.includes('ds-2ce')) {
    return {
      categoryId: 'cat-analog-cameras',
      categoryPath: [
        { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
        { id: 'cat-cctv', name: 'ვიდეო მეთვალყურეობა', slug: 'ვიდეო-მეთვალყურეობა' },
        { id: 'cat-analog-cameras', name: 'ანალოგური / HD-TVI კამერები', slug: 'ანალოგური-კამერები' }
      ]
    };
  }

  // Default IP Cameras
  return {
    categoryId: 'cat-ip-cameras',
    categoryPath: [
      { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
      { id: 'cat-cctv', name: 'ვიდეო მეთვალყურეობა', slug: 'ვიდეო-მეთვალყურეობა' },
      { id: 'cat-ip-cameras', name: 'IP კამერები', slug: 'ip-კამერები' }
    ]
  };
}

function findLocalImageForSanotech(raw) {
  if (!raw.imgUrl) return '/images/placeholder.svg';
  
  try {
    const ext = (path.extname(new URL(raw.imgUrl).pathname) || '.png').split('?')[0];
    const safeSlug = raw.slug.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 35);
    const hash = crypto.createHash('md5').update(raw.imgUrl).digest('hex').slice(0, 8);
    const filename = `${safeSlug}-${hash}${ext}`;
    const filePath = path.join(IMAGES_DIR, filename);
    
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 100) {
      return `/images/products/${filename}`;
    }
  } catch (e) {}

  // Fallback check if any file in IMAGES_DIR starts with safeSlug
  try {
    const safeSlug = raw.slug.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 25);
    const allFiles = fs.readdirSync(IMAGES_DIR);
    const match = allFiles.find(f => f.startsWith(safeSlug));
    if (match) {
      return `/images/products/${match}`;
    }
  } catch (e) {}

  return '/images/placeholder.svg';
}

function main() {
  console.log('=== REBUILDING COMPLETE UNIFIED CATALOG (SANOTECH + INTELLCOM) ===');

  // 1. Process Sanotech raw products (1044 items)
  const sanotechRaw = JSON.parse(fs.readFileSync('scripts/raw_scraped_products.json', 'utf8'));
  console.log(`Processing ${sanotechRaw.length} Sanotech products...`);

  const sanotechProducts = sanotechRaw.map((raw, idx) => {
    const brand = detectBrand(raw.title + ' ' + raw.slug);
    const sku = `ST-${raw.dataId || (10000 + idx)}`;
    const { categoryId, categoryPath } = classifyProduct(raw.title, sku);
    const imagePath = findLocalImageForSanotech(raw);
    const desc = decodeEntities(raw.descHtml || `<p>${raw.title}</p>`);

    const hasDiscount = idx % 4 === 0;
    const price = raw.price || 99;
    const oldPrice = hasDiscount ? Math.round(price * 1.15) : undefined;

    return {
      id: `prod-st-${idx + 1}`,
      title: raw.title,
      slug: `${raw.slug}-${raw.dataId || idx}`.replace(/-+/g, '-'),
      sku,
      brand,
      categoryId,
      categoryPath,
      price,
      oldPrice,
      inStock: true,
      stockCount: Math.floor(Math.random() * 15) + 3,
      rating: Number((4.6 + Math.random() * 0.4).toFixed(1)),
      reviewsCount: Math.floor(Math.random() * 10) + 1,
      isNew: idx % 8 === 0,
      isBestseller: idx % 6 === 0,
      images: [imagePath],
      thumbnail: imagePath,
      shortDescription: raw.title,
      description: desc,
      specGroups: [
        {
          group: 'ძირითადი მახასიათებლები',
          items: [
            { name: 'ბრენდი', value: brand },
            { name: 'არტიკული (SKU)', value: sku },
            { name: 'გარანტია', value: '2 წელი' },
            { name: 'სტატუსი', value: 'მარაგშია' }
          ]
        }
      ],
      createdAt: new Date().toISOString()
    };
  });

  // 2. Process Intellcom products (440 items)
  const intellcomRaw = JSON.parse(fs.readFileSync('scripts/intellcom_products.json', 'utf8'));
  console.log(`Processing ${intellcomRaw.length} Intellcom products...`);

  const intellcomProducts = intellcomRaw.map((raw, idx) => {
    const brand = detectBrand(raw.title + ' ' + (raw.brand || ''));
    const sku = raw.sku || `INT-${1000 + idx}`;
    const { categoryId, categoryPath } = classifyProduct(raw.title, sku);
    const desc = decodeEntities(raw.description || `<p>${raw.title}</p>`);

    let imgs = raw.images && raw.images.length > 0 ? raw.images : ['/images/placeholder.svg'];
    let thumb = raw.thumbnail || imgs[0] || '/images/placeholder.svg';

    return {
      id: `prod-int-${idx + 1}`,
      title: raw.title,
      slug: raw.slug || `int-${slugify(raw.title)}-${idx}`,
      sku,
      model: raw.model || sku,
      brand,
      categoryId,
      categoryPath,
      price: raw.price || 99,
      oldPrice: raw.oldPrice,
      inStock: true,
      stockCount: Math.floor(Math.random() * 15) + 3,
      rating: Number((4.6 + Math.random() * 0.4).toFixed(1)),
      reviewsCount: Math.floor(Math.random() * 10) + 1,
      isNew: idx % 7 === 0,
      isBestseller: idx % 5 === 0,
      images: imgs,
      thumbnail: thumb,
      shortDescription: raw.title,
      description: desc,
      specGroups: raw.specGroups || [
        {
          group: 'ძირითადი მახასიათებლები',
          items: [
            { name: 'ბრენდი', value: brand },
            { name: 'მოდელი', value: raw.model || sku },
            { name: 'გარანტია', value: '2 წელი' }
          ]
        }
      ],
      createdAt: new Date().toISOString()
    };
  });

  // 3. Combine ALL products: 1044 Sanotech + 440 Intellcom = 1484 items
  const combinedProducts = [...sanotechProducts, ...intellcomProducts];
  console.log(`\n=== TOTAL PRODUCTS IN HYKON: ${combinedProducts.length} ===`);
  console.log(`- Sanotech: ${sanotechProducts.length}`);
  console.log(`- Intellcom: ${intellcomProducts.length}`);

  // 4. Build Category Tree with actual product counts
  const CATEGORIES = [
    { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები', level: 1, icon: 'ShieldCheck' },
    { id: 'cat-network-root', name: 'ქსელური მოწყობილობები', slug: 'ქსელური-მოწყობილობები', level: 1, icon: 'Laptop' },
    
    { id: 'cat-cctv', name: 'ვიდეო მეთვალყურეობა', slug: 'ვიდეო-მეთვალყურეობა', parentId: 'cat-security', level: 2 },
    { id: 'cat-alarms', name: 'დაცვითი სიგნალიზაცია (Ajax / Paradox)', slug: 'დაცვითი-სიგნალიზაცია', parentId: 'cat-security', level: 2 },
    { id: 'cat-access-control', name: 'დაშვების კონტროლი და დომოფონები', slug: 'დაშვების-კონტროლი', parentId: 'cat-security', level: 2 },
    { id: 'cat-storage', name: 'მყარი დისკები და მეხსიერება', slug: 'მყარი-დისკები', parentId: 'cat-security', level: 2 },

    { id: 'cat-ip-cameras', name: 'IP კამერები', slug: 'ip-კამერები', parentId: 'cat-cctv', level: 3 },
    { id: 'cat-analog-cameras', name: 'ანალოგური / HD-TVI კამერები', slug: 'ანალოგური-კამერები', parentId: 'cat-cctv', level: 3 },
    { id: 'cat-nvr', name: 'IP ვიდეო-ჩამწერები (NVR)', slug: 'ip-ვიდეო-ჩამწერები-nvr', parentId: 'cat-cctv', level: 3 },
    { id: 'cat-dvr', name: 'ანალოგური ვიდეო-ჩამწერები (DVR/XVR)', slug: 'ანალოგური-ვიდეო-ჩამწერები-dvr', parentId: 'cat-cctv', level: 3 },
    { id: 'cat-power-cctv', name: 'კვების ბლოკები და PoE', slug: 'კვების-ბლოკები', parentId: 'cat-cctv', level: 3 },
    { id: 'cat-brackets', name: 'სამაგრები და აქსესუარები', slug: 'სამაგრები-და-აქსესუარები', parentId: 'cat-cctv', level: 3 },

    { id: 'cat-switches', name: 'PoE და ქსელური სვიჩები', slug: 'poe-სვიჩები', parentId: 'cat-network-root', level: 2 },
    { id: 'cat-routers', name: 'როუტერები და Wi-Fi წერტილები', slug: 'როუტერები-და-wifi', parentId: 'cat-network-root', level: 2 },
    { id: 'cat-cables', name: 'კაბელები და კონექტორები', slug: 'კაბელები-და-აქსესუარები', parentId: 'cat-network-root', level: 2 },
  ];

  const getDescendantIds = (catId) => {
    const ids = new Set([catId]);
    const findChildren = (pId) => {
      const children = CATEGORIES.filter(c => c.parentId === pId);
      children.forEach(ch => {
        ids.add(ch.id);
        findChildren(ch.id);
      });
    };
    findChildren(catId);
    return ids;
  };

  CATEGORIES.forEach(cat => {
    const descendantIds = getDescendantIds(cat.id);
    let count = 0;
    for (const prod of combinedProducts) {
      if (descendantIds.has(prod.categoryId)) {
        count++;
      } else if (prod.categoryPath && prod.categoryPath.some(cp => descendantIds.has(cp.id))) {
        count++;
      }
    }
    cat.productCount = count;
  });

  const populatedCategories = CATEGORIES.filter(c => c.productCount > 0);
  console.log('\n--- POPULATED CATEGORIES ---');
  populatedCategories.forEach(c => console.log(`[L${c.level}] ${c.name}: ${c.productCount} products`));

  // 5. Build Brands
  const brandsMap = new Map();
  for (const prod of combinedProducts) {
    const brandName = prod.brand.trim();
    const brandSlug = slugify(brandName);
    if (!brandsMap.has(brandSlug)) {
      brandsMap.set(brandSlug, {
        id: `brand-${brandSlug}`,
        name: brandName,
        slug: brandSlug,
        productCount: 0,
        logo: '',
        description: `${brandName} official distributor`,
        country: 'Global'
      });
    }
    brandsMap.get(brandSlug).productCount++;
  }

  const allBrands = Array.from(brandsMap.values()).sort((a, b) => b.productCount - a.productCount);
  console.log('\n--- BRANDS BREAKDOWN ---');
  allBrands.forEach(b => console.log(`${b.name}: ${b.productCount} products`));

  // 6. Save JSON files
  fs.writeFileSync('src/data/products.json', JSON.stringify(combinedProducts, null, 2), 'utf8');
  fs.writeFileSync('src/data/categories.json', JSON.stringify(populatedCategories, null, 2), 'utf8');
  fs.writeFileSync('src/data/brands.json', JSON.stringify(allBrands, null, 2), 'utf8');

  console.log('\nSuccessfully written all data files!');
}

main();
