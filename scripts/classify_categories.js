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

const CATEGORY_DEFINITIONS = [
  // Root
  { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები', level: 1, icon: 'ShieldCheck' },
  { id: 'cat-network-root', name: 'ქსელური მოწყობილობები', slug: 'ქსელური-მოწყობილობები', level: 1, icon: 'Laptop' },
  
  // Under Security
  { id: 'cat-cctv', name: 'ვიდეო მეთვალყურეობა', slug: 'ვიდეო-მეთვალყურეობა', parentId: 'cat-security', level: 2 },
  { id: 'cat-alarms', name: 'დაცვითი სიგნალიზაცია', slug: 'დაცვითი-სიგნალიზაცია', parentId: 'cat-security', level: 2 },
  { id: 'cat-access-control', name: 'დაშვების კონტროლი და დომოფონები', slug: 'დაშვების-კონტროლი', parentId: 'cat-security', level: 2 },
  { id: 'cat-storage', name: 'მყარი დისკები და მეხსიერება', slug: 'მყარი-დისკები', parentId: 'cat-security', level: 2 },

  // Under CCTV (Level 3)
  { id: 'cat-ip-cameras', name: 'IP კამერები', slug: 'ip-კამერები', parentId: 'cat-cctv', level: 3 },
  { id: 'cat-analog-cameras', name: 'ანალოგური / HD-TVI კამერები', slug: 'ანალოგური-კამერები', parentId: 'cat-cctv', level: 3 },
  { id: 'cat-nvr', name: 'IP ვიდეო-ჩამწერები (NVR)', slug: 'nvr-ვიდეო-ჩამწერები', parentId: 'cat-cctv', level: 3 },
  { id: 'cat-dvr', name: 'ანალოგური ვიდეო-ჩამწერები (DVR/XVR)', slug: 'dvr-ვიდეო-ჩამწერები', parentId: 'cat-cctv', level: 3 },
  { id: 'cat-power-cctv', name: 'კვების ბლოკები და ადაპტერები', slug: 'კვების-ბლოკები', parentId: 'cat-cctv', level: 3 },
  { id: 'cat-brackets', name: 'სამაგრები, კრონშტეინები და ყუთები', slug: 'სამაგრები-და-აქსესუარები', parentId: 'cat-cctv', level: 3 },

  // Under Network
  { id: 'cat-switches', name: 'PoE და ქსელური სვიჩები', slug: 'poe-სვიჩები', parentId: 'cat-network-root', level: 2 },
  { id: 'cat-routers', name: 'როუტერები და Wi-Fi წერტილები', slug: 'როუტერები-და-wifi', parentId: 'cat-network-root', level: 2 },
  { id: 'cat-cables', name: 'კაბელები და კონექტორები', slug: 'კაბელები-და-აქსესუარები', parentId: 'cat-network-root', level: 2 },
];

function classifyProduct(p) {
  const t = (p.title + ' ' + (p.sku || '') + ' ' + (p.shortDescription || '')).toLowerCase();

  // Alarms (Ajax / Paradox / detectors)
  if (t.includes('ajax') || t.includes('paradox') || t.includes('დეტექტორი') || t.includes('სირენა') || t.includes('სიგნალიზაცია') || t.includes('sensor') || t.includes('hub 2') || t.includes('motionprotect') || t.includes('doorprotect') || t.includes('spacecontrol')) {
    return {
      categoryId: 'cat-alarms',
      categoryPath: [
        { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
        { id: 'cat-alarms', name: 'დაცვითი სიგნალიზაცია', slug: 'დაცვითი-სიგნალიზაცია' }
      ]
    };
  }

  // Intercom / Access Control / ZKTeco / Locks / Keypads / Domofon
  if (t.includes('დომოფონი') || t.includes('დაშვებ') || t.includes('zkteco') || t.includes('საკეტი') || t.includes('ბარათი') || t.includes('intercom') || t.includes('reader') || t.includes('კოდური პანელი') || t.includes('გამღები')) {
    return {
      categoryId: 'cat-access-control',
      categoryPath: [
        { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
        { id: 'cat-access-control', name: 'დაშვების კონტროლი და დომოფონები', slug: 'დაშვების-კონტროლი' }
      ]
    };
  }

  // Storage (HDD / SSD / SD / Seagate SkyHawk / WD Purple)
  if (t.includes('hdd') || t.includes('seagate') || t.includes('skyhawk') || t.includes('wd purple') || t.includes('მყარი დისკი') || t.includes('მეხსიერების ბარათი') || t.includes('micro sd') || t.includes('ssd')) {
    return {
      categoryId: 'cat-storage',
      categoryPath: [
        { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
        { id: 'cat-storage', name: 'მყარი დისკები და მეხსიერება', slug: 'მყარი-დისკები' }
      ]
    };
  }

  // Power / Adapters / PoE power
  if (t.includes('კვების ბლოკი') || t.includes('ადაპტერი') || t.includes('power supply') || t.includes('12v') || t.includes('კვება') || t.includes('battery') || t.includes('აკუმულატორ')) {
    return {
      categoryId: 'cat-power-cctv',
      categoryPath: [
        { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
        { id: 'cat-cctv', name: 'ვიდეო მეთვალყურეობა', slug: 'ვიდეო-მეთვალყურეობა' },
        { id: 'cat-power-cctv', name: 'კვების ბლოკები და ადაპტერები', slug: 'კვების-ბლოკები' }
      ]
    };
  }

  // Brackets / Mounting / Boxes / Junction box
  if (t.includes('სამაგრი') || t.includes('კრონშტეინი') || t.includes('ყუთი') || t.includes('bracket') || t.includes('junction') || t.includes('მონტაჟ') || t.includes('wall mount') || t.includes('pole mount')) {
    return {
      categoryId: 'cat-brackets',
      categoryPath: [
        { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
        { id: 'cat-cctv', name: 'ვიდეო მეთვალყურეობა', slug: 'ვიდეო-მეთვალყურეობა' },
        { id: 'cat-brackets', name: 'სამაგრები, კრონშტეინები და ყუთები', slug: 'სამაგრები-და-აქსესუარები' }
      ]
    };
  }

  // NVR Recorders
  if (t.includes('nvr') || t.includes('ქსელური ჩამწერ') || t.includes('ქსელური ვიდეო ჩამწერ') || t.includes('ip ვიდეო ჩამწერ') || t.includes('ip-ვიდეო-ჩამწერ')) {
    return {
      categoryId: 'cat-nvr',
      categoryPath: [
        { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
        { id: 'cat-cctv', name: 'ვიდეო მეთვალყურეობა', slug: 'ვიდეო-მეთვალყურეობა' },
        { id: 'cat-nvr', name: 'IP ვიდეო-ჩამწერები (NVR)', slug: 'nvr-ვიდეო-ჩამწერები' }
      ]
    };
  }

  // DVR / XVR / HD-TVI Recorders
  if (t.includes('dvr') || t.includes('xvr') || t.includes('ანალოგური ჩამწერ') || t.includes('ანალოგური ვიდეო ჩამწერ') || t.includes('turbo hd ჩამწერ')) {
    return {
      categoryId: 'cat-dvr',
      categoryPath: [
        { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
        { id: 'cat-cctv', name: 'ვიდეო მეთვალყურეობა', slug: 'ვიდეო-მეთვალყურეობა' },
        { id: 'cat-dvr', name: 'ანალოგური ვიდეო-ჩამწერები (DVR/XVR)', slug: 'dvr-ვიდეო-ჩამწერები' }
      ]
    };
  }

  // Network Switches
  if (t.includes('სვიჩ') || t.includes('switch') || t.includes('poe switch') || t.includes('კომუტატორ')) {
    return {
      categoryId: 'cat-switches',
      categoryPath: [
        { id: 'cat-network-root', name: 'ქსელური მოწყობილობები', slug: 'ქსელური-მოწყობილობები' },
        { id: 'cat-switches', name: 'PoE და ქსელური სვიჩები', slug: 'poe-სვიჩები' }
      ]
    };
  }

  // Routers / WiFi / Ubiquiti AP
  if (t.includes('როუტერ') || t.includes('router') || t.includes('access point') || t.includes('wi-fi') || t.includes('wifi') || t.includes('unifi') || t.includes('mikrotik') || t.includes('ruijie') || t.includes('reyee')) {
    return {
      categoryId: 'cat-routers',
      categoryPath: [
        { id: 'cat-network-root', name: 'ქსელური მოწყობილობები', slug: 'ქსელური-მოწყობილობები' },
        { id: 'cat-routers', name: 'როუტერები და Wi-Fi წერტილები', slug: 'როუტერები-და-wifi' }
      ]
    };
  }

  // Cables
  if (t.includes('კაბელ') || t.includes('cable') || t.includes('utp') || t.includes('ftp') || t.includes('rj45') || t.includes('პაჩკორდ') || t.includes('patch cord')) {
    return {
      categoryId: 'cat-cables',
      categoryPath: [
        { id: 'cat-network-root', name: 'ქსელური მოწყობილობები', slug: 'ქსელური-მოწყობილობები' },
        { id: 'cat-cables', name: 'კაბელები და კონექტორები', slug: 'კაბელები-და-აქსესუარები' }
      ]
    };
  }

  // Analog Cameras (Turbo HD / HD-TVI / THC- / DS-2CE / ანალოგური)
  if (t.includes('ანალოგურ') || t.includes('turbo hd') || t.includes('tvi') || t.includes('cvi') || t.includes('thc-') || t.includes('ds-2ce') || t.includes('hwi-t') || t.includes('hwi-b')) {
    return {
      categoryId: 'cat-analog-cameras',
      categoryPath: [
        { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
        { id: 'cat-cctv', name: 'ვიდეო მეთვალყურეობა', slug: 'ვიდეო-მეთვალყურეობა' },
        { id: 'cat-analog-cameras', name: 'ანალოგური / HD-TVI კამერები', slug: 'ანალოგური-კამერები' }
      ]
    };
  }

  // Default to IP Cameras (IPC / IP კამერა / Dome / Bullet / PTZ)
  return {
    categoryId: 'cat-ip-cameras',
    categoryPath: [
      { id: 'cat-security', name: 'უსაფრთხოების სისტემები', slug: 'უსაფრთხოების-სისტემები' },
      { id: 'cat-cctv', name: 'ვიდეო მეთვალყურეობა', slug: 'ვიდეო-მეთვალყურეობა' },
      { id: 'cat-ip-cameras', name: 'IP კამერები', slug: 'ip-კამერები' }
    ]
  };
}

function processAll() {
  const products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
  console.log(`Processing classification for ${products.length} products...`);

  for (const p of products) {
    const { categoryId, categoryPath } = classifyProduct(p);
    p.categoryId = categoryId;
    p.categoryPath = categoryPath;
  }

  // Calculate counts for CATEGORY_DEFINITIONS
  const getDescendantIds = (catId) => {
    const ids = new Set([catId]);
    const findChildren = (pId) => {
      const children = CATEGORY_DEFINITIONS.filter(c => c.parentId === pId);
      children.forEach(ch => {
        ids.add(ch.id);
        findChildren(ch.id);
      });
    };
    findChildren(catId);
    return ids;
  };

  CATEGORY_DEFINITIONS.forEach(cat => {
    const descendantIds = getDescendantIds(cat.id);
    let count = 0;
    for (const prod of products) {
      if (descendantIds.has(prod.categoryId)) {
        count++;
      } else if (prod.categoryPath && prod.categoryPath.some(cp => descendantIds.has(cp.id))) {
        count++;
      }
    }
    cat.productCount = count;
  });

  const activeCategories = CATEGORY_DEFINITIONS.filter(c => c.productCount > 0);
  console.log(`Populated categories count: ${activeCategories.length}`);
  activeCategories.forEach(c => console.log(`- ${c.name} (${c.level}): ${c.productCount} items`));

  // Save updated products and categories
  fs.writeFileSync('src/data/products.json', JSON.stringify(products, null, 2), 'utf8');
  fs.writeFileSync('src/data/categories.json', JSON.stringify(activeCategories, null, 2), 'utf8');
  console.log('Successfully structured categories and products!');
}

processAll();
