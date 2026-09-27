import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { StoreProvider } from "@/context/StoreContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Language } from "@/data/translations";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HYKON.GE — უსაფრთხოების სისტემები, IP კამერები და ქსელური მოწყობილობები",
    template: "%s | HYKON.GE",
  },
  description:
    "ვიდეომეთვალყურეობის, დაცვითი სიგნალიზაციის (Ajax, Paradox), IP კამერების (Uniview, Hikvision, HiLook) და ქსელური მოწყობილობების ოფიციალური დისტრიბუტორი საქართველოში. ბათუმი. ტელ: +995 591 43 25 25.",
  keywords: [
    "ვიდეომეთვალყურეობა",
    "IP კამერები ბათუმი",
    "IP კამერები საქართველო",
    "Hikvision Georgia",
    "Uniview Georgia",
    "HiLook",
    "Ajax Systems Georgia",
    "დაცვითი სიგნალიზაცია",
    "NVR ჩამწერები",
    "PoE სვიჩები",
    "ZKTeco დომოფონია",
    "Seagate SkyHawk",
    "WD Purple",
    "CCTV cameras Batumi",
    "Security systems Georgia",
    "Hykon.ge",
  ],
  metadataBase: new URL("https://hykon.ge"),
  alternates: {
    canonical: "/",
    languages: {
      "ka-GE": "https://hykon.ge",
      "en-US": "https://hykon.ge/en",
      "ru-RU": "https://hykon.ge/ru",
      "x-default": "https://hykon.ge",
    },
  },
  authors: [{ name: "HYKON.GE", url: "https://hykon.ge" }],
  creator: "HYKON.GE",
  publisher: "HYKON.GE",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  category: "technology",
  openGraph: {
    title: "HYKON.GE — უსაფრთხოების სისტემები და ვიდეომეთვალყურეობა",
    description: "ოფიციალური გარანტია, სწრაფი მიწოდება მთელ საქართველოში და პროფესიონალური მონტაჟი.",
    url: "https://hykon.ge",
    siteName: "HYKON.GE",
    locale: "ka_GE",
    alternateLocale: ["en_US", "ru_RU"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HYKON.GE — Security Systems & CCTV in Georgia",
    description: "Official distributor of Uniview, Hikvision, Ajax, ZKTeco and Ruijie in Georgia.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "GE-AJ",
    "geo.placename": "Batumi",
    "geo.position": "41.6461;41.6405",
    "ICBM": "41.6461, 41.6405",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const headerLang = headersList.get('x-hykon-lang');
  const initialLang: Language = (headerLang === 'ru' || headerLang === 'en' || headerLang === 'ka')
    ? headerLang
    : 'ka';

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "Store", "LocalBusiness"],
    name: "I/E Hykon",
    alternateName: ["ი.მ. Hykon", "HYKON.GE"],
    url: "https://hykon.ge",
    logo: "https://hykon.ge/images/logo.png",
    image: "https://hykon.ge/images/logo.png",
    telephone: "+995591432525",
    email: "support@hykon.ge",
    taxID: "61001070627",
    priceRange: "₾₾",
    currenciesAccepted: "GEL",
    paymentAccepted: "Cash, Credit Card, Bank Transfer, RS.GE Invoice",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Batumi",
      addressLocality: "Batumi",
      addressRegion: "Adjara",
      postalCode: "6000",
      addressCountry: "GE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.6461,
      longitude: 41.6405,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "21:00",
      },
    ],
    sameAs: [
      "https://facebook.com/hykon.ge",
      "https://instagram.com/hykon.ge",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HYKON.GE",
    url: "https://hykon.ge",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://hykon.ge/catalog?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang={initialLang} className="scroll-smooth">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PM42CL54XY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-PM42CL54XY');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen bg-white text-zinc-950 font-sans antialiased flex flex-col">
        <StoreProvider>
          <LanguageProvider initialLanguage={initialLang}>
            {children}
          </LanguageProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
