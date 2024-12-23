import type { Metadata } from 'next';
import './globals.css';

// comment to push build

// Redux
import { Provider } from '@/redux/provider';

export const metadata: Metadata = {
  title: 'Raccoon Admin Panel',
  description: 'Manage raccoon shooter resources',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
