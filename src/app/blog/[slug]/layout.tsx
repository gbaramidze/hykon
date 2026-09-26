import type { Metadata } from 'next';
import { INITIAL_BLOG_POSTS } from '@/data/seedData';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug || '');
  const post = INITIAL_BLOG_POSTS.find(
    p => p.slug === slug || p.slug === decodedSlug || p.id === slug
  );

  if (!post) {
    return {
      title: 'სტატია ვერ მოიძებნა',
      description: 'მოთხოვნილი სტატია არ მოიძებნა Hykon.ge ბლოგზე.',
    };
  }

  const title = post.title;
  const description = post.excerpt || post.content.slice(0, 160);
  const image = post.coverImage || 'https://hykon.ge/images/logo.png';
  const canonicalUrl = `https://hykon.ge/blog/${post.slug || post.id}`;

  return {
    title,
    description,
    keywords: post.tags || ['ვიდეომეთვალყურეობა', 'IP კამერები', 'Ajax', 'დაცვითი სიგნალიზაცია', 'უსაფრთხოება'],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ka: canonicalUrl,
        en: `https://hykon.ge/en/blog/${post.slug || post.id}`,
        ru: `https://hykon.ge/ru/blog/${post.slug || post.id}`,
      },
    },
    openGraph: {
      title: `${post.title} | HYKON.GE`,
      description,
      url: canonicalUrl,
      siteName: 'HYKON.GE',
      type: 'article',
      images: [
        {
          url: image.startsWith('http') ? image : `https://hykon.ge${image}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | HYKON.GE`,
      description,
      images: [image.startsWith('http') ? image : `https://hykon.ge${image}`],
    },
  };
}

export default async function BlogDetailLayout({ params, children }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug || '');
  const post = INITIAL_BLOG_POSTS.find(
    p => p.slug === slug || p.slug === decodedSlug || p.id === slug
  );

  const articleSchema = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage ? [post.coverImage] : ['https://hykon.ge/images/logo.png'],
        datePublished: '2026-09-20T08:00:00+04:00',
        dateModified: new Date().toISOString(),
        author: {
          '@type': 'Person',
          name: post.author?.name || 'HYKON.GE ექსპერტი',
          jobTitle: post.author?.role || 'უსაფრთხოების სპეციალისტი',
        },
        publisher: {
          '@type': 'Organization',
          name: 'HYKON.GE',
          logo: {
            '@type': 'ImageObject',
            url: 'https://hykon.ge/images/logo.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://hykon.ge/blog/${post.slug || post.id}`,
        },
      }
    : null;

  const breadcrumbSchema = post
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
            name: 'ბლოგი',
            item: 'https://hykon.ge/blog',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
            item: `https://hykon.ge/blog/${post.slug || post.id}`,
          },
        ],
      }
    : null;

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
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
