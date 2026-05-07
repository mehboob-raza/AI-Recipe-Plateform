import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from '@clerk/ui/themes'
import { Toaster } from "sonner";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: "AI Recipes Plateform",
  description: 'AI-powered recipe platform built with Next.js, React, Tailwind CSS, Shadcn UI, Strapi, and Neon DB. Generate smart recipes based on ingredients, explore meals with advanced search, and manage content via a CMS. Fast, responsive, and scalable full-stack app for modern food experiences.',
  icons: {
    icon: [
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "48x48", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      theme: neobrutalism,
    }}>
      <html
        lang="en" suppressHydrationWarning
        className={cn("h-full", "antialiased", "font-sans", inter.variable)}
      >
        <body className={`${inter.className}`}>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster richColors />
          <footer className="py-6 px-4 border-t">
            <div className="max-w-6xl mx-auto flex justify-center">
              <p className="text-stone-500 text-sm capitalize">
                Made with 💗 By Raza
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
