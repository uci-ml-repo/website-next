import "@/app/globals.css";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import BackgroundGraph from "@/components/layout/graph/BackgroundGraph";
import Header from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/sidebar/AppSidebar";
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

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

              <SidebarProvider defaultOpen={false}>
                <AppSidebar />
                <div className="w-full">
                  <Header />

                  {children}

                  {/*<Footer />*/}
                </div>
              </SidebarProvider>
              <Toaster />
            </ThemeProvider>
          </body>
        </TRPCProvider>
      </SessionProvider>
    </html>
  );
}
