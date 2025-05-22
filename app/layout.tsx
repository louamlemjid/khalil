import './globals.css';
import './bootstrap.scss';
import type { Metadata } from 'next';
import { Inter, Roboto } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/navbar';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext';

const roboto = Roboto({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Retail Management System',
  description: 'Comprehensive retail management solution for your business',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans`}>
        <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <main className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow">
                  {children}
                </div>
                <Toaster />
              </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}