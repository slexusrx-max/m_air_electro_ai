import { AnalyticsConsent } from "@/components/analytics-consent";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";

import { PageBackground } from "@/components/page-background";
import { buildMetadata } from "@/lib/metadata";
import { absoluteUrl, siteConfig, websiteStructuredData } from "@/lib/site";
import "./globals.css";
import { getRequestLocale } from "@/lib/i18n/request";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  ...buildMetadata({
    title: siteConfig.name,
    description: siteConfig.description,
    path: "/",
  }),
  metadataBase: new URL(absoluteUrl()),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  keywords: [...siteConfig.keywords],
  category: "technology",
  publisher: siteConfig.operatorName,
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
};

export const viewport = {
  colorScheme: "light",
  themeColor: "#edf5e9",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={await getRequestLocale()}
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <head>
        {/* Impact requires its custom value attribute in addition to content. */}
        <meta
          name="impact-site-verification"
          content="0c0c0a69-4b9a-4b7d-837d-fc89a9040abe"
          {...{ value: "0c0c0a69-4b9a-4b7d-837d-fc89a9040abe" }}
        />
      </head>
      <body className="relative isolate flex min-h-full flex-col">
        <PageBackground />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteStructuredData()).replace(/</g,"\\u003c")}} />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">{children}<AnalyticsConsent ro={(await getRequestLocale()) === "ro"} /></div>
      </body>
    </html>
  );
}
