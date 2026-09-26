export type Language = 'ka' | 'en' | 'ru';

export interface TranslationDictionary {
  // Navigation & Header
  catalog: string;
  catalogMenu: string;
  allProducts: string;
  searchPlaceholder: string;
  searchResults: string;
  noResults: string;
  freeDeliveryBadge: string;
  warrantyBadge: string;
  cart: string;
  wishlist: string;
  compare: string;
  emptyCart: string;
  bestsellers: string;
  newArrivals: string;
  discounts: string;
  brands: string;
  blog: string;
  deliveryAndPayment: string;
  warrantyAndService: string;
  contacts: string;
  callUs: string;
  showroomAddress: string;

  // Catalog Filters & Sorting
  categories: string;
  allCategories: string;
  filterByBrand: string;
  searchBrand: string;
  price: string;
  priceFrom: string;
  priceTo: string;
  onlyInStock: string;
  onlyDiscount: string;
  sortBy: string;
  sortPopular: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortRating: string;
  sortNewest: string;
  showing: string;
  of: string;
  perPage: string;
  resetFilters: string;
  notFound: string;
  notFoundDesc: string;

  // Product Card & Actions
  inStock: string;
  outOfStock: string;
  onOrder: string;
  addToCart: string;
  added: string;
  quickView: string;
  sku: string;
  saving: string;
  viewDetails: string;

  // Product Detail Page
  clickToZoom: string;
  buyIn1Click: string;
  oneClickTitle: string;
  oneClickDesc: string;
  yourName: string;
  yourPhone: string;
  submitOrder: string;
  orderSuccessMsg: string;
  specifications: string;
  description: string;
  reviews: string;
  deliveryTab: string;
  freeDeliveryNotice: string;
  officialWarrantyNotice: string;
  easyReturnNotice: string;
  relatedProducts: string;

  // Checkout & Cart
  cartTitle: string;
  orderSummary: string;
  subtotal: string;
  shipping: string;
  free: string;
  total: string;
  proceedToCheckout: string;
  checkoutTitle: string;
  contactDetails: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  deliveryNotes: string;
  deliveryMethod: string;
  courierDelivery: string;
  pickupShowroom: string;
  paymentMethod: string;
  bankTransfer: string;
  bankTransferDesc: string;
  cashOnDelivery: string;
  cashOnDeliveryDesc: string;
  placeOrder: string;
  generatingInvoice: string;

  // Invoice Details
  invoice: string;
  invoiceNumber: string;
  invoiceDate: string;
  supplier: string;
  companyName: string;
  companyId: string;
  buyer: string;
  bankRequisites: string;
  bankName: string;
  iban: string;
  purpose: string;
  item: string;
  qty: string;
  unitPrice: string;
  amount: string;
  vatIncluded: string;
  printInvoice: string;
  downloadInvoice: string;

  // Footer & Common
  footerAbout: string;
  quickLinks: string;
  forCustomers: string;
  allRightsReserved: string;
  switchLanguage: string;

  // Home page sections & Features
  featuredProductsTitle: string;
  featuredProductsSubtitle: string;
  goToFullCatalog: string;
  categorySubtitle: string;
  fastDeliveryTitle: string;
  fastDeliveryDesc: string;
  officialWarrantyTitle: string;
  officialWarrantyDesc: string;
  installationTitle: string;
  installationDesc: string;
  engineeringSupportTitle: string;
  engineeringSupportDesc: string;
  officialBrandsTitle: string;
  officialBrandsSubtitle: string;
  allBrands: string;
  blogTitle: string;
  blogSubtitle: string;
  allArticles: string;
  itemsCount: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  ka: {
    // Navigation & Header
    catalog: 'კატალოგი',
    catalogMenu: 'პროდუქციის კატალოგი',
    allProducts: 'ყველა პროდუქტი',
    searchPlaceholder: 'ძებნა კოდით, მოდელით ან სახელით...',
    searchResults: 'ძიების შედეგები',
    noResults: 'არაფერი მოიძებნა',
    freeDeliveryBadge: 'უფასო მიწოდება მთელ საქართველოში 150 ₾-დან',
    warrantyBadge: 'ოფიციალური გარანტია 36 თვემდე',
    cart: 'კალათა',
    wishlist: 'რჩეულები',
    compare: 'შედარება',
    emptyCart: 'კალათა ცარიელია',
    bestsellers: 'ხშირად გაყიდვადი',
    newArrivals: 'ახალი პროდუქცია 2026',
    discounts: 'ფასდაკლებები',
    brands: 'ბრენდები',
    blog: 'ბლოგი და სტატიები',
    deliveryAndPayment: 'მიწოდება და გადახდა',
    warrantyAndService: 'გარანტია და სერვისი',
    contacts: 'შოურუმი და კონტაქტი',
    callUs: 'დაგვიკავშირდით',
    showroomAddress: 'ბათუმი, საქართველო',

    // Catalog Filters & Sorting
    categories: 'კატეგორიები',
    allCategories: 'ყველა კატეგორია',
    filterByBrand: 'ბრენდით ფილტრაცია',
    searchBrand: 'ბრენდის ძებნა...',
    price: 'ფასი (₾)',
    priceFrom: 'დან',
    priceTo: 'მდე',
    onlyInStock: 'მხოლოდ მარაგში',
    onlyDiscount: 'მხოლოდ ფასდაკლებით',
    sortBy: 'დალაგება:',
    sortPopular: 'პოპულარობით',
    sortPriceAsc: 'ფასი: დაბლიდან მაღლა',
    sortPriceDesc: 'ფასი: მაღლიდან დაბლა',
    sortRating: 'რეიტინგით',
    sortNewest: 'უახლესი',
    showing: 'ნაჩვენებია',
    of: 'სულ',
    perPage: 'გვერდზე:',
    resetFilters: 'ფილტრების გასუფთავება',
    notFound: 'პროდუქცია ვერ მოიძებნა',
    notFoundDesc: 'სცადეთ ფილტრების შეცვლა ან სხვა საძიებო სიტყვა.',

    // Product Card & Actions
    inStock: 'მარაგშია',
    outOfStock: 'არ არის მარაგში',
    onOrder: 'შეკვეთით',
    addToCart: 'კალათაში დამატება',
    added: 'დამატებულია',
    quickView: 'სწრაფი ნახვა',
    sku: 'არტიკული (SKU)',
    saving: 'დანაზოგი',
    viewDetails: 'დეტალურად ნახვა',

    // Product Detail Page
    clickToZoom: 'დააჭირეთ გასადიდებლად',
    buyIn1Click: '1 დაწკაპებით შეძენა',
    oneClickTitle: 'სწრაფი შეკვეთა 1 წუთში',
    oneClickDesc: 'დაგვიტოვეთ ტელეფონის ნომერი და ჩვენი მენეჯერი დაგიკავშირდებათ.',
    yourName: 'თქვენი სახელი',
    yourPhone: 'ტელეფონის ნომერი',
    submitOrder: 'შეკვეთის გაფორმება',
    orderSuccessMsg: 'თქვენი შეკვეთა მიღებულია! მენეჯერი მალე დაგიკავშირდებათ.',
    specifications: 'მახასიათებლები',
    description: 'აღწერა',
    reviews: 'შეფასებები',
    deliveryTab: 'მიწოდება და გარანტია',
    freeDeliveryNotice: 'სწრაფი კურიერული მიწოდება 1-2 დღეში',
    officialWarrantyNotice: 'ოფიციალური მწარმოებლის გარანტია',
    easyReturnNotice: '14 დღიანი დაბრუნების გარანტია',
    relatedProducts: 'მსგავსი პროდუქცია',

    // Checkout & Cart
    cartTitle: 'საყიდლების კალათა',
    orderSummary: 'შეკვეთის ჯამი',
    subtotal: 'ღირებულება',
    shipping: 'მიწოდება',
    free: 'უფასო',
    total: 'სულ გადასახდელი',
    proceedToCheckout: 'შეკვეთის გაფორმება',
    checkoutTitle: 'შეკვეთის გაფორმება',
    contactDetails: 'საკონტაქტო მონაცემები',
    fullName: 'სრული სახელი / კომპანიის დასახელება',
    email: 'ელექტრონული ფოსტა',
    phone: 'ტელეფონის ნომერი',
    city: 'ქალაქი',
    address: 'მიწოდების მისამართი',
    deliveryNotes: 'კომენტარი შეკვეთაზე (არასავალდებულო)',
    deliveryMethod: 'მიწოდების მეთოდი',
    courierDelivery: 'კურიერული მიწოდება',
    pickupShowroom: 'შოურუმიდან გატანა (ბათუმი)',
    paymentMethod: 'გადახდის მეთოდი',
    bankTransfer: 'საბანკო გადარიცხვა (ინვოისით)',
    bankTransferDesc: 'ავტომატური ინვოისის გენერაცია ფიზიკური და იურიდიული პირებისთვის (RS.GE).',
    cashOnDelivery: 'გადახდა მიღებისას',
    cashOnDeliveryDesc: 'ნაღდი ანგარიშსწორებით კურიერთან.',
    placeOrder: 'შეკვეთის დადასტურება და ინვოისის მიღება',
    generatingInvoice: 'ინვოისის გენერირება...',

    // Invoice Details
    invoice: 'ინვოისი / ანგარიშ-ფაქტურა',
    invoiceNumber: 'ინვოისის N',
    invoiceDate: 'თარიღი',
    supplier: 'გამყიდველი (მიმღები)',
    companyName: 'ი.მ. Hykon',
    companyId: 'საიდენტიფიკაციო კოდი (ს/კ): 61001070627',
    buyer: 'მყიდველი (გადამხდელი)',
    bankRequisites: 'საბანკო რეკვიზიტები',
    bankName: 'სს "საქართველოს ბანკი" (Bank of Georgia)',
    iban: 'ანგარიშის N (IBAN)',
    purpose: 'გადახდის დანიშნულება',
    item: 'დასახელება / მოდელი',
    qty: 'რაოდ.',
    unitPrice: 'ფასი',
    amount: 'თანხა',
    vatIncluded: 'დღგ-ს ჩათვლით',
    printInvoice: 'ინვოისის ბეჭდვა / შენახვა',
    downloadInvoice: 'PDF / ჩამოტვირთვა',

    // Footer & Common
    footerAbout: 'უსაფრთხოების სისტემების, ვიდეომეთვალყურეობის, ქსელური და დაცვითი მოწყობილობების წამყვანი დისტრიბუტორი საქართველოში.',
    quickLinks: 'სწრაფი ბმულები',
    forCustomers: 'მყიდველებისთვის',
    allRightsReserved: 'ყველა უფლება დაცულია.',
    switchLanguage: 'ენა',

    // Home page sections & Features
    featuredProductsTitle: 'რეკომენდებული პროდუქცია',
    featuredProductsSubtitle: 'აქტუალური მოდელები გარანტიითა და სწრაფი მიწოდებით',
    goToFullCatalog: 'სრულ კატალოგზე გადასვლა ({count} პროდუქტი)',
    categorySubtitle: 'უსაფრთხოების სისტემებისა და ქსელური მოწყობილობების ორიგინალი ტექნიკა',
    fastDeliveryTitle: 'სწრაფი მიწოდება',
    fastDeliveryDesc: 'სწრაფი კურიერული მიწოდება ბათუმში, თბილისსა და საქართველოს ყველა რეგიონში 1-2 დღეში.',
    officialWarrantyTitle: 'ოფიციალური გარანტია',
    officialWarrantyDesc: 'პირდაპირი მოწოდება ოფიციალური დისტრიბუტორებისგან: Hikvision, AJAX, Uniview, Ruijie 3 წლამდე გარანტიით.',
    installationTitle: 'მონტაჟი და გამართვა',
    installationDesc: 'პროფესიონალური პროექტირება, ვიდეოსამეთვალყურეო სისტემების, დაშვების კონტროლისა და ქსელების მონტაჟი.',
    engineeringSupportTitle: 'საინჟინრო მხარდაჭერა',
    engineeringSupportDesc: 'დახმარება აღჭურვილობის შერჩევაში, ქსელის დატვირთვის გაანგარიშება და სპეციალისტთა კონსულტაცია.',
    officialBrandsTitle: 'ოფიციალური ბრენდები',
    officialBrandsSubtitle: 'ორიგინალი პროდუქციის პირდაპირი მოწოდება ოფიციალური მხარდაჭერით',
    allBrands: 'ყველა ბრენდი',
    blogTitle: 'ბლოგი და ექსპერტთა მიმოხილვები',
    blogSubtitle: 'უსაფრთხოების სისტემების მიმოხილვა, მონტაჟის ინსტრუქციები და მოწყობილობების შედარება',
    allArticles: 'ყველა სტატია',
    itemsCount: 'პროდ.',
  },
  en: {
    // Navigation & Header
    catalog: 'Catalog',
    catalogMenu: 'Product Catalog',
    allProducts: 'All Products',
    searchPlaceholder: 'Search by model, SKU or name...',
    searchResults: 'Search Results',
    noResults: 'No products found',
    freeDeliveryBadge: 'Free shipping across Georgia from 150 ₾',
    warrantyBadge: 'Official Warranty up to 36 months',
    cart: 'Cart',
    wishlist: 'Wishlist',
    compare: 'Compare',
    emptyCart: 'Your cart is empty',
    bestsellers: 'Bestsellers',
    newArrivals: 'New Arrivals 2026',
    discounts: 'Discounts & Deals',
    brands: 'Brands',
    blog: 'Blog & Articles',
    deliveryAndPayment: 'Delivery & Payment',
    warrantyAndService: 'Warranty & Service',
    contacts: 'Showroom & Contacts',
    callUs: 'Call Us',
    showroomAddress: 'Batumi, Georgia',

    // Catalog Filters & Sorting
    categories: 'Categories',
    allCategories: 'All Categories',
    filterByBrand: 'Filter by Brand',
    searchBrand: 'Search brand...',
    price: 'Price (₾)',
    priceFrom: 'From',
    priceTo: 'To',
    onlyInStock: 'In Stock Only',
    onlyDiscount: 'On Sale Only',
    sortBy: 'Sort by:',
    sortPopular: 'Popularity',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    sortRating: 'Rating',
    sortNewest: 'Newest',
    showing: 'Showing',
    of: 'of',
    perPage: 'Per page:',
    resetFilters: 'Reset Filters',
    notFound: 'No Products Found',
    notFoundDesc: 'Try adjusting your filters or search keywords.',

    // Product Card & Actions
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    onOrder: 'On Order',
    addToCart: 'Add to Cart',
    added: 'Added',
    quickView: 'Quick View',
    sku: 'SKU',
    saving: 'Save',
    viewDetails: 'View Details',

    // Product Detail Page
    clickToZoom: 'Click to zoom',
    buyIn1Click: 'Buy in 1-Click',
    oneClickTitle: 'Quick 1-Minute Order',
    oneClickDesc: 'Leave your phone number and our manager will call you immediately.',
    yourName: 'Your Name',
    yourPhone: 'Phone Number',
    submitOrder: 'Place Order',
    orderSuccessMsg: 'Order placed successfully! Our manager will contact you shortly.',
    specifications: 'Specifications',
    description: 'Description',
    reviews: 'Reviews',
    deliveryTab: 'Delivery & Warranty',
    freeDeliveryNotice: 'Fast courier delivery in 1-2 days',
    officialWarrantyNotice: 'Official manufacturer warranty',
    easyReturnNotice: '14-day hassle-free return',
    relatedProducts: 'Related Products',

    // Checkout & Cart
    cartTitle: 'Shopping Cart',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    free: 'Free',
    total: 'Total Amount',
    proceedToCheckout: 'Proceed to Checkout',
    checkoutTitle: 'Checkout',
    contactDetails: 'Contact Details',
    fullName: 'Full Name / Company Name',
    email: 'Email Address',
    phone: 'Phone Number',
    city: 'City',
    address: 'Delivery Address',
    deliveryNotes: 'Order Notes (Optional)',
    deliveryMethod: 'Delivery Method',
    courierDelivery: 'Courier Delivery',
    pickupShowroom: 'Showroom Pickup (Batumi)',
    paymentMethod: 'Payment Method',
    bankTransfer: 'Bank Transfer (Invoice)',
    bankTransferDesc: 'Automated official invoice generation for individuals & companies (RS.GE).',
    cashOnDelivery: 'Cash on Delivery',
    cashOnDeliveryDesc: 'Pay in cash or card to courier upon delivery.',
    placeOrder: 'Confirm Order & Generate Invoice',
    generatingInvoice: 'Generating Invoice...',

    // Invoice Details
    invoice: 'Proforma Invoice',
    invoiceNumber: 'Invoice #',
    invoiceDate: 'Date',
    supplier: 'Supplier (Beneficiary)',
    companyName: 'I/E Hykon',
    companyId: 'Tax ID / ID: 61001070627',
    buyer: 'Buyer (Payer)',
    bankRequisites: 'Banking Details',
    bankName: 'JSC "Bank of Georgia" (BOG)',
    iban: 'IBAN',
    purpose: 'Payment Reference',
    item: 'Item Description',
    qty: 'Qty',
    unitPrice: 'Unit Price',
    amount: 'Total',
    vatIncluded: 'VAT Included',
    printInvoice: 'Print / Save Invoice',
    downloadInvoice: 'Download / PDF',

    // Footer & Common
    footerAbout: 'Leading distributor of security systems, CCTV surveillance, network and access control equipment in Georgia.',
    quickLinks: 'Quick Links',
    forCustomers: 'Customer Service',
    allRightsReserved: 'All rights reserved.',
    switchLanguage: 'Language',

    // Home page sections & Features
    featuredProductsTitle: 'Recommended Products',
    featuredProductsSubtitle: 'Top selections with official warranty and fast courier delivery',
    goToFullCatalog: 'Go to full catalog ({count} products)',
    categorySubtitle: 'Original security systems and network solutions',
    fastDeliveryTitle: 'Fast Delivery',
    fastDeliveryDesc: 'Courier delivery in Batumi, Tbilisi, and express shipping across Georgia within 1-2 days.',
    officialWarrantyTitle: 'Official Warranty',
    officialWarrantyDesc: 'Direct supplies from official distributors of Hikvision, AJAX, Uniview, Ruijie with up to 3 years warranty.',
    installationTitle: 'Installation & Setup',
    installationDesc: 'Professional design, turnkey installation of CCTV, access control, barriers, and structured cabling.',
    engineeringSupportTitle: 'Engineering Support',
    engineeringSupportDesc: 'Assistance with equipment selection, network load calculation, and expert technical consulting.',
    officialBrandsTitle: 'Official Brands',
    officialBrandsSubtitle: 'Direct supplies of original equipment with manufacturer warranty & support',
    allBrands: 'All Brands',
    blogTitle: 'Blog & Expert Tech Reviews',
    blogSubtitle: 'Security equipment reviews, installation guides, and hardware comparisons',
    allArticles: 'All Articles',
    itemsCount: 'items',
  },
  ru: {
    // Navigation & Header
    catalog: 'Каталог',
    catalogMenu: 'Каталог товаров',
    allProducts: 'Все товары',
    searchPlaceholder: 'Поиск по артикулу, бренду или названию...',
    searchResults: 'Результаты поиска',
    noResults: 'Ничего не найдено',
    freeDeliveryBadge: 'Бесплатная доставка по всей Грузии от 150 ₾',
    warrantyBadge: 'Официальная гарантия до 36 мес.',
    cart: 'Корзина',
    wishlist: 'Избранное',
    compare: 'Сравнение',
    emptyCart: 'Корзина пуста',
    bestsellers: 'Хиты продаж',
    newArrivals: 'Новинки 2026',
    discounts: 'Скидки и акции',
    brands: 'Бренды',
    blog: 'Блог и обзоры',
    deliveryAndPayment: 'Доставка и оплата',
    warrantyAndService: 'Гарантия и сервис',
    contacts: 'Шоурум и контакты',
    callUs: 'Позвонить нам',
    showroomAddress: 'Батуми, Грузия',

    // Catalog Filters & Sorting
    categories: 'Категории',
    allCategories: 'Все категории',
    filterByBrand: 'Производитель',
    searchBrand: 'Поиск бренда...',
    price: 'Цена (₾)',
    priceFrom: 'От',
    priceTo: 'До',
    onlyInStock: 'Только в наличии',
    onlyDiscount: 'Только со скидкой',
    sortBy: 'Сортировка:',
    sortPopular: 'По популярности',
    sortPriceAsc: 'Сначала дешевле',
    sortPriceDesc: 'Сначала дороже',
    sortRating: 'По рейтингу',
    sortNewest: 'Сначала новинки',
    showing: 'Показано',
    of: 'из',
    perPage: 'По:',
    resetFilters: 'Сбросить фильтры',
    notFound: 'Товары не найдены',
    notFoundDesc: 'Попробуйте сбросить установленные фильтры или изменить поисковый запрос.',

    // Product Card & Actions
    inStock: 'В наличии',
    outOfStock: 'Нет в наличии',
    onOrder: 'Под заказ',
    addToCart: 'В корзину',
    added: 'Добавлено',
    quickView: 'Быстрый просмотр',
    sku: 'Артикул (SKU)',
    saving: 'Экономия',
    viewDetails: 'Подробнее',

    // Product Detail Page
    clickToZoom: 'Нажмите для увеличения',
    buyIn1Click: 'Купить в 1 клик',
    oneClickTitle: 'Быстрый заказ за 1 минуту',
    oneClickDesc: 'Оставьте номер телефона, и наш специалист свяжется с вами для оформления.',
    yourName: 'Ваше имя',
    yourPhone: 'Номер телефона',
    submitOrder: 'Оформить заказ',
    orderSuccessMsg: 'Заказ успешно оформлен! Менеджер свяжется с вами в течение 10 минут.',
    specifications: 'Характеристики',
    description: 'Описание',
    reviews: 'Отзывы покупателей',
    deliveryTab: 'Доставка и гарантия',
    freeDeliveryNotice: 'Быстрая курьерская доставка за 1-2 дня',
    officialWarrantyNotice: 'Официальная гарантия от производителя',
    easyReturnNotice: '14 дней на обмен или возврат без вопросов',
    relatedProducts: 'Похожие товары',

    // Checkout & Cart
    cartTitle: 'Корзина покупок',
    orderSummary: 'Ваш заказ',
    subtotal: 'Стоимость товаров',
    shipping: 'Доставка',
    free: 'Бесплатно',
    total: 'Итого к оплате',
    proceedToCheckout: 'Перейти к оформлению',
    checkoutTitle: 'Оформление заказа',
    contactDetails: 'Контактные данные',
    fullName: 'ФИО / Наименование организации',
    email: 'Электронная почта',
    phone: 'Номер телефона',
    city: 'Город',
    address: 'Адрес доставки',
    deliveryNotes: 'Примечание к заказу (необязательно)',
    deliveryMethod: 'Способ доставки',
    courierDelivery: 'Курьерская доставка',
    pickupShowroom: 'Самовывоз из шоурума (Батуми)',
    paymentMethod: 'Способ оплаты',
    bankTransfer: 'Безналичный расчет / Банковский перевод (Инвойс)',
    bankTransferDesc: 'Автоматическая генерация официального счета-фактуры (RS.GE) для физ. и юр. лиц.',
    cashOnDelivery: 'Оплата при получении',
    cashOnDeliveryDesc: 'Наличными или картой курьеру при получении.',
    placeOrder: 'Подтвердить заказ и получить Инвойс',
    generatingInvoice: 'Генерация инвойса...',

    // Invoice Details
    invoice: 'Счет на оплату (Инвойс)',
    invoiceNumber: 'Счет №',
    invoiceDate: 'Дата',
    supplier: 'Поставщик (Получатель)',
    companyName: 'ИП Hykon (I/E Hykon)',
    companyId: 'Идентификационный код (с/к): 61001070627',
    buyer: 'Покупатель (Плательщик)',
    bankRequisites: 'Банковские реквизиты',
    bankName: 'АО "Банк Грузии" (Bank of Georgia / BOG)',
    iban: 'Номер счета (IBAN)',
    purpose: 'Назначение платежа',
    item: 'Наименование товара',
    qty: 'Кол-во',
    unitPrice: 'Цена',
    amount: 'Сумма',
    vatIncluded: 'Включая НДС (18%)',
    printInvoice: 'Распечатать / Сохранить инвойс',
    downloadInvoice: 'Скачать / PDF',

    // Footer & Common
    footerAbout: 'Ведущий дистрибьютор систем безопасности, видеонаблюдения, сетевого оборудования и СКУД в Грузии.',
    quickLinks: 'Быстрые ссылки',
    forCustomers: 'Покупателям',
    allRightsReserved: 'Все права защищены.',
    switchLanguage: 'Язык',

    // Home page sections & Features
    featuredProductsTitle: 'Рекомендуемые товары',
    featuredProductsSubtitle: 'Актуальные позиции с гарантией и быстрой курьерской доставкой',
    goToFullCatalog: 'Перейти в полный каталог ({count} товаров)',
    categorySubtitle: 'Оригинальное оборудование систем безопасности и сетевых решений',
    fastDeliveryTitle: 'Быстрая доставка',
    fastDeliveryDesc: 'Курьерская доставка по Батуми, Тбилиси и экспресс отправка в регионы Грузии за 1-2 дня.',
    officialWarrantyTitle: 'Официальная гарантия',
    officialWarrantyDesc: 'Прямые поставки от официальных дистрибьюторов Hikvision, AJAX, Uniview, Ruijie с гарантией до 3 лет.',
    installationTitle: 'Монтаж и настройка',
    installationDesc: 'Профессиональное проектирование, монтаж видеонаблюдения, СКУД, шлагбаумов и СКС под ключ.',
    engineeringSupportTitle: 'Инженерная поддержка',
    engineeringSupportDesc: 'Помощь в подборе оборудования, расчет сетевой нагрузки и консультации специалистов.',
    officialBrandsTitle: 'Официальные бренды',
    officialBrandsSubtitle: 'Прямые поставки оригинальной продукции с официальной поддержкой',
    allBrands: 'Все бренды',
    blogTitle: 'Блог и экспертные обзоры',
    blogSubtitle: 'Обзоры систем безопасности, инструкции по монтажу и сравнения оборудования',
    allArticles: 'Все статьи',
    itemsCount: 'тов.',
  }
};
