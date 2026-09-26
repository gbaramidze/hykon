import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ბლოგი და გზამკვლევები — ვიდეომეთვალყურეობა და უსაფრთხოების სისტემები',
  description:
    'სასარგებლო სტატიები, შედარებები, რჩევები IP კამერების შერჩევის, Ajax დაცვითი სიგნალიზაციის მონტაჟის და NVR/DVR სისტემების შესახებ.',
  alternates: {
    canonical: 'https://hykon.ge/blog',
    languages: {
      ka: 'https://hykon.ge/blog',
      en: 'https://hykon.ge/en/blog',
      ru: 'https://hykon.ge/ru/blog',
    },
  },
  openGraph: {
    title: 'ბლოგი & სიახლეები | HYKON.GE',
    description: 'გაიგეთ მეტი თანამედროვე უსაფრთხოების ტექნოლოგიებზე და ექსპერტულ რჩევებზე.',
    url: 'https://hykon.ge/blog',
    siteName: 'HYKON.GE',
    type: 'website',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
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
        name: 'ბლოგი',
        item: 'https://hykon.ge/blog',
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
