import type { Metadata, Viewport } from "next";
import { Outfit, Mukta_Malar, Oi } from "next/font/google";
import "./globals.css";
import { UserKuralActionsProvider } from "@/lib/hooks/useUserKuralActions";
import { LanguageProvider } from "@/lib/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeColorProvider } from "@/lib/context/ThemeColorContext";
import KolamBackground from "@/components/KolamBackground";
import { getSiteUrl } from "@/lib/seo";


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

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "திருக்குறள் - Thirukkural | Timeless Wisdom",
    template: "%s | திருக்குறள் - Thirukkural",
  },
  description:
    "Explore all 1,330 Thirukkural couplets by Saint Thiruvalluvar with clear Tamil explanations, Parimelazhagar commentary, English meanings, instant bilingual search, and offline notes.",
  keywords: [
    "Thirukkural",
    "திருக்குறள்",
    "Thiruvalluvar",
    "திருவள்ளுவர்",
    "Kural",
    "Tamil Literature",
    "Parimelazhagar",
    "பரிமேலழகர்",
    "Aram Porul Inbam",
    "திருக்குறள் விளக்கம்",
  ],
  authors: [{ name: "Thiruvalluvar" }],
  creator: "Ansverse",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ta_IN",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName: "திருக்குறள் - Thirukkural",
    title: "திருக்குறள் - Thirukkural | Timeless Wisdom",
    description:
      "Explore all 1,330 Thirukkural couplets with clear Tamil explanations, Parimelazhagar commentary, English meanings, and offline personal notes.",
    images: [
      {
        url: "/valluvar-logo-v2.jpg",
        width: 512,
        height: 512,
        alt: "திருக்குறள் - Saint Thiruvalluvar",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "திருக்குறள் - Thirukkural | Timeless Wisdom",
    description:
      "Explore all 1,330 Thirukkural couplets with clear Tamil explanations, Parimelazhagar commentary, and English meanings.",
    images: ["/valluvar-logo-v2.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  applicationName: "திருக்குறள்",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "திருக்குறள்",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon",
    apple: "/valluvar-logo-v2.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f59e0b" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1004" },
  ],
};

import { getPaalAdhigarams } from "@/lib/kural-data";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adhigaramData = await getPaalAdhigarams();

  return (
    <html lang="ta" className={`scroll-smooth ${outfit.variable} ${muktaMalar.variable} ${oi.variable}`} suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="திருக்குறள்" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <link rel="apple-touch-icon" href="/valluvar-logo-v2.jpg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/valluvar-logo-v2.jpg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const raw = localStorage.getItem('thirukkural_color_theme') || 'amber';
                const t = raw === 'sapphire' ? 'monochrome' : raw;
                document.documentElement.setAttribute('data-theme', t);

                const isDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                const themeColors = {
                  amber: { light: '#f59e0b', dark: '#1c1004' },
                  indigo: { light: '#6366f1', dark: '#020617' },
                  emerald: { light: '#10b981', dark: '#022017' },
                  rose: { light: '#f43f5e', dark: '#1e030a' },
                  monochrome: { light: '#18181b', dark: '#09090b' },
                  amethyst: { light: '#9333ea', dark: '#140224' }
                };
                const color = (themeColors[t] || themeColors.amber)[isDark ? 'dark' : 'light'];
                const metas = document.querySelectorAll('meta[name="theme-color"]');
                if (metas.length > 0) {
                  metas.forEach(function(m) { m.setAttribute('content', color); });
                } else {
                  const meta = document.createElement('meta');
                  meta.setAttribute('name', 'theme-color');
                  meta.setAttribute('content', color);
                  document.head.appendChild(meta);
                }
              } catch (e) {}
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "திருக்குறள் - Thirukkural",
              url: siteUrl,
              description:
                "Explore all 1,330 Thirukkural couplets with clear Tamil explanations, Parimelazhagar commentary, and English meanings.",
              inLanguage: ["ta", "en"],
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/browse?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans selection:bg-blue-500/30" suppressHydrationWarning>
        <LanguageProvider>
          <UserKuralActionsProvider>
            <ThemeColorProvider>
              <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
                <KolamBackground />
                <Header />
                <main className="flex-grow pt-[calc(4.25rem+env(safe-area-inset-top,0px))] sm:pt-24 md:pt-28 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:pb-10 md:pb-12 px-3 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
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
