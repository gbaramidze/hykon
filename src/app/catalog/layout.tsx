import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'კატალოგი — უსაფრთხოების სისტემები, IP კამერები და ქსელური მოწყობილობები',
  description:
    'ვიდეოსამეთვალყურეო IP კამერები (Uniview, Hikvision, HiLook), NVR/DVR ჩამწერები, დაცვითი სიგნალიზაცია (Ajax, Paradox), დაშვების კონტროლი (ZKTeco) და ქსელური მოწყობილობები საუკეთესო ფასად.',
  alternates: {
    canonical: 'https://hykon.ge/catalog',
    languages: {
      ka: 'https://hykon.ge/catalog',
      en: 'https://hykon.ge/en/catalog',
      ru: 'https://hykon.ge/ru/catalog',
    },
  },
  openGraph: {
    title: 'პროდუქციის სრული კატალოგი | HYKON.GE',
    description: 'შეარჩიეთ საუკეთესო უსაფრთხოების სისტემები და IP კამერები ოფიციალური გარანტიით ბათუმში.',
    url: 'https://hykon.ge/catalog',
    siteName: 'HYKON.GE',
    type: 'website',
  },
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
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
        name: 'კატალოგი',
        item: 'https://hykon.ge/catalog',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
