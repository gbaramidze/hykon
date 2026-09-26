import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'კონტაქტები და შოურუმი ბათუმში — ტელ: +995 591 43 25 25',
  description:
    'Hykon.ge-ს შოურუმი და საწყობი ბათუმში. კონსულტაცია, შეკვეთების თვითგატანა და ტექნიკური მომსახურება. ტელეფონი: +995 591 43 25 25, Email: support@hykon.ge.',
  alternates: {
    canonical: 'https://hykon.ge/contacts',
    languages: {
      ka: 'https://hykon.ge/contacts',
      en: 'https://hykon.ge/en/contacts',
      ru: 'https://hykon.ge/ru/contacts',
    },
  },
  openGraph: {
    title: 'კონტაქტები | HYKON.GE',
    description: 'დაგვიკავშირდით ან გვეწვიეთ შოურუმში ბათუმში. ტელ: +995 591 43 25 25.',
    url: 'https://hykon.ge/contacts',
    siteName: 'HYKON.GE',
    type: 'website',
  },
};

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'HYKON.GE კონტაქტები',
    description: 'კონტაქტები, ტელეფონის ნომერი და შოურუმის მისამართი ბათუმში.',
    url: 'https://hykon.ge/contacts',
    mainEntity: {
      '@type': 'Store',
      name: 'HYKON.GE Batumi',
      telephone: '+995591432525',
      email: 'support@hykon.ge',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Batumi',
        addressLocality: 'Batumi',
        addressCountry: 'GE',
      },
    },
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
        name: 'კონტაქტები',
        item: 'https://hykon.ge/contacts',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
