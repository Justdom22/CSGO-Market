import "./globals.css";

import { Suspense } from "react";
import { Montserrat } from "next/font/google";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

import { Providers } from "./providers";
import Analytics from "./analytics";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "BRM CSGO",
  description: "CS GO Skins Marketplace | Buy CS:GO skins instantly and with a guarantee",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon.png",
    },
  ],
  openGraph: {
    images: [`${process.env.BASE_FETCH_URL}/logo.svg`],
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Providers>
          <Suspense>
            <Analytics />
          </Suspense>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
