import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: "Retro Cinema — Movie Reservation System",
  description: "Book your tickets for the latest blockbusters with Retro Cinema's sleek reservation system.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} font-sans min-h-screen bg-background text-foreground antialiased`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
