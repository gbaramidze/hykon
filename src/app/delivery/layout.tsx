import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'მიწოდების და გადახდის პირობები მთელ საქართველოში',
  description:
    'სწრაფი საკურიერო მიწოდება ბათუმში, თბილისში და საქართველოს ყველა რეგიონში. გადახდა საბანკო ბარათით, RS.GE ინვოისით ან ნაღდი ანგარიშსწორებით.',
  alternates: {
    canonical: 'https://hykon.ge/delivery',
    languages: {
      ka: 'https://hykon.ge/delivery',
      en: 'https://hykon.ge/en/delivery',
      ru: 'https://hykon.ge/ru/delivery',
    },
  },
  openGraph: {
    title: 'მიწოდება და გადახდა | HYKON.GE',
    description: 'მიწოდების ვადები, ტარიფები და გადახდის მეთოდები საქართველოში.',
    url: 'https://hykon.ge/delivery',
    siteName: 'HYKON.GE',
    type: 'website',
  },
};

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'რა ვადებში ხდება შეკვეთის მიწოდება?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ბათუმში მიწოდება ხდება იმავე დღეს ან 24 საათში. თბილისსა და რეგიონებში მიწოდება ხორციელდება 1-3 სამუშაო დღის განმავლობაში.',
        },
      },
      {
        '@type': 'Question',
        name: 'რა გადახდის მეთოდებია ხელმისაწვდომი?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ხელმისაწვდომია ონლაინ გადახდა საბანკო ბარათით (Visa, Mastercard), საბანკო გადარიცხვა RS.GE ინვოისით იურიდიული პირებისთვის და ნაღდი გადახდა კურიერთან/შოურუმში.',
        },
      },
      {
        '@type': 'Question',
        name: 'შესაძლებელია თუ არა ინვოისით შეძენა კომპანიებისთვის?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'დიახ, ჩვენ ვუზრუნველყოფთ დღგ-ის ანგარიშ-ფაქტურის და ზედნადების ატვირთვას შემოსავლების სამსახურის (RS.GE) პორტალზე.',
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
        name: 'მიწოდება და გადახდა',
        item: 'https://hykon.ge/delivery',
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
