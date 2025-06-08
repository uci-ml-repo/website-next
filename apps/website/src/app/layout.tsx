import "./globals.css";

import { BackgroundGraphic } from "@website/components/layout/background/background-graphic";
import { Footer } from "@website/components/layout/footer";
import { Header } from "@website/components/layout/header";
import { Sidebar } from "@website/components/layout/sidebar";
import { SidebarMargin } from "@website/components/layout/sidebar/sidebar-margin";
import { SidebarProvider } from "@website/components/layout/sidebar/sidebar-provider";
import { env } from "@website/env";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import React from "react";

export const metadata: Metadata = {
  title: {
    template: "%s - UCI Machine Learning Repository",
    default: "UCI Machine Learning Repository",
  },
  description:
    "The UCI Machine Learning Repository hosts hundreds of datasets for machine learning research.",
  metadataBase: new URL(env.BASE_URL),
  openGraph: {
    images: [
      {
        url: "/open-graph.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          themes={["light", "dark"]}
          disableTransitionOnChange
        >
          <BackgroundGraphic className="absolute top-0 right-0 -z-10 max-md:hidden" />

          <SidebarProvider>
            <Sidebar />
            <SidebarMargin>
              <div className="flex min-h-dvh flex-col">
                <Header />
                <main className="content mx-auto mb-12 flex grow flex-col max-md:mt-(--header-height) max-md:pt-4">
                  {children}
                </main>
              </div>
              <Footer />
            </SidebarMargin>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
