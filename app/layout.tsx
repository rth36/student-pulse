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
  title: "Student Pulse – Win Free Sony Headphones",
  description: "Take a 2-minute anonymous survey on student wellness — sleep, stress & screen time — and enter to win Sony WH-1000XM5 headphones ($349).",
  openGraph: {
    title: "Student Pulse – Win Free Sony Headphones 🎧",
    description: "2-minute anonymous survey. Win Sony WH-1000XM5 noise-canceling headphones ($349). Your data helps shape school wellness policy.",
    url: "https://student-pulse-six.vercel.app",
    siteName: "Student Pulse",
    images: [
      {
        url: "https://student-pulse-six.vercel.app/headphones.jpg",
        width: 2235,
        height: 2426,
        alt: "Sony WH-1000XM5 Wireless Headphones",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Pulse – Win Free Sony Headphones 🎧",
    description: "2-minute anonymous survey. Win Sony WH-1000XM5 headphones ($349).",
    images: ["https://student-pulse-six.vercel.app/headphones.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
