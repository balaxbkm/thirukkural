import type { Metadata } from "next";
import { Outfit, Mukta_Malar, Oi } from "next/font/google";
import "./globals.css";
import { UserKuralActionsProvider } from "@/lib/hooks/useUserKuralActions";
import { LanguageProvider } from "@/lib/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const muktaMalar = Mukta_Malar({
  subsets: ["tamil", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-mukta",
  display: "swap",
});

const oi = Oi({
  subsets: ["tamil", "latin"],
  weight: "400",
  variable: "--font-oi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thirukkural Explorer - timeless wisdom",
  description: "Explore the timeless wisdom of Thirukkural with a modern glassmorphism design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta" className={`${outfit.variable} ${muktaMalar.variable} ${oi.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col font-sans selection:bg-blue-500/30" suppressHydrationWarning>
        <LanguageProvider>
          <UserKuralActionsProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <Header />
              <main className="flex-grow pt-24 px-4 max-w-[1600px] mx-auto w-full">
                {children}
              </main>
              <Footer />
            </ThemeProvider>
          </UserKuralActionsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
