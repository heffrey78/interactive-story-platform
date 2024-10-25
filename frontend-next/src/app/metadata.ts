import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3002'),
  title: {
    template: '%s | Interactive Story Creator',
    default: 'Interactive Story Creator',
  },
  description: 'Create and manage interactive stories with branching narratives',
  applicationName: 'Interactive Story Creator',
  authors: [{ name: 'Story Creator Team' }],
  generator: 'Next.js',
  keywords: ['interactive', 'story', 'creator', 'narrative', 'branching'],
  referrer: 'origin-when-cross-origin',
  themeColor: '#1976d2',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json',
};
