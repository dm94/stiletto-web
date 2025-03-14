import Menu from "@/components/Menu";
import NotificationList from "@/components/Notifications/NotificationList";
import CookieConsent from "@/components/CookieConsent";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import Footer from "@/components/Footer";
import type React from "react";
import "./globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <NextIntlClientProvider messages={messages}>
          <Menu language={locale} />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <CookieConsent />
          <NotificationList />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
