const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/products.json'), 'utf8'));

// Calculate exact counts
const countMap = {};
products.forEach(p => {
  countMap[p.categoryId] = (countMap[p.categoryId] || 0) + 1;
});

const cleanCategories = [
  {
    id: 'cat-ip-cameras',
    name: 'IP კამერები',
    slug: 'ip-კამერები',
    level: 1,
    icon: 'Camera',
    description: 'IP ვიდეომეთვალყურეობის კამერები Uniview, Hikvision, HiLook, EZVIZ',
    productCount: countMap['cat-ip-cameras'] || 0
  },
  {
    id: 'cat-analog-cameras',
    name: 'ანალოგური / HD კამერები',
    slug: 'ანალოგური-კამერები',
    level: 1,
    icon: 'Video',
    description: 'HD-TVI, CVI, AHD ვიდეოკამერები',
    productCount: countMap['cat-analog-cameras'] || 0
  },
  {
    id: 'cat-nvr',
    name: 'IP ვიდეო-ჩამწერები (NVR)',
    slug: 'ip-ვიდეო-ჩამწერები-nvr',
    level: 1,
    icon: 'Server',
    description: 'ქსელური NVR ჩამწერები 4-დან 128 არხამდე',
    productCount: countMap['cat-nvr'] || 0
  },
  {
    id: 'cat-dvr',
    name: 'ანალოგური ვიდეო-ჩამწერები (DVR)',
    slug: 'ანალოგური-ვიდეო-ჩამწერები-dvr',
    level: 1,
    icon: 'Cpu',
    description: 'ჰიბრიდული DVR და XVR ჩამწერები',
    productCount: countMap['cat-dvr'] || 0
  },
  {
    id: 'cat-alarms',
    name: 'დაცვითი სიგნალიზაცია',
    slug: 'დაცვითი-სიგნალიზაცია',
    level: 1,
    icon: 'ShieldAlert',
    description: 'უსადენო და სადენიანი სიგნალიზაცია (Ajax, Paradox)',
    productCount: countMap['cat-alarms'] || 0
  },
  {
    id: 'cat-access-control',
    name: 'დაშვების კონტროლი და დომოფონები',
    slug: 'დაშვების-კონტროლი',
    level: 1,
    icon: 'KeyRound',
    description: 'IP დომოფონები, ბარათის წამკითხველები, საკეტები და ZKTeco',
    productCount: countMap['cat-access-control'] || 0
  },
  {
    id: 'cat-storage',
    name: 'მყარი დისკები და მეხსიერება',
    slug: 'მყარი-დისკები',
    level: 1,
    icon: 'HardDrive',
    description: 'Seagate SkyHawk, WD Purple და MicroSD ბარათები',
    productCount: countMap['cat-storage'] || 0
  },
  {
    id: 'cat-switches',
    name: 'PoE და ქსელური სვიჩები',
    slug: 'poe-სვიჩები',
    level: 1,
    icon: 'Network',
    description: 'PoE კომუტატორები 4, 8, 16, 24 პორტით',
    productCount: countMap['cat-switches'] || 0
  },
  {
    id: 'cat-routers',
    name: 'როუტერები და Wi-Fi წერტილები',
    slug: 'როუტერები-და-wifi',
    level: 1,
    icon: 'Wifi',
    description: 'Ruijie, Reyee, Ubiquiti, MikroTik როუტერები და Access Point-ები',
    productCount: countMap['cat-routers'] || 0
  },
  {
    id: 'cat-power-cctv',
    name: 'კვების ბლოკები და PoE',
    slug: 'კვების-ბლოკები',
    level: 1,
    icon: 'Zap',
    description: 'კვების წყაროები 12V/24V, PoE ინჟექტორები და UPS',
    productCount: countMap['cat-power-cctv'] || 0
  },
  {
    id: 'cat-brackets',
    name: 'სამაგრები და აქსესუარები',
    slug: 'სამაგრები-და-აქსესუარები',
    level: 1,
    icon: 'Wrench',
    description: 'კედლის და ჭერის სამაგრები, სამონტაჟო ყუთები (Junction Box)',
    productCount: countMap['cat-brackets'] || 0
  },
  {
    id: 'cat-cables',
    name: 'კაბელები და კონექტორები',
    slug: 'კაბელები-და-აქსესუარები',
    level: 1,
    icon: 'Cable',
    description: 'UTP/FTP Cat5e, Cat6 კაბელები, RJ45, BNC კონექტორები',
    productCount: countMap['cat-cables'] || 0
  }
];

fs.writeFileSync(path.join(__dirname, '../src/data/categories.json'), JSON.stringify(cleanCategories, null, 2), 'utf8');
console.log('Categories updated successfully without deep nesting:', cleanCategories.length);
