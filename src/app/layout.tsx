import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'ClearFeed',
  description:
    'AI-powered content education system that helps children recognize manipulation patterns in online video content.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="bg-cream-100 text-brand-dark">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
