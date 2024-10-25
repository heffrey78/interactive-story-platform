import ClientLayout from '@/components/ClientLayout';
import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Interactive Story Creator',
    default: 'Interactive Story Creator',
  },
  description: 'Create and manage interactive stories with branching narratives',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
