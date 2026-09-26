import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'მწარმოებლები და ბრენდები — Uniview, Hikvision, Ajax, HiLook, ZKTeco',
  description:
    'ოფიციალური პარტნიორი და დისტრიბუტორი საქართველოში: Uniview, Hikvision, HiLook, Ajax Systems, ZKTeco, Seagate, Western Digital, Ruijie. გარანტია და მომსახურება.',
  alternates: {
    canonical: 'https://hykon.ge/brands',
    languages: {
      ka: 'https://hykon.ge/brands',
      en: 'https://hykon.ge/en/brands',
      ru: 'https://hykon.ge/ru/brands',
    },
  },
  openGraph: {
    title: 'ოფიციალური ბრენდები და მწარმოებლები | HYKON.GE',
    description: 'მსოფლიო წამყვანი უსაფრთხოების სისტემების მწარმოებლები ერთ სივრცეში.',
    url: 'https://hykon.ge/brands',
    siteName: 'HYKON.GE',
    type: 'website',
  },
};

export default function BrandsLayout({ children }: { children: React.ReactNode }) {
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
        name: 'ბრენდები',
        item: 'https://hykon.ge/brands',
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
