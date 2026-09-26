'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Language, TRANSLATIONS, TranslationDictionary } from '@/data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  translateProductTitle: (title: string) => string;
  translateCategoryName: (name: string) => string;
  translateDescription: (description: string) => string;
  translateSpecGroup: (group: string) => string;
  translateSpecName: (name: string) => string;
  translateSpecValue: (value: string) => string;
  getLocalizedHref: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Comprehensive dictionary for phrases and terms (sorted by length descending to prevent sub-string collision)
const MASTER_DICTIONARY: { geo: string; ru: string; en: string }[] = [
  // 1. Multi-word phrases (Longest first)
  { geo: 'უსაფრთხოების სისტემები', ru: 'Системы безопасности', en: 'Security Systems' },
  { geo: 'უსაფრთხოების სისტემა', ru: 'Система безопасности', en: 'Security System' },
  { geo: 'უსაფრთხოების', ru: 'безопасности', en: 'Security' },
  { geo: 'უსაფრთხოება', ru: 'Безопасность', en: 'Security' },

  { geo: 'ვიდეო მეთვალყურეობა', ru: 'Видеонаблюдение', en: 'Video Surveillance' },
  { geo: 'ვიდეომეთვალყურეობა', ru: 'Видеонаблюдение', en: 'Video Surveillance' },

  { geo: 'ქსელური მოწყობილობები', ru: 'Сетевое оборудование', en: 'Network Equipment' },
  { geo: 'ქსელური მოწყობილობა', ru: 'Сетевое оборудование', en: 'Network Equipment' },

  { geo: 'დაშვების წერტილი', ru: 'Точка доступа Wi-Fi', en: 'Wi-Fi Access Point' },
  { geo: 'დაშვების კონტროლის ტერმინალი', ru: 'Терминал контроля доступа', en: 'Access Control Terminal' },
  { geo: 'დაშვების კონტროლის სისტემა', ru: 'Система контроля доступа (СКУД)', en: 'Access Control System' },
  { geo: 'დაშვების კონტროლის', ru: 'контроля доступа', en: 'Access Control' },
  { geo: 'დაშვების კონტროლი და დომოფონები', ru: 'СКУД и Домофоны', en: 'Access Control & Intercoms' },
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
  { geo: 'ტელევიზორის', ru: 'телевизора', en: 'TV' },
  { geo: 'ნგრევის', ru: 'разбития / разрушения', en: 'Break' },
  { geo: 'ქსელის', ru: 'сетевой', en: 'network' },
  { geo: 'ქსელური', ru: 'Сетевой', en: 'Network' },
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
  { geo: 'საავტომობილო', ru: 'Автомобильный', en: 'Automotive' },
  { geo: 'სპეციალიზირებული', ru: 'специализированный', en: 'Specialized' },
  { geo: 'სპეციალიზი', ru: 'специализированный', en: 'Specialized' },
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
MASTER_DICTIONARY.sort((a, b) => b.geo.length - a.geo.length);

// Specification group names
const SPEC_GROUPS_MAP: Record<string, { en: string; ru: string }> = {
  'ძირითადი მახასიათებლები': { en: 'Main Specifications', ru: 'Основные характеристики' },
  'კამერის პარამეტრები': { en: 'Camera Specifications', ru: 'Параметры камеры' },
  'ობიექტივი და ხედვა': { en: 'Lens & Field of View', ru: 'Объектив и угол обзора' },
  'განათება და ღამის ხედვა': { en: 'Illumination & Night Vision', ru: 'Подсветка и ночное видение' },
  'ვიდეო და აუდიო': { en: 'Video & Audio', ru: 'Видео и аудио' },
  'ქსელი და ინტერფეისები': { en: 'Network & Interfaces', ru: 'Сеть и интерфейсы' },
  'კვება და ენერგომოხმარება': { en: 'Power & Consumption', ru: 'Питание и энергопотребление' },
  'კორპუსი და გარემო პირობები': { en: 'Housing & Environment', ru: 'Корпус и условия эксплуатации' },
  'ზოგადი მონაცემები': { en: 'General Specifications', ru: 'Общие характеристики' },
  'პარამეტრები': { en: 'Parameters', ru: 'Параметры' },
};

// Specification item names
const SPEC_NAMES_MAP: Record<string, { en: string; ru: string }> = {
  'ბრენდი': { en: 'Brand', ru: 'Бренд' },
  'არტიკული (SKU)': { en: 'SKU / Model Code', ru: 'Артикул (SKU)' },
  'მოდელი': { en: 'Model', ru: 'Модель' },
  'გარანტია': { en: 'Warranty', ru: 'Гарантия' },
  'სტატუსი': { en: 'Availability', ru: 'Наличие' },
  'ტიპი': { en: 'Device Type', ru: 'Тип устройства' },
  'მატრიცა': { en: 'Image Sensor', ru: 'Матрица (сенсор)' },
  'გაფართოება': { en: 'Resolution', ru: 'Разрешение' },
  'მეგაპიქსელი': { en: 'Megapixels', ru: 'Мегапиксели' },
  'ობიექტივი': { en: 'Lens', ru: 'Объектив' },
  'ფოკუსური მანძილი': { en: 'Focal Length', ru: 'Фокусное расстояние' },
  'ხედვის კუთხე': { en: 'Field of View (FOV)', ru: 'Угол обзора' },
  'ღამის ხედვა': { en: 'Night Vision', ru: 'Ночная подсветка' },
  'IR განათების მანძილი': { en: 'IR Illumination Range', ru: 'Дальность ИК подсветки' },
  'განათების მანძილი': { en: 'Illumination Distance', ru: 'Дальность подсветки' },
  'ვიდეო კომპრესია': { en: 'Video Compression', ru: 'Сжатие видео' },
  'კადრების სიხშირე': { en: 'Frame Rate', ru: 'Частота кадров' },
  'აუდიო': { en: 'Audio', ru: 'Аудио' },
  'მიკროფონი': { en: 'Microphone', ru: 'Микрофон' },
  'დინამიკი': { en: 'Speaker', ru: 'Динамик' },
  'ორმხრივი აუდიო': { en: 'Two-way Audio', ru: 'Двусторонняя аудиосвязь' },
  'ინტერფეისი': { en: 'Interfaces', ru: 'Интерфейсы' },
  'ქსელის პორტი': { en: 'Ethernet Port', ru: 'Сетевой порт RJ45' },
  'PoE მხარდაჭერა': { en: 'PoE Support', ru: 'Поддержка PoE' },
  'Wi-Fi მხარდაჭერა': { en: 'Wi-Fi Support', ru: 'Поддержка Wi-Fi' },
  'მეხსიერების ბარათი': { en: 'MicroSD Card Slot', ru: 'Слот для карты памяти MicroSD' },
  'მაქს. მეხსიერება': { en: 'Max Memory Support', ru: 'Макс. объем карты' },
  'კვება': { en: 'Power Supply', ru: 'Питание' },
  'ენერგომოხმარება': { en: 'Power Consumption', ru: 'Потребляемая мощность' },
  'დაცვის კლასი': { en: 'Ingress Protection (IP)', ru: 'Класс защиты IP' },
  'ვანდალგამძლეობა': { en: 'Vandal Resistance (IK)', ru: 'Антивандальная защита IK' },
  'სამუშაო ტემპერატურა': { en: 'Operating Temperature', ru: 'Рабочая температура' },
  'ზომები': { en: 'Dimensions', ru: 'Габариты' },
  'წონა': { en: 'Weight', ru: 'Вес' },
  'კორპუსის მასალა': { en: 'Housing Material', ru: 'Материал корпуса' },
  'ფერი': { en: 'Color', ru: 'Цвет' },
  'არხების რაოდენობა': { en: 'Number of Channels', ru: 'Количество каналов' },
  'HDD სლოტი': { en: 'HDD Slots', ru: 'Количество HDD' },
  'მაქს. HDD ტევადობა': { en: 'Max HDD Capacity', ru: 'Макс. емкость HDD' },
  'HDMI გამომავალი': { en: 'HDMI Output', ru: 'HDMI выход' },
  'VGA გამომავალი': { en: 'VGA Output', ru: 'VGA выход' },
  'PoE პორტები': { en: 'PoE Ports', ru: 'PoE порты' },
  'PoE ბიუჯეტი': { en: 'PoE Budget', ru: 'Бюджет PoE' },
  'სიჩქარე': { en: 'Data Rate', ru: 'Скорость передачи' },
  'სიხშირის დიაპაზონი': { en: 'Frequency Range', ru: 'Диапазон частот' },
};

// Specification common values
const SPEC_VALUES_MAP: Record<string, { en: string; ru: string }> = {
  'მარაგშია': { en: 'In Stock', ru: 'В наличии' },
  'შეკვეთით': { en: 'On Order', ru: 'Под заказ' },
  'არ არის მარაგში': { en: 'Out of Stock', ru: 'Нет в наличии' },
  '1 წელი': { en: '1 Year', ru: '1 год' },
  '2 წელი': { en: '2 Years', ru: '2 года' },
  '3 წელი': { en: '3 Years', ru: '3 года' },
  '5 წელი': { en: '5 Years', ru: '5 лет' },
  'კი': { en: 'Yes', ru: 'Да' },
  'დიახ': { en: 'Yes', ru: 'Да' },
  'არა': { en: 'No', ru: 'Нет' },
  'ჩაშენებული': { en: 'Built-in', ru: 'Встроенный' },
  'მეტალი': { en: 'Metal', ru: 'Металл' },
  'პლასტმასი': { en: 'Plastic', ru: 'Пластик' },
  'მეტალი / პლასტმასი': { en: 'Metal / Plastic', ru: 'Металл / Пластик' },
  'შიდა': { en: 'Indoor', ru: 'Внутреннее' },
  'გარე': { en: 'Outdoor', ru: 'Уличное' },
  'თეთრი': { en: 'White', ru: 'Белый' },
  'შავი': { en: 'Black', ru: 'Черный' },
  'ნაცრისფერი': { en: 'Grey', ru: 'Серый' },
  'სადენიანი': { en: 'Wired', ru: 'Проводной' },
  'უსადენო': { en: 'Wireless', ru: 'Беспроводной' },
  'ჰიბრიდული': { en: 'Hybrid', ru: 'Гибридный' },
};

// Categories map
const CATEGORY_MAP: Record<string, { en: string; ru: string }> = {
  'უსაფრთხოების სისტემები': { en: 'Security Systems', ru: 'Системы безопасности' },
  'ვიდეო მეთვალყურეობა': { en: 'Video Surveillance', ru: 'Видеонаблюдение' },
  'ქსელური მოწყობილობები': { en: 'Network Equipment', ru: 'Сетевое оборудование' },
  'IP კამერები': { en: 'IP Cameras', ru: 'IP Камеры' },
  'ანალოგური / HD კამერები': { en: 'Analog / HD Cameras', ru: 'Аналоговые / HD Камеры' },
  'ანალოგური / HD-TVI კამერები': { en: 'Analog / HD-TVI Cameras', ru: 'Аналоговые / HD-TVI Камеры' },
  'IP ვიდეო-ჩამწერები (NVR)': { en: 'IP NVR Recorders', ru: 'IP Видеорегистраторы (NVR)' },
  'ანალოგური ვიდეო-ჩამწერები (DVR)': { en: 'Analog DVR Recorders', ru: 'Аналоговые Видеорегистраторы (DVR)' },
  'ანალოგური ვიდეო-ჩამწერები (DVR/XVR)': { en: 'Analog DVR/XVR Recorders', ru: 'Аналоговые Видеорегистраторы (DVR/XVR)' },
  'დაცვითი სიგნალიზაცია': { en: 'Security Alarm Systems', ru: 'Охранная сигнализация' },
  'დაცვითი სიგნალიზაცია (Ajax / Paradox)': { en: 'Security Alarm Systems (Ajax / Paradox)', ru: 'Охранная сигнализация (Ajax / Paradox)' },
  'დაშვების კონტროლი და დომოფონები': { en: 'Access Control & Intercoms', ru: 'СКУД и Домофоны' },
  'მყარი დისკები და მეხსიერება': { en: 'Hard Drives & Storage', ru: 'Жесткие диски и память' },
  'PoE და ქსელური სვიჩები': { en: 'PoE & Network Switches', ru: 'PoE и сетевые коммутаторы' },
  'როუტერები და Wi-Fi წერტილები': { en: 'Routers & Wi-Fi Access Points', ru: 'Роутеры и точки доступа' },
  'კვების ბლოკები და PoE': { en: 'Power Supplies & PoE', ru: 'Блоки питания и PoE' },
  'სამაგრები და აქსესუარები': { en: 'Brackets & Accessories', ru: 'Кронштейны и аксессуары' },
  'კაბელები და კონექტორები': { en: 'Cables & Connectors', ru: 'Кабели и разъемы' },
};

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
  initialLanguage?: Language;
}> = ({ children, initialLanguage }) => {
  const pathname = usePathname();
  const router = useRouter();

  // Determine language from current URL pathname
  const getLanguageFromPath = useCallback((path: string): Language => {
    if (path.startsWith('/ru/') || path === '/ru') return 'ru';
    if (path.startsWith('/en/') || path === '/en') return 'en';
    return 'ka';
  }, []);

  const [language, setLanguageState] = useState<Language>(() => {
    if (initialLanguage) return initialLanguage;
    if (typeof window !== 'undefined') {
      const urlLang = getLanguageFromPath(window.location.pathname);
      if (urlLang !== 'ka') return urlLang;
      try {
        const saved = localStorage.getItem('hykon_language') as Language;
        if (saved === 'ru' || saved === 'en' || saved === 'ka') return saved;
      } catch {}
    }
    return 'ka';
  });

  // Keep state in sync with URL changes (e.g. direct URL navigation, back/forward buttons)
  useEffect(() => {
    if (pathname) {
      const urlLang = getLanguageFromPath(pathname);
      setLanguageState(prev => {
        if (prev !== urlLang) {
          try {
            localStorage.setItem('hykon_language', urlLang);
            document.cookie = `hykon_language=${urlLang}; path=/; max-age=31536000; SameSite=Lax`;
            document.documentElement.lang = urlLang;
          } catch {}
          return urlLang;
        }
        return prev;
      });
    }
  }, [pathname, getLanguageFromPath]);

  // Language switch handler: updates URL path + slug navigation smoothly
  const setLanguage = useCallback(
    (newLang: Language) => {
      setLanguageState(newLang);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('hykon_language', newLang);
          document.cookie = `hykon_language=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
          document.documentElement.lang = newLang;
        } catch {}

        const currentPath = window.location.pathname;
        const currentSearch = window.location.search || '';
        const currentHash = window.location.hash || '';

        // Strip existing /ru or /en prefix
        const cleanPath = currentPath.replace(/^\/(ru|en)(\/|$)/, '/');

        let targetPath = cleanPath;
        if (newLang === 'ru') {
          targetPath = cleanPath === '/' ? '/ru' : `/ru${cleanPath}`;
        } else if (newLang === 'en') {
          targetPath = cleanPath === '/' ? '/en' : `/en${cleanPath}`;
        }

        const fullTargetUrl = `${targetPath}${currentSearch}${currentHash}`;
        const currentFullUrl = `${currentPath}${currentSearch}${currentHash}`;

        if (fullTargetUrl !== currentFullUrl) {
          router.push(fullTargetUrl);
        }
      }
    },
    [router]
  );

  const t = TRANSLATIONS[language] || TRANSLATIONS.ka;

  const getLocalizedHref = useCallback(
    (path: string): string => {
      if (!path) return '/';
      const cleanPath = path.replace(/^\/(ru|en)(\/|$)/, '/');
      if (language === 'ru') {
        return cleanPath === '/' ? '/ru' : `/ru${cleanPath}`;
      }
      if (language === 'en') {
        return cleanPath === '/' ? '/en' : `/en${cleanPath}`;
      }
      return cleanPath;
    },
    [language]
  );

  const translateProductTitle = useCallback(
    (title: string): string => {
      if (!title || language === 'ka') return title;

      let res = title;

      // 1. Numbered units
      if (language === 'ru') {
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

      // 2. Dictionary replacements (longest entries first)
      MASTER_DICTIONARY.forEach(({ geo, ru, en }) => {
        const replacement = language === 'ru' ? ru : en;
        const regex = new RegExp(geo, 'gi');
        res = res.replace(regex, replacement);
      });

      return res.replace(/\s+/g, ' ').trim();
    },
    [language]
  );

  const translateCategoryName = useCallback(
    (name: string): string => {
      if (!name || language === 'ka') return name;
      return CATEGORY_MAP[name]?.[language] || translateProductTitle(name);
    },
    [language, translateProductTitle]
  );

  const translateDescription = useCallback(
    (description: string): string => {
      if (!description || language === 'ka') return description;
      return translateProductTitle(description);
    },
    [language, translateProductTitle]
  );

  const translateSpecGroup = useCallback(
    (group: string): string => {
      if (!group || language === 'ka') return group;
      return SPEC_GROUPS_MAP[group]?.[language] || translateProductTitle(group);
    },
    [language, translateProductTitle]
  );

  const translateSpecName = useCallback(
    (name: string): string => {
      if (!name || language === 'ka') return name;
      return SPEC_NAMES_MAP[name]?.[language] || translateProductTitle(name);
    },
    [language, translateProductTitle]
  );

  const translateSpecValue = useCallback(
    (value: string): string => {
      if (!value || language === 'ka') return value;
      return SPEC_VALUES_MAP[value]?.[language] || translateProductTitle(value);
    },
    [language, translateProductTitle]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translateProductTitle,
        translateCategoryName,
        translateDescription,
        translateSpecGroup,
        translateSpecName,
        translateSpecValue,
        getLocalizedHref,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
