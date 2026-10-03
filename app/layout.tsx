import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: '#FAFAF9',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "ListReady — Product Image Compliance & Quality for Marketplaces",
  description: "ListReady checks product images for marketplace requirements, product accuracy, and image quality — then automatically fixes what can be fixed and flags what needs human review.",
  keywords: ["Amazon Product Photos", "Image Compliance", "Cloudinary AI", "Background Removal", "E-commerce Optimization", "Product Truth Guard", "Marketplace Image Requirements"],
  openGraph: {
    title: "ListReady — Product Image Compliance & Quality",
    description: "Check product images against marketplace requirements. Auto-fix supported issues. Flag what needs human review.",
    type: "website",
    locale: "en_US",
    siteName: "ListReady",
  },
  twitter: {
    card: "summary_large_image",
    title: "ListReady — Product Image Compliance",
    description: "Check, fix, and approve product images for marketplace requirements.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAF9] text-zinc-900">{children}</body>
    </html>
  );
}
