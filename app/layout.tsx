import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import "@/app/globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: {
    default: "Twibbon Hero — Make your support visible",
    template: "%s · Twibbon Hero",
  },
  description:
    "Create, personalize, and share campaign photo frames with your community.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { locale, t } = await getDictionary();
  return (
    <html lang={locale}>
      <body className={`${GeistSans.variable} font-sans antialiased`}>
        <Header locale={locale} labels={t} />
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>
        <Footer text={t.footer} />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
