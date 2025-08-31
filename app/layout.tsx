import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import { Footer } from "@/components/ui/footer"
import { WalletProvider } from "@/contexts/wallet-context"
import { LocationProvider } from "@/contexts/location-context"
import { MainNav } from "@/components/navigation/main-nav"
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav"
import { MobileOptimizations } from "@/components/ui/mobile-optimizations"

export const metadata: Metadata = {
  title: "TrueBlock - Noticias Verificadas con Blockchain",
  description:
    "Mantente informado con noticias 100% verificadas usando tecnología blockchain. Transparencia, veracidad y confianza en cada noticia.",
  generator: "TrueBlock",
  keywords: ["noticias", "blockchain", "verificadas", "transparencia", "confianza", "veracidad"],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TrueBlock",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <WalletProvider>
              <LocationProvider>
                <div className="min-h-screen flex flex-col pb-20 md:pb-0">
                  <MainNav />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <MobileBottomNav />
                  <MobileOptimizations />
                </div>
              </LocationProvider>
            </WalletProvider>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
