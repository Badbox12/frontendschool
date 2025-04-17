import type { Metadata } from "next";

import "./globals.css";
import { Noto_Sans, Noto_Sans_Khmer } from 'next/font/google'

// Load Khmer font with Khmer subset
const khmer = Noto_Sans_Khmer({
  subsets: ['khmer'],
  weight: ['400', '700'],
  variable: '--font-khmer',
  
})
// Load English-friendly font
const english = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-english',
  
})

export const metadata: Metadata = {
  title: "Sala rean khnom",
  description: "Sala rean cambodia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
    <html lang="en" className={`${khmer.variable} ${english.variable}`}>
      <body
        className="font-english [&:lang(km)]:font-khmer"
      >
        {children}
      </body>
    </html>
    
  );
}
