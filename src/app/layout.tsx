import "@/app/globals.css";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import * as React from "react";

import { auth } from "@/auth";
import AppSidebar from "@/components/layout/AppSidebar";
import CookiesAlert from "@/components/layout/CookiesAlert";
import BackgroundGraph from "@/components/layout/graph/BackgroundGraph";
import Header, { HEADER_HEIGHT } from "@/components/layout/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { TRPCProvider } from "@/server/trpc/query/client";

const inter = Inter({ subsets: ["latin"], fallback: ["sans-serif"] });

export const metadata: Metadata = {
  title: {
    template: "%s - UCI Machine Learning Repository",
    default: "UCI Machine Learning Repository",
  },
  description: "UCI Repository for Machine Learning Datasets",
  metadataBase: new URL(process.env.BASE_URL!),
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000" },
    { media: "(prefers-color-scheme: light)", color: "#fff" },
  ],
  initialScale: 1,
  width: "device-width",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider>
        <TRPCProvider>
          <body className={cn(inter.className)}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              themes={["light", "dark"]}
              storageKey="theme"
              enableSystem
              disableTransitionOnChange
            >
              <BackgroundGraph />

              <SidebarProvider>
                <AppSidebar session={session} />
                <div
                  className={cn(
                    "w-full bg-background",
                    "max-md:!pl-0",
                    "peer-data-[state=collapsed]:pl-[--sidebar-width-collapsed]",
                    "peer-data-[state=expanded]:pl-[--sidebar-width-collapsed]",
                    "peer-data-[state=expanded]:xl:pl-[--sidebar-width]",
                  )}
                >
                  <Header session={session} />
                  <div
                    style={
                      {
                        "--header-height": HEADER_HEIGHT,
                      } as React.CSSProperties
                    }
                    className="max-md:mt-[--header-height]"
                  >
                    {children}
                  </div>
                </div>
                <CookiesAlert />
              </SidebarProvider>

              <Toaster />
            </ThemeProvider>
          </body>
        </TRPCProvider>
      </SessionProvider>
    </html>
  );
}
