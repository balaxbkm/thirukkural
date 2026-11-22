import type { Metadata } from "next";
import { Outfit, Mukta_Malar } from "next/font/google";
import "./globals.css";
import { UserKuralActionsProvider } from "@/lib/hooks/useUserKuralActions";
import { LanguageProvider } from "@/lib/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeColorProvider } from "@/lib/context/ThemeColorContext";


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

export const metadata: Metadata = {
  title: "Thirukkural - Timeless Wisdom",
  description: "Explore the timeless wisdom of Thirukkural with a modern glassmorphism design.",
};

import { getPaalAdhigarams } from "@/lib/kural-data";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adhigaramData = await getPaalAdhigarams();

  return (
    <html lang="ta" className={`scroll-smooth ${outfit.variable} ${muktaMalar.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const raw = localStorage.getItem('thirukkural_color_theme') || 'amber';
                const t = raw === 'sapphire' ? 'monochrome' : raw;
                document.documentElement.setAttribute('data-theme', t);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans selection:bg-blue-500/30" suppressHydrationWarning>
        <LanguageProvider>
          <UserKuralActionsProvider>
            <ThemeColorProvider>
              <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
                <Header />
                <main className="flex-grow pt-24 md:pt-28 pb-10 sm:pb-12 md:pb-14 px-4 max-w-[1600px] mx-auto w-full">
                  {children}
                </main>
                <Footer adhigaramData={adhigaramData} />
              </ThemeProvider>
            </ThemeColorProvider>
          </UserKuralActionsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
