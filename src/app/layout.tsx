import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";

import { NotionSetupNotice } from "@/components/notion-setup-notice";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { site } from "@/lib/site";

import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:4317"),
  title: {
    default: "Elderly Care Match — Free senior care guidance in Washington",
    template: "%s · Elderly Care Match",
  },
  description:
    "Free matching help for Washington families looking at adult family homes, assisted living, memory care, and nursing homes. We do not push a building.",
  openGraph: {
    title: "Find senior care in Washington without the runaround",
    description: `Free for families. Call ${site.phone} or request a callback.`,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="page-shell flex min-h-full flex-col">
        <NotionSetupNotice />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
