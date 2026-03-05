import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "SMIT Chatbot - Saylani Mass IT Training",
  description: "AI-powered assistant for SMIT announcements, FAQs, and more. Create branded announcements, get instant answers about admissions, courses, and fees.",
  keywords: ["SMIT", "Saylani", "IT Training", "Chatbot", "Admissions", "Courses", "Pakistan"],
  authors: [{ name: "SMIT" }],
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  openGraph: {
    title: "SMIT Chatbot - Saylani Mass IT Training",
    description: "AI-powered assistant for SMIT announcements and FAQs",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> 
  <body className="..." suppressHydrationWarning>
    {children}
  </body>
</html>
  );
}
