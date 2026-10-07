import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ADDRESS, SITE } from "@/data/site";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Industry Collaboration & Hiring · FET, Sri Sri University`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Sri Sri University",
    "SSU Cuttack",
    "campus hiring Odisha",
    "hire engineering interns",
    "AI ML students",
    "cyber security students",
    "digital forensics",
    "industry academia collaboration",
  ],
  applicationName: SITE.name,
  icons: { icon: SITE.logoSrc },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} · Hire with SSU`,
    description: SITE.description,
    url: SITE.url,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} · Hire with SSU`,
    description: SITE.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#1A1216",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollegeOrUniversity",
  name: "Sri Sri University",
  alternateName: "SSU",
  department: {
    "@type": "Organization",
    name: "Faculty of Engineering & Technology",
  },
  url: SITE.universityUrl,
  foundingDate: "2009",
  slogan: SITE.tagline,
  address: {
    "@type": "PostalAddress",
    streetAddress: ADDRESS.street,
    addressLocality: ADDRESS.locality,
    addressRegion: ADDRESS.region,
    postalCode: ADDRESS.postalCode,
    addressCountry: ADDRESS.country,
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Training & Placement",
    email: "akshat.s@srisriuniversity.edu.in",
    telephone: "+91-63618-50679",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a
          href="#main"
          className="focus:bg-ssu-gold focus:text-ssu-ink sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </MotionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
