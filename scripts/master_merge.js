const fs = require('fs');

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

function run() {
  const initialProds = JSON.parse(fs.readFileSync('scripts/initial_products.json', 'utf8'));
  const initialCats = JSON.parse(fs.readFileSync('scripts/initial_categories.json', 'utf8'));
  const initialBrands = JSON.parse(fs.readFileSync('scripts/initial_brands.json', 'utf8'));

  const sanotechProducts = JSON.parse(fs.readFileSync('scripts/raw_scraped_products.json', 'utf8'));
  const intellcomProducts = JSON.parse(fs.readFileSync('scripts/intellcom_products.json', 'utf8'));

  const decodeEntities = (str) => {
    if (!str) return '';
    return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&bull;/g, '•')
      .replace(/&deg;/g, '°');
  };

  // Brand detector for security products
  const detectBrand = (title, currentBrand) => {
    const t = title.toLowerCase();
    if (t.includes('apple')) return 'Apple';
    if (t.includes('asus') || t.includes('rog')) return 'ASUS';
    if (t.includes('sony')) return 'Sony';
    if (t.includes('samsung')) return 'Samsung';
    if (t.includes('lg')) return 'LG';
    if (t.includes('dyson')) return 'Dyson';
    if (t.includes('dji')) return 'DJI';
    if (t.includes('keychron')) return 'Keychron';
    if (t.includes('nvidia') || t.includes('geforce')) return 'NVIDIA';

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
    
    if (currentBrand && currentBrand !== 'Other') return currentBrand;
    return 'Hykon';
  };

  // Security category classifier
  const classifySecurityProduct = (p) => {
    const t = (p.title + ' ' + (p.sku || '') + ' ' + (p.shortDescription || '')).toLowerCase();

    // Alarms (Ajax / Paradox)
    if (t.includes('ajax') || t.includes('paradox') || t.includes('დეტექტორი') || t.includes('სირენა') || t.includes('სიგნალიზაცია') || t.includes('sensor') || t.includes('hub 2') || t.includes('motionprotect') || t.includes('doorprotect')) {
      return {
        categoryId: 'cat-alarms',
        categoryPath: [
          { id: 'cat-security', name: 'Системы безопасности / უსაფრთხოება', slug: 'security-systems' },
          { id: 'cat-alarms', name: 'Сигнализация (Ajax / Paradox)', slug: 'alarms' }
        ]
      };
    }

    // Intercom / Access Control
    if (t.includes('დომოფონი') || t.includes('დაშვებ') || t.includes('zkteco') || t.includes('საკეტი') || t.includes('ბარათი') || t.includes('intercom') || t.includes('reader')) {
      return {
        categoryId: 'cat-access-control',
        categoryPath: [
          { id: 'cat-security', name: 'Системы безопасности / უსაფრთხოება', slug: 'security-systems' },
          { id: 'cat-access-control', name: 'Домофоны и Контроль доступа', slug: 'access-control' }
        ]
      };
    }

    // Storage (HDD / SSD / SD)
    if (t.includes('hdd') || t.includes('seagate') || t.includes('skyhawk') || t.includes('wd purple') || t.includes('მყარი დისკი') || t.includes('მეხსიერების ბარათი') || t.includes('micro sd') || t.includes('ssd')) {
      return {
        categoryId: 'cat-storage',
        categoryPath: [
          { id: 'cat-security', name: 'Системы безопасности / უსაფრთხოება', slug: 'security-systems' },
          { id: 'cat-storage', name: 'Жесткие диски и Память (HDD / SSD)', slug: 'storage' }
        ]
      };
    }

    // Power
    if (t.includes('კვების ბლოკი') || t.includes('ადაპტერი') || t.includes('power supply') || t.includes('12v') || t.includes('კვება') || t.includes('battery')) {
      return {
        categoryId: 'cat-power-cctv',
        categoryPath: [
          { id: 'cat-security', name: 'Системы безопасности / უსაფრთხოება', slug: 'security-systems' },
          { id: 'cat-cctv', name: 'Видеонаблюдение / ვიდეო მეთვალყურეობა', slug: 'video-surveillance' },
          { id: 'cat-power-cctv', name: 'Блоки питания и PoE', slug: 'power-supplies' }
        ]
      };
    }

    // Brackets
    if (t.includes('სამაგრი') || t.includes('კრონშტეინი') || t.includes('ყუთი') || t.includes('bracket') || t.includes('junction') || t.includes('მონტაჟ')) {
      return {
        categoryId: 'cat-brackets',
        categoryPath: [
          { id: 'cat-security', name: 'Системы безопасности / უსაფრთხოება', slug: 'security-systems' },
          { id: 'cat-cctv', name: 'Видеонаблюдение / ვიდეო მეთვალყურეობა', slug: 'video-surveillance' },
          { id: 'cat-brackets', name: 'Кронштейны и Аксессуары', slug: 'brackets' }
        ]
      };
    }

    // NVR
    if (t.includes('nvr') || t.includes('ქსელური ჩამწერ') || t.includes('ip ვიდეო ჩამწერ')) {
      return {
        categoryId: 'cat-nvr',
        categoryPath: [
          { id: 'cat-security', name: 'Системы безопасности / უსაფრთხოება', slug: 'security-systems' },
          { id: 'cat-cctv', name: 'Видеонаблюдение / ვიდეო მეთვალყურეობა', slug: 'video-surveillance' },
          { id: 'cat-nvr', name: 'IP видеорегистраторы (NVR)', slug: 'nvr' }
        ]
      };
    }

    // DVR
    if (t.includes('dvr') || t.includes('xvr') || t.includes('ანალოგური ჩამწერ') || t.includes('turbo hd ჩამწერ')) {
      return {
        categoryId: 'cat-dvr',
        categoryPath: [
          { id: 'cat-security', name: 'Системы безопасности / უსაფრთხოება', slug: 'security-systems' },
          { id: 'cat-cctv', name: 'Видеонаблюдение / ვიდეო მეთვალყურეობა', slug: 'video-surveillance' },
          { id: 'cat-dvr', name: 'Аналоговые видеорегистраторы (DVR/XVR)', slug: 'dvr' }
        ]
      };
    }

    // Switches
    if (t.includes('სვიჩ') || t.includes('switch') || t.includes('კომუტატორ')) {
      return {
        categoryId: 'cat-switches',
        categoryPath: [
          { id: 'cat-network-root', name: 'Сетевое оборудование / ქსელი', slug: 'network' },
          { id: 'cat-switches', name: 'PoE и Сетевые коммутаторы', slug: 'switches' }
        ]
      };
    }

    // Routers / WiFi
    if (t.includes('როუტერ') || t.includes('router') || t.includes('access point') || t.includes('wi-fi') || t.includes('wifi') || t.includes('unifi') || t.includes('mikrotik') || t.includes('ruijie')) {
      return {
        categoryId: 'cat-routers',
        categoryPath: [
          { id: 'cat-network-root', name: 'Сетевое оборудование / ქსელი', slug: 'network' },
          { id: 'cat-routers', name: 'Маршрутизаторы и Wi-Fi точки', slug: 'routers' }
        ]
      };
    }

    // Cables
    if (t.includes('კაბელ') || t.includes('cable') || t.includes('utp') || t.includes('ftp') || t.includes('rj45')) {
      return {
        categoryId: 'cat-cables',
        categoryPath: [
          { id: 'cat-network-root', name: 'Сетевое оборудование / ქსელი', slug: 'network' },
          { id: 'cat-cables', name: 'Кабели и Патч-корды', slug: 'cables' }
        ]
      };
    }

    // Analog Cameras
    if (t.includes('ანალოგურ') || t.includes('turbo hd') || t.includes('tvi') || t.includes('thc-') || t.includes('ds-2ce')) {
      return {
        categoryId: 'cat-analog-cameras',
        categoryPath: [
          { id: 'cat-security', name: 'Системы безопасности / უსაფრთხოება', slug: 'security-systems' },
          { id: 'cat-cctv', name: 'Видеонаблюдение / ვიდეო მეთვალყურეობა', slug: 'video-surveillance' },
          { id: 'cat-analog-cameras', name: 'Аналоговые / HD-TVI камеры', slug: 'analog-cameras' }
        ]
      };
    }

    // Default IP Cameras
    return {
      categoryId: 'cat-ip-cameras',
      categoryPath: [
        { id: 'cat-security', name: 'Системы безопасности / უსაფრთხოება', slug: 'security-systems' },
        { id: 'cat-cctv', name: 'Видеонаблюдение / ვიდეო მეთვალყურეობა', slug: 'video-surveillance' },
        { id: 'cat-ip-cameras', name: 'IP камеры видеонаблюдения', slug: 'ip-cameras' }
      ]
    };
  };

  // Prepare security products
  const securityProducts = [...sanotechProducts, ...intellcomProducts];
  for (const p of securityProducts) {
    p.brand = detectBrand(p.title, p.brand);
    p.description = decodeEntities(p.description);
    const { categoryId, categoryPath } = classifySecurityProduct(p);
    p.categoryId = categoryId;
    p.categoryPath = categoryPath;
    if (!p.images || p.images.length === 0) p.images = ['/images/placeholder.svg'];
    if (!p.thumbnail) p.thumbnail = p.images[0];
  }

  // Combined all products: Initial Flagship Consumer Tech FIRST + Security Products
  const allProducts = [...initialProds, ...securityProducts];
  console.log(`Total Products: ${allProducts.length} (${initialProds.length} flagship consumer tech + ${securityProducts.length} security items)`);

  // Build unified categories
  const categoriesMap = new Map();

  // Add initial categories
  initialCats.forEach(c => categoriesMap.set(c.id, c));

  // Add security categories
  const SECURITY_CATS = [
    { id: 'cat-security', name: 'Системы безопасности / უსაფრთხოება', slug: 'security-systems', level: 1, icon: 'ShieldCheck' },
    { id: 'cat-network-root', name: 'Сетевое оборудование / ქსელი', slug: 'network', level: 1, icon: 'Laptop' },
    
    { id: 'cat-cctv', name: 'Видеонаблюдение / ვიდეო მეთვალყურეობა', slug: 'video-surveillance', parentId: 'cat-security', level: 2 },
    { id: 'cat-alarms', name: 'Сигнализация (Ajax / Paradox)', slug: 'alarms', parentId: 'cat-security', level: 2 },
    { id: 'cat-access-control', name: 'Домофоны и Контроль доступа', slug: 'access-control', parentId: 'cat-security', level: 2 },
    { id: 'cat-storage', name: 'Жесткие диски и Память (HDD / SSD)', slug: 'storage', parentId: 'cat-security', level: 2 },

    { id: 'cat-ip-cameras', name: 'IP камеры видеонаблюдения', slug: 'ip-cameras', parentId: 'cat-cctv', level: 3 },
    { id: 'cat-analog-cameras', name: 'Аналоговые / HD-TVI камеры', slug: 'analog-cameras', parentId: 'cat-cctv', level: 3 },
    { id: 'cat-nvr', name: 'IP видеорегистраторы (NVR)', slug: 'nvr', parentId: 'cat-cctv', level: 3 },
    { id: 'cat-dvr', name: 'Аналоговые видеорегистраторы (DVR/XVR)', slug: 'dvr', parentId: 'cat-cctv', level: 3 },
    { id: 'cat-power-cctv', name: 'Блоки питания и PoE', slug: 'power-supplies', parentId: 'cat-cctv', level: 3 },
    { id: 'cat-brackets', name: 'Кронштейны и Аксессуары', slug: 'brackets', parentId: 'cat-cctv', level: 3 },

    { id: 'cat-switches', name: 'PoE и Сетевые коммутаторы', slug: 'switches', parentId: 'cat-network-root', level: 2 },
    { id: 'cat-routers', name: 'Маршрутизаторы и Wi-Fi точки', slug: 'routers', parentId: 'cat-network-root', level: 2 },
    { id: 'cat-cables', name: 'Кабели и Патч-корды', slug: 'cables', parentId: 'cat-network-root', level: 2 },
  ];

  SECURITY_CATS.forEach(c => categoriesMap.set(c.id, c));

  const allCategories = Array.from(categoriesMap.values());

  // Count products for each category
  const getDescendantIds = (catId) => {
    const ids = new Set([catId]);
    const findChildren = (pId) => {
      const children = allCategories.filter(c => c.parentId === pId);
      children.forEach(ch => {
        ids.add(ch.id);
        findChildren(ch.id);
      });
    };
    findChildren(catId);
    return ids;
  };

  allCategories.forEach(cat => {
    const descendantIds = getDescendantIds(cat.id);
    let count = 0;
    for (const prod of allProducts) {
      if (descendantIds.has(prod.categoryId)) {
        count++;
      } else if (prod.categoryPath && prod.categoryPath.some(cp => descendantIds.has(cp.id))) {
        count++;
      }
    }
    cat.productCount = count;
  });

  const populatedCategories = allCategories.filter(c => c.productCount > 0);
  console.log(`Populated categories count: ${populatedCategories.length}`);
  populatedCategories.forEach(c => console.log(`- [${c.level}] ${c.name}: ${c.productCount} items`));

  // Build unified brands list
  const brandsMap = new Map();
  initialBrands.forEach(b => brandsMap.set(slugify(b.name), b));

  for (const prod of allProducts) {
    const brandName = (prod.brand || 'Hykon').trim();
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
    brandsMap.get(brandSlug).productCount = (brandsMap.get(brandSlug).productCount || 0) + 1;
  }

  const allBrands = Array.from(brandsMap.values()).filter(b => b.productCount > 0).sort((a, b) => b.productCount - a.productCount);
  console.log(`Populated brands count: ${allBrands.length}`);
  console.log('Top Brands:', allBrands.slice(0, 15).map(b => `${b.name} (${b.productCount})`));

  // Write JSON data files
  fs.writeFileSync('src/data/products.json', JSON.stringify(allProducts, null, 2), 'utf8');
  fs.writeFileSync('src/data/categories.json', JSON.stringify(populatedCategories, null, 2), 'utf8');
  fs.writeFileSync('src/data/brands.json', JSON.stringify(allBrands, null, 2), 'utf8');

  console.log('Successfully written master catalog files!');
}

run();
