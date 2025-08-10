// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import './globals.css';
// import { Toaster } from 'react-hot-toast';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Echo - AI Public Speaking Coach',
//   description: 'Improve your public speaking skills with real-time AI feedback',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <Toaster position="top-right" />
//         {children}
//       </body>
//     </html>
//   );
// }



import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import ThemeProvider from '../components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Echo - AI Public Speaking Coach',
  description: 'Improve your public speaking skills with real-time AI feedback',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Toaster position="top-right" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}