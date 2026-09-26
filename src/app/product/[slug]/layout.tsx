import type { Metadata } from 'next';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/data/seedData';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug || '');
  const product = INITIAL_PRODUCTS.find(
    p =>
      p.slug === slug ||
      p.slug === decodedSlug ||
      p.id === slug ||
      (p as any).oldSlug === slug ||
      p.sku?.toLowerCase() === slug.toLowerCase()
  );

  if (!product) {
    return {
      title: 'პროდუქტი ვერ მოიძებნა',
      description: 'მოთხოვნილი უსაფრთხოების მოწყობილობა არ მოიძებნა Hykon.ge-ზე.',
    };
  }

  const category = INITIAL_CATEGORIES.find(c => c.id === product.categoryId);
  const title = `${product.title} — იყიდება საუკეთესო ფასად`;
  const cleanDesc = (product.shortDescription || product.fullDescription || product.title)
    .replace(/\r?\n|\r/g, ' ')
    .slice(0, 160);
  const description = `${cleanDesc} | SKU: ${product.sku || 'N/A'}, ბრენდი: ${product.brand || 'Hykon'}. ოფიციალური გარანტია და სწრაფი მიწოდება საქართველოში.`;
  const image = product.images?.[0] || product.thumbnail || 'https://hykon.ge/images/logo.png';
  const canonicalUrl = `https://hykon.ge/product/${product.slug || product.id}`;

  return {
    title,
    description,
    keywords: [
      product.title,
      product.brand || '',
      product.sku || '',
      category?.name || '',
      'ვიდეომეთვალყურეობა',
      'IP კამერები ბათუმი',
      'უსაფრთხოების სისტემები საქართველო',
    ].filter(Boolean),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ka: canonicalUrl,
        en: `https://hykon.ge/en/product/${product.slug || product.id}`,
        ru: `https://hykon.ge/ru/product/${product.slug || product.id}`,
      },
    },
    openGraph: {
      title: `${product.title} | HYKON.GE`,
      description,
      url: canonicalUrl,
      siteName: 'HYKON.GE',
      images: [
        {
          url: image.startsWith('http') ? image : `https://hykon.ge${image}`,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | HYKON.GE`,
      description,
      images: [image.startsWith('http') ? image : `https://hykon.ge${image}`],
    },
  };
}

export default async function ProductLayout({ params, children }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug || '');
  const product = INITIAL_PRODUCTS.find(
    p =>
      p.slug === slug ||
      p.slug === decodedSlug ||
      p.id === slug ||
      (p as any).oldSlug === slug ||
      p.sku?.toLowerCase() === slug.toLowerCase()
  );

  const category = product
    ? INITIAL_CATEGORIES.find(c => c.id === product.categoryId)
    : null;

  const productSchema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        image: product.images?.map(img =>
          img.startsWith('http') ? img : `https://hykon.ge${img}`
        ) || [product.thumbnail ? (product.thumbnail.startsWith('http') ? product.thumbnail : `https://hykon.ge${product.thumbnail}`) : 'https://hykon.ge/images/logo.png'],
        description: product.fullDescription || product.shortDescription || product.title,
        sku: product.sku || product.id,
        mpn: product.sku || product.id,
        brand: {
          '@type': 'Brand',
          name: product.brand || 'Hykon',
        },
        offers: {
          '@type': 'Offer',
          url: `https://hykon.ge/product/${product.slug || product.id}`,
          priceCurrency: 'GEL',
          price: product.price,
          priceValidUntil: '2027-12-31',
          availability:
            product.inStock || (product.stockCount ?? 0) > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization',
            name: 'HYKON.GE',
          },
        },
        ...(product.rating
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating || 5,
                reviewCount: product.reviewCount || 12,
              },
            }
          : {}),
      }
    : null;

  const breadcrumbSchema = product
    ? {
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
          {
            '@type': 'ListItem',
            position: 3,
            name: category?.name || 'პროდუქცია',
            item: `https://hykon.ge/catalog?category=${encodeURIComponent(
              category?.slug || product.categoryId || ''
            )}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: product.title,
            item: `https://hykon.ge/product/${product.slug || product.id}`,
          },
        ],
      }
    : null;

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {children}
    </>
  );
}
