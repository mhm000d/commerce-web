import type {Metadata, Viewport} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {SessionProvider} from "@/components/session-provider";
import {Toaster} from "@/components/ui/sonner";
import {ErrorBoundary} from "@/components/error-boundary";
import {NetworkStatus} from "@/components/network-status";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Commerce",
    template: "%s | Commerce",
  },
  description: "Shop electronics, appliances, and more at Commerce – your one-stop online store.",
  keywords: ["ecommerce", "shop", "electronics", "appliances", "online shopping"],
  authors: [{name: "Commerce Team"}],
  creator: "Commerce",
  publisher: "Commerce",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_EG",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "Commerce",
    title: "Commerce",
    description: "Shop electronics, appliances, and more at Commerce – your one-stop online store.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Commerce – online store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Commerce",
    description: "Shop electronics, appliances, and more.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    {media: "(prefers-color-scheme: light)", color: "#ffffff"},
    {media: "(prefers-color-scheme: dark)", color: "#0f172a"},
  ],
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
    <body className="bg-slate-50 antialiased">
    <ErrorBoundary>
      <SessionProvider>{children}</SessionProvider>
      <NetworkStatus/>
    </ErrorBoundary>
    <Toaster
      position="top-left"
      closeButton
      toastOptions={{
        duration: 2500,
        classNames: {
          toast: "!border !border-slate-200 !shadow-lg !bg-white !text-slate-900",
          title: "font-semibold",
          description: "text-sm",
          success: "!border-indigo-200 !bg-indigo-50 !text-indigo-900",
          error: "!border-red-200 !bg-red-50 !text-red-900",
        },
      }}
    />
    </body>
    </html>
  );
}