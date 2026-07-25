import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CardCompare — Canadian Credit Cards",
  description: "Compare Canadian credit cards side by side — fees, earn rates, insurance, and perks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-[#0A0A0A] text-black dark:text-white transition-colors duration-200">
        <Header />
        {children}
      </body>
    </html>
  );
}
