import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Header } from "@/components/home/navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Uncharted",
  description:
    "Plan trips, book travel, and explore the world with your AI travel agent in your pocket.",
  icons: {
    icon: "/favicon-32x32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-landing antialiased`}>
        <ThemeProvider>
          <Header />
          <div className="pt-14">{children}</div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
