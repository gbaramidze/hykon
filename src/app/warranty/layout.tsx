import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'საგარანტიო პირობები და სერვისი',
  description:
    'ოფიციალური საგარანტიო მომსახურება ყველა მოწყობილობაზე 1-დან 3 წლამდე. გაეცანით საგარანტიო პირობებს, სერვისს და შეცვლის წესებს.',
  alternates: {
    canonical: 'https://hykon.ge/warranty',
    languages: {
      ka: 'https://hykon.ge/warranty',
      en: 'https://hykon.ge/en/warranty',
      ru: 'https://hykon.ge/ru/warranty',
    },
  },
  openGraph: {
    title: 'საგარანტიო პირობები | HYKON.GE',
    description: 'ოფიციალური გარანტია და ტექნიკური მხარდაჭერა ყველა პროდუქტზე.',
    url: 'https://hykon.ge/warranty',
    siteName: 'HYKON.GE',
    type: 'website',
  },
};

export default function WarrantyLayout({ children }: { children: React.ReactNode }) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'რა ვადით ვრცელდება ოფიციალური გარანტია?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hykon.ge-ზე შეძენილ ყველა ორიგინალ მოწყობილობაზე (Uniview, Hikvision, Ajax, HiLook და სხვ.) ვრცელდება 12-დან 36 თვემდე ოფიციალური საგარანტიო მომსახურება.',
        },
      },
      {
        '@type': 'Question',
        name: 'რა შემთხვევაში მოქმედებს საგარანტიო შეცვლა ან შეკეთება?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'გარანტია ფარავს ქარხნულ დეფექტებსა და ტექნიკურ გაუმართაობას. საგარანტიო მომსახურების მისაღებად საჭიროა საგარანტიო ტალონი ან შესყიდვის დამადასტურებელი დოკუმენტი.',
        },
      },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'მთავარი',
        item: 'https://hykon.ge',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'გარანტია',
        item: 'https://hykon.ge/warranty',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
