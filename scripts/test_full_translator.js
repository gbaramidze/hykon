const fs = require('fs');

const DICTIONARY = [
  // Multi-word phrases (longest first)
  { geo: 'დაშვების წერტილი', ru: 'Точка доступа Wi-Fi', en: 'Wi-Fi Access Point' },
  { geo: 'დაშვების კონტროლის ტერმინალი', ru: 'Терминал контроля доступа', en: 'Access Control Terminal' },
  { geo: 'დაშვების კონტროლის', ru: 'контроля доступа', en: 'Access Control' },
  { geo: 'დაშვების კონტროლი', ru: 'Контроль доступа (СКУД)', en: 'Access Control' },
  { geo: 'დაშვების', ru: 'доступа', en: 'Access' },

  { geo: 'შლაგბაუმი ნათებით', ru: 'Шлагбаум со светодиодной подсветкой', en: 'Barrier Gate with LED Boom' },
  { geo: 'შლაგბაუმის ისარი', ru: 'Стрела шлагбаума', en: 'Barrier Boom' },
  { geo: 'შლაგბაუმის', ru: 'шлагбаума', en: 'Barrier Gate' },
  { geo: 'შლაგბაუმი', ru: 'Шлагбаум', en: 'Barrier Gate' },

  { geo: 'გამოძახების პანელი სახის ამომცნობით', ru: 'Вызывная панель с распознаванием лиц', en: 'Door Station with Face Recognition' },
  { geo: 'გამოძახების პანელი', ru: 'Вызывная панель видеодомофона', en: 'Video Intercom Door Station' },
  { geo: 'გამოძახების', ru: 'вызывная', en: 'Door' },
  { geo: 'სახის ამომცნობით', ru: 'с распознаванием лиц', en: 'with Face Recognition' },
  { geo: 'სახის ამომცნობი', ru: 'Распознавание лиц', en: 'Face Recognition' },
  { geo: 'თითის ანაბეჭდის', ru: 'отпечатка пальца', en: 'Fingerprint' },

  { geo: 'ვიდეომეთვალყურეობის კამერების', ru: 'камер видеонаблюдения', en: 'CCTV Cameras' },
  { geo: 'ვიდეომეთვალყურეობის კამერა', ru: 'Камера видеонаблюдения', en: 'CCTV Camera' },
  { geo: 'ვიდეომეთვალყურეობის', ru: 'видеонаблюдения', en: 'CCTV' },
  { geo: 'ვიდეოკამერა', ru: 'Видеокамера', en: 'Video Camera' },
  { geo: 'ვიდეოკამერისთვის', ru: 'для видеокамер', en: 'for Video Cameras' },
  { geo: 'კამერა IP', ru: 'IP Камера', en: 'IP Camera' },
  { geo: 'კამერა, IP', ru: 'IP Камера', en: 'IP Camera' },
  { geo: 'კამერა', ru: 'Камера', en: 'Camera' },
  { geo: 'კამერის', ru: 'камеры', en: 'Camera' },
  { geo: 'კამერების', ru: 'камер', en: 'Cameras' },
  { geo: 'კამერებისთვის', ru: 'для камер', en: 'for Cameras' },
  { geo: 'კამერებისათვის', ru: 'для камер', en: 'for Cameras' },
  { geo: 'კამერით', ru: 'с камерой', en: 'with Camera' },
  { geo: 'ბულეტ', ru: 'Цилиндрическая (Bullet)', en: 'Bullet' },

  { geo: 'ქსელური ვიდეოჩამწერი', ru: 'Сетевой NVR видеорегистратор', en: 'Network Video Recorder (NVR)' },
  { geo: 'ანალოგური ვიდეოჩამწერი', ru: 'Аналоговый DVR видеорегистратор', en: 'Analog Video Recorder (DVR)' },
  { geo: 'ქსელური ჩამწერი', ru: 'Сетевой NVR регистратор', en: 'Network NVR Recorder' },
  { geo: 'ვიდეო ჩამწერი', ru: 'Видеорегистратор', en: 'Video Recorder' },
  { geo: 'ვიდეო-ჩამწერი', ru: 'Видеорегистратор', en: 'Video Recorder' },
  { geo: 'ვიდეოჩამწერი', ru: 'Видеорегистратор', en: 'Video Recorder' },
  { geo: 'ჩამწერი', ru: 'Регистратор', en: 'Recorder' },
  { geo: 'ჩამწერისთვის', ru: 'для регистратора', en: 'for Recorder' },
  { geo: 'ჩამწერებისთვის', ru: 'для регистраторов', en: 'for Recorders' },

  { geo: 'კვამლის ოპტიკური დეტექტორი', ru: 'Оптический дымовой извещатель', en: 'Optical Smoke Detector' },
  { geo: 'წყლის გაჟონვის დეტექტორი', ru: 'Датчик протечки воды', en: 'Water Leak Detector' },
  { geo: 'შუშის მსხვრევის დეტექტორი', ru: 'Датчик разбития стекла', en: 'Glass Break Detector' },
  { geo: 'მოძრაობის დეტექტორი', ru: 'Датчик движения', en: 'Motion Detector' },
  { geo: 'დეტექტორი მოძრაობის', ru: 'Датчик движения', en: 'Motion Detector' },
  { geo: 'კვამლის დეტექტორი', ru: 'Датчик дыма', en: 'Smoke Detector' },
  { geo: 'გაზის დეტექტორი', ru: 'Датчик утечки газа', en: 'Gas Detector' },
  { geo: 'დეტექტორის სამაგრი', ru: 'Кронштейн для датчика', en: 'Detector Bracket' },
  { geo: 'დეტექტორის', ru: 'датчика', en: 'Detector' },
  { geo: 'დეტექტორი', ru: 'Датчик / Извещатель', en: 'Detector / Sensor' },
  { geo: 'დეტექტროი', ru: 'Датчик', en: 'Detector' },

  { geo: 'კარის მაგნიტური საკეტი', ru: 'Электромагнитный замок', en: 'Magnetic Door Lock' },
  { geo: 'კარის საკეტი', ru: 'Дверной замок', en: 'Door Lock' },
  { geo: 'კარის დამხური', ru: 'Дверной доводчик', en: 'Door Closer' },
  { geo: 'კარის', ru: 'двери', en: 'Door' },
  { geo: 'საკეტის', ru: 'замка', en: 'Lock' },
  { geo: 'საკეტი', ru: 'Замок', en: 'Lock' },
  { geo: 'სტრაიკი', ru: 'Электрозащелка', en: 'Electric Strike' },
  { geo: 'მაგნიტური', ru: 'Магнитный', en: 'Magnetic' },
  { geo: 'შუშის', ru: 'для стеклянных дверей', en: 'for Glass Doors' },

  { geo: 'სიგნალიზაციის პულტი', ru: 'Брелок управления сигнализацией', en: 'Alarm Remote Control Key Fob' },
  { geo: 'სიგნალიზაციის', ru: 'сигнализации', en: 'Alarm' },
  { geo: 'სიგნალიზაცია', ru: 'Сигнализация', en: 'Alarm System' },
  { geo: 'სახანძრო', ru: 'Пожарный', en: 'Fire Alarm' },
  { geo: 'საგანგაშო ღილაკი', ru: 'Тревожная кнопка', en: 'Panic Button' },
  { geo: 'საგანგაშო', ru: 'Тревожный', en: 'Emergency / Panic' },
  { geo: 'საევაკუაციო', ru: 'Эвакуационный', en: 'Emergency Exit' },
  { geo: 'სირენა სტრობით', ru: 'Сирена со стробоскопом', en: 'Siren with Strobe' },
  { geo: 'სირენა ციმციმით', ru: 'Сирена с мигалкой', en: 'Siren with Flasher' },
  { geo: 'სირენის', ru: 'сирены', en: 'Siren' },
  { geo: 'სირენა', ru: 'Сирена', en: 'Siren' },

  { geo: 'გარე გამოყენების', ru: 'Уличный (влагозащищенный)', en: 'Outdoor' },
  { geo: 'შიდა გამოყენების', ru: 'Внутренний (для помещений)', en: 'Indoor' },
  { geo: 'გამოყენების', ru: 'применения', en: 'Use' },

  { geo: 'სამონტაჟო ყუთი კამერისთვის', ru: 'Монтажная коробка для камер', en: 'Camera Junction Box' },
  { geo: 'სამონტაჟო ყუთი', ru: 'Монтажная коробка (Junction Box)', en: 'Junction Box' },
  { geo: 'სამონტაჟო კოლოფი', ru: 'Монтажный бокс', en: 'Mounting Box' },
  { geo: 'სამონტაჟო', ru: 'Монтажный', en: 'Mounting' },
  { geo: 'მონტაჟის', ru: 'монтажа', en: 'Mounting' },
  { geo: 'კედლის სამაგრი', ru: 'Настенный кронштейн', en: 'Wall Mount Bracket' },
  { geo: 'ჭერის სამაგრი', ru: 'Потолочный кронштейн', en: 'Ceiling Mount Bracket' },
  { geo: 'კუთხის სამაგრი', ru: 'Угловой кронштейн', en: 'Corner Mount Bracket' },
  { geo: 'ბოძის სამაგრი', ru: 'Кронштейн на столб', en: 'Pole Mount Bracket' },
  { geo: 'ტელევიზორის საკიდი', ru: 'Кронштейн для телевизора/монитора', en: 'TV/Monitor Wall Mount' },
  { geo: 'სამაგრი', ru: 'Кронштейн', en: 'Bracket / Mount' },
  { geo: 'კედლის', ru: 'настенный', en: 'Wall' },
  { geo: 'კედელზე', ru: 'на стену', en: 'Wall Mount' },
  { geo: 'კედლებში ჩასაშენებელი', ru: 'Встраиваемый в стену', en: 'in-Wall Flush Mount' },
  { geo: 'კედლებში', ru: 'в стену', en: 'in-Wall' },
  { geo: 'ჭერის', ru: 'потолочный', en: 'Ceiling' },
  { geo: 'კუთხის', ru: 'угловой', en: 'Corner' },
  { geo: 'ბოძის', ru: 'на столб', en: 'Pole' },
  { geo: 'სადგამი', ru: 'Стойка / Подставка', en: 'Stand' },
  { geo: 'ჩამოსაკიდი', ru: 'Подвесной', en: 'Pendant' },
  { geo: 'საკიდი', ru: 'Кронштейн подвеса', en: 'Hanger' },
  { geo: 'ფეხი', ru: 'Стойка / Ножка', en: 'Stand' },
  { geo: 'ყუთი', ru: 'Коробка', en: 'Box' },
  { geo: 'კოლოფი', ru: 'Коробка / Бокс', en: 'Box' },

  { geo: 'ტელეკომუნიკაციების კარადა', ru: 'Телекоммуникационный шкаф', en: 'Network Rack Cabinet' },
  { geo: 'კარადა', ru: 'Шкаф телекоммуникационный', en: 'Rack Cabinet' },
  { geo: 'რეკი', ru: 'Стойка серверная (Рэк)', en: 'Server Rack' },
  { geo: 'რეკის', ru: 'стойки', en: 'Rack' },
  { geo: 'რეკში', ru: 'в стойку', en: 'in Rack' },
  { geo: 'თარო', ru: 'Полка для рэка', en: 'Rack Shelf' },
  { geo: 'ორგანიზატორი', ru: 'Кабельный органайзер', en: 'Cable Organizer' },
  { geo: 'ჩარჩო', ru: 'Монтажная рамка', en: 'Mounting Frame' },
  { geo: 'ბაზა', ru: 'База / Основание', en: 'Base' },
  { geo: 'ბაზით', ru: 'с базой', en: 'with Base' },

  { geo: 'მყარი დისკი', ru: 'Жесткий диск HDD', en: 'Hard Drive HDD' },
  { geo: 'მყარი', ru: 'Жесткий', en: 'Hard' },
  { geo: 'დისკი', ru: 'диск', en: 'Drive' },
  { geo: 'მეხსიერების ბარათი', ru: 'Карта памяти MicroSD', en: 'MicroSD Memory Card' },
  { geo: 'მეხსიერების', ru: 'памяти', en: 'Memory' },
  { geo: 'მეხსიერება', ru: 'Память', en: 'Memory' },
  { geo: 'ოპერატიული მეხსიერება', ru: 'Оперативная память (RAM)', en: 'RAM Memory' },
  { geo: 'ოპერატიული', ru: 'Оперативная', en: 'RAM' },

  { geo: 'კვების ბლოკი აკუმულატორით', ru: 'Блок бесперебойного питания (ИБП)', en: 'Power Supply with Battery' },
  { geo: 'კვების ბლოკი', ru: 'Блок питания', en: 'Power Supply' },
  { geo: 'კვების წყარო', ru: 'Источник питания', en: 'Power Supply' },
  { geo: 'კვების', ru: 'питания', en: 'Power' },
  { geo: 'დენის', ru: 'питания', en: 'Power' },
  { geo: 'წყარო', ru: 'Источник', en: 'Source' },
  { geo: 'აკუმულატორი', ru: 'Аккумулятор', en: 'Battery' },
  { geo: 'ელემენტი', ru: 'Батарейка', en: 'Battery' },
  { geo: 'ლითიუმის', ru: 'литиевая', en: 'Lithium' },

  { geo: 'სვიჩი Poe', ru: 'PoE Коммутатор', en: 'PoE Switch' },
  { geo: 'სვიჩი', ru: 'Коммутатор', en: 'Switch' },
  { geo: 'როუტერი', ru: 'Роутер', en: 'Router' },
  { geo: 'ინჟექტორი', ru: 'PoE Инжектор', en: 'PoE Injector' },
  { geo: 'გამანაწილებელი', ru: 'Сплиттер', en: 'Splitter' },
  { geo: 'გამაფართოებელი', ru: 'Расширитель', en: 'Expander' },
  { geo: 'გადამცემი', ru: 'Передатчик', en: 'Transmitter' },
  { geo: 'ტრანსმითერი', ru: 'Трансмиттер', en: 'Transmitter' },
  { geo: 'ტრანსფორმატორი', ru: 'Трансформатор', en: 'Transformer' },
  { geo: 'კონვერტორი', ru: 'Конвертер', en: 'Converter' },
  { geo: 'გარდამქმნელი', ru: 'Преобразователь', en: 'Converter' },
  { geo: 'გადამყვანი', ru: 'Адаптер-переходник', en: 'Adapter' },

  { geo: 'კაბელი კონექტორით', ru: 'Кабель с разъемом', en: 'Cable with Connector' },
  { geo: 'კაბელი', ru: 'Кабель', en: 'Cable' },
  { geo: 'კაბელის', ru: 'кабеля', en: 'Cable' },
  { geo: 'კაბელიანი', ru: 'с кабелем', en: 'with Cable' },
  { geo: 'კონექტორით', ru: 'с разъемом', en: 'with Connector' },
  { geo: 'კონექტორი', ru: 'Разъем / Коннектор', en: 'Connector' },
  { geo: 'შემაერთებელი', ru: 'Соединитель', en: 'Connector' },
  { geo: 'დამაკავშირებელი', ru: 'Соединительный кабель', en: 'Connecting Cable' },
  { geo: 'ბალუნი', ru: 'Видеобалун', en: 'Video Balun' },
  { geo: 'ბალონი', ru: 'Видеобалун', en: 'Video Balun' },

  { geo: 'ბარათის წამკითხველი', ru: 'Считыватель карт', en: 'Card Reader' },
  { geo: 'წამკითხველის', ru: 'считывателя', en: 'Reader' },
  { geo: 'წამკითხველი', ru: 'Считыватель', en: 'Reader' },
  { geo: 'ბარათი', ru: 'Карта доступа', en: 'Access Card' },
  { geo: 'ბარათის', ru: 'карты', en: 'Card' },
  { geo: 'ბარათების', ru: 'карт', en: 'Cards' },
  { geo: 'ბრელოკი', ru: 'Брелок', en: 'Key Fob' },
  { geo: 'პროქსიმითი', ru: 'Proximity', en: 'Proximity' },

  { geo: 'დომოფონი', ru: 'Домофон', en: 'Intercom' },
  { geo: 'დომოფონის', ru: 'домофона', en: 'Intercom' },
  { geo: 'დომოფონიის', ru: 'домофонии', en: 'Intercom' },
  { geo: 'დომოფონისთვის', ru: 'для домофона', en: 'for Intercom' },
  { geo: 'ვიდეოდომოფონი', ru: 'Видеодомофон', en: 'Video Intercom' },
  { geo: 'მონიტორი', ru: 'Монитор', en: 'Monitor' },
  { geo: 'მონიტორის', ru: 'монитора', en: 'Monitor' },
  { geo: 'პანელი', ru: 'Панель', en: 'Panel' },
  { geo: 'პანელის', ru: 'панели', en: 'Panel' },
  { geo: 'ტერმინალი', ru: 'Терминал', en: 'Terminal' },
  { geo: 'ტერმინალის', ru: 'терминала', en: 'Terminal' },
  { geo: 'კლავიატურა', ru: 'Клавиатура', en: 'Keypad' },
  { geo: 'ღილაკი', ru: 'Кнопка', en: 'Button' },
  { geo: 'ღილაკის', ru: 'кнопки', en: 'Button' },
  { geo: 'პულტი', ru: 'Пульт ДУ', en: 'Remote' },
  { geo: 'სამართავი', ru: 'управления', en: 'Control' },
  { geo: 'ჭუჭრუტანა', ru: 'Видеоглазок', en: 'Door Viewer' },

  // Attributes
  { geo: 'უკაბელო', ru: 'Беспроводной', en: 'Wireless' },
  { geo: 'სადენიანი', ru: 'Проводной', en: 'Wired' },
  { geo: 'ჩასაშენებელი', ru: 'Встраиваемый', en: 'Flush Mount' },
  { geo: 'ჰიბრიდული', ru: 'Гибридный', en: 'Hybrid' },
  { geo: 'კომბინირებული', ru: 'Комбинированный', en: 'Combined' },
  { geo: 'კომბინირებლი', ru: 'Комбинированный', en: 'Combined' },
  { geo: 'კომბინირებულია', ru: 'Комбинированный', en: 'Combined' },
  { geo: 'ჭკვიანი', ru: 'Умный (Smart)', en: 'Smart' },
  { geo: 'კომპლექტი', ru: 'Комплект', en: 'Kit' },
  { geo: 'მოდული', ru: 'Модуль', en: 'Module' },
  { geo: 'მოდულისთვის', ru: 'для модуля', en: 'for Module' },
  { geo: 'კონტროლერი', ru: 'Контроллер', en: 'Controller' },
  { geo: 'კონტროლის', ru: 'контроля', en: 'Control' },
  { geo: 'საკონტროლო', ru: 'Контрольный', en: 'Control' },
  { geo: 'საკომუნიკაციო', ru: 'Коммуникационный', en: 'Communication' },
  { geo: 'სისტემები', ru: 'Системы', en: 'Systems' },
  { geo: 'სისტემებისთვის', ru: 'для систем', en: 'for Systems' },
  { geo: 'სერია', ru: 'Серия', en: 'Series' },
  { geo: 'სერიის', ru: 'серии', en: 'Series' },
  { geo: 'სერიებისთვის', ru: 'для серий', en: 'for Series' },
  { geo: 'პორტი', ru: 'порт', en: 'Port' },
  { geo: 'არხი', ru: 'канал', en: 'Channel' },
  { geo: 'არხის', ru: 'канала', en: 'Channel' },
  { geo: 'არხიანი', ru: '-канальный', en: '-Channel' },
  { geo: 'მიკროფონით', ru: 'с микрофоном', en: 'with Mic' },
  { geo: 'მიკროფონი', ru: 'Микрофон', en: 'Microphone' },
  { geo: 'განათებით', ru: 'с подсветкой', en: 'with Light' },
  { geo: 'განათება', ru: 'Подсветка', en: 'Light' },
  { geo: 'ნათებით', ru: 'с подсветкой', en: 'with Light' },
  { geo: 'მხარდაჭერით', ru: 'с поддержкой', en: 'with support' },
  { geo: 'წყალგაუმტარი', ru: 'Влагозащищенный IP67', en: 'Waterproof IP67' },
  { geo: 'პლასტმასის', ru: 'пластиковый', en: 'Plastic' },
  { geo: 'პლასტმასი', ru: 'пластик', en: 'Plastic' },
  { geo: 'პლასტიკური', ru: 'пластиковый', en: 'Plastic' },
  { geo: 'მეტალის', ru: 'металлический', en: 'Metal' },
  { geo: 'მეტალი', ru: 'металл', en: 'Metal' },
  { geo: 'რკინის', ru: 'металлический', en: 'Metal' },
  { geo: 'კორპუსით', ru: 'в корпусе', en: 'in Housing' },
  { geo: 'შავი', ru: 'Черный', en: 'Black' },
  { geo: 'თეთრი', ru: 'Белый', en: 'White' },
  { geo: 'ნაცრისფერი', ru: 'Серый', en: 'Grey' },
  { geo: 'წითელი', ru: 'Красный', en: 'Red' },
  { geo: 'ლურჯი', ru: 'Синий', en: 'Blue' },
  { geo: 'მწვანე', ru: 'Зеленый', en: 'Green' },
  { geo: 'ოქროსფერი', ru: 'Золотистый', en: 'Gold' },
  { geo: 'წყვილი', ru: 'пара', en: 'Pair' },
  { geo: 'ტროსით', ru: 'с тросом', en: 'with Wire' },
  { geo: 'დისტანციური', ru: 'Дистанционный', en: 'Remote' },
  { geo: 'მართვის', ru: 'управления', en: 'Control' },
  { geo: 'ინტერაქტიული', ru: 'Интерактивный', en: 'Interactive' },
  { geo: 'დისფლეი', ru: 'Дисплей', en: 'Display' },
  { geo: 'ეკრანით', ru: 'с экраном', en: 'with Screen' },
  { geo: 'ეკრანის', ru: 'экрана', en: 'Screen' },
  { geo: 'საკონფერენციო', ru: 'Конференц-', en: 'Conference' },
  { geo: 'ხმამაღლამოლაპარაკე', ru: 'Спикерфон', en: 'Speakerphone' },
  { geo: 'რობოტი', ru: 'Робот', en: 'Robot' },
  { geo: 'მტვერსასრუტის', ru: 'пылесоса', en: 'Vacuum' },
  { geo: 'მტვრის', ru: 'пыли', en: 'Dust' },
  { geo: 'ტომარა', ru: 'Мешок', en: 'Bag' },
  { geo: 'ინდიკატორი', ru: 'Индикатор', en: 'Indicator' },
  { geo: 'მაჩვენებელი', ru: 'Индикатор', en: 'Indicator' },
  { geo: 'რელე', ru: 'Реле', en: 'Relay' },
  { geo: 'კონტაქტი', ru: 'Контакт', en: 'Contact' },
  { geo: 'პლატა', ru: 'Плата', en: 'Board' },
  { geo: 'პროგრამატორი', ru: 'Программатор', en: 'Programmer' },
  { geo: 'კონფიგურატორი', ru: 'Конфигуратор', en: 'Configurator' },
  { geo: 'კლიენტი', ru: 'Клиент', en: 'Client' },
  { geo: 'და', ru: 'и', en: 'and' },
];

// Sort dictionary by geo length descending (CRITICAL: prevents prefix collision)
DICTIONARY.sort((a, b) => b.geo.length - a.geo.length);

function translateClean(text, lang) {
  if (!text || lang === 'ka') return text;
  let res = text;

  // 1. First replace numbered units
  if (lang === 'ru') {
    res = res.replace(/(\d+(?:\.\d+)?)\s*მპ\b/gi, '$1 Мп');
    res = res.replace(/(\d+(?:\.\d+)?)\s*მმ\b/gi, '$1 мм');
    res = res.replace(/(\d+)\s*არხიანი\b/gi, '$1-канальный');
    res = res.replace(/(\d+)\s*პორტიანი\b/gi, '$1-портовый');
    res = res.replace(/(\d+)\s*მეტრი\b/gi, '$1м');
    res = res.replace(/(\d+)\s*მ\b/gi, '$1м');
  } else {
    res = res.replace(/(\d+(?:\.\d+)?)\s*მპ\b/gi, '$1MP');
    res = res.replace(/(\d+(?:\.\d+)?)\s*მმ\b/gi, '$1mm');
    res = res.replace(/(\d+)\s*არხიანი\b/gi, '$1-Channel');
    res = res.replace(/(\d+)\s*პორტიანი\b/gi, '$1-Port');
    res = res.replace(/(\d+)\s*მეტრი\b/gi, '$1m');
    res = res.replace(/(\d+)\s*მ\b/gi, '$1m');
  }

  // 2. Exact phrase and word replacement (longest matches first)
  DICTIONARY.forEach(({ geo, ru, en }) => {
    const replacement = lang === 'ru' ? ru : en;
    const regex = new RegExp(geo, 'gi');
    res = res.replace(regex, replacement);
  });

  return res.replace(/\s+/g, ' ').trim();
}

// Test sample
const products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
console.log('--- TEST RESULTS AFTER FIX ---');
products.slice(0, 20).forEach((p, i) => {
  console.log(`[${i+1}] GEO: ${p.title}`);
  console.log(`    RU:  ${translateClean(p.title, 'ru')}`);
  console.log(`    EN:  ${translateClean(p.title, 'en')}`);
});
