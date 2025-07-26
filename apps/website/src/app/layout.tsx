import "./globals.css";

import { BackgroundGraphic } from "@components/layout/background/background-graphic";
import { Footer } from "@components/layout/footer";
import { Header } from "@components/layout/header";
import { Sidebar } from "@components/layout/sidebar";
import { SidebarProvider } from "@components/layout/sidebar/sidebar-provider";
import { env } from "@env";
import { auth } from "@lib/auth";
import { cn } from "@lib/utils/cn";
import { TRPCProvider } from "@server/trpc/query/client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { ThemeProvider } from "next-themes";
import React from "react";

export const metadata: Metadata = {
  title: {
    template: "%s - UCI Machine Learning Repository",
    default: "UCI Machine Learning Repository",
  },
  description:
    "The UCI Machine Learning Repository hosts hundreds of datasets for machine learning research.",
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <TRPCProvider>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            themes={["light", "dark"]}
            disableTransitionOnChange
          >
            <BackgroundGraphic className="absolute top-0 right-0 -z-10 max-md:hidden" />

            <SidebarProvider>
              <Sidebar session={session} />
              <div
                className={cn(
                  "w-full",
                  "md:ml-(--sidebar-width-collapsed) peer-data-[state=expanded]:xl:!ml-(--sidebar-width)",
                  "transition-margin duration-100 ease-out",
                )}
              >
                <div className="flex min-h-dvh flex-col">
                  <Header initialSession={session} />
                  <main
                    className={cn(
                      "content mx-auto mb-12 flex grow flex-col",
                      "max-md:mt-(--header-height) max-md:pt-4",
                    )}
                  >
                    {children}
                  </main>
                </div>
                <Footer />
              </div>
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </TRPCProvider>
    </html>
  );
}
