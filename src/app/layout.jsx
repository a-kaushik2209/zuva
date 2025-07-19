import './globals.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/use-auth';
import { Inter, Lexend } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
});

export const metadata = {
  title: 'Zuva',
  description: 'Your secure and simple crypto wallet manager.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${lexend.variable}`}>
      <body className="font-body antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}