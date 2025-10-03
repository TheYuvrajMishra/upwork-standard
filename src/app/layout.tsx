// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import LayoutWrapper from "@/app/components/LayoutProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define a base URL for your production site
const siteUrl = "https://upwork-standard.vercel.app";

export const metadata: Metadata = {
  // Use a template for dynamic page titles
  title: {
    template: "%s | Company Dashboard", // Example: "Task List | Company Dashboard"
    default: "Company Dashboard - Efficient Task Management", // Default title for the homepage
  },
  description: "The ultimate dashboard to manage tasks, track projects, and boost team productivity. Built with Next.js for speed and reliability.",
  
  // Add relevant keywords
  keywords: ["task management", "project dashboard", "team collaboration", "Next.js", "productivity tool"],
  
  // Set the canonical URL
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },

  // Open Graph (OG) tags for social media sharing
  openGraph: {
    title: "Company Dashboard - Efficient Task Management",
    description: "The ultimate dashboard to manage tasks, track projects, and boost team productivity.",
    url: siteUrl,
    siteName: 'Company Dashboard',
    images: [
      {
        url: `${siteUrl}/og-image.png`, // Must be an absolute URL
        width: 1200,
        height: 630,
        alt: 'Company Dashboard showing a list of tasks',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter Card tags
  twitter: {
    card: 'summary_large_image',
    title: "Company Dashboard - Efficient Task Management",
    description: "The ultimate dashboard to manage tasks, track projects, and boost team productivity.",
    images: [`${siteUrl}/og-image.png`], // Must be an absolute URL
  },

  // Add favicon information
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },

  // Control search engine indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}