import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HYKON.GE — უსაფრთხოების სისტემები და ვიდეომეთვალყურეობა',
    short_name: 'HYKON.GE',
    description: 'ვიდეომეთვალყურეობა, IP კამერები, დაცვითი სიგნალიზაცია (Ajax, Paradox) და ქსელური მოწყობილობები საქართველოში.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    lang: 'ka',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
