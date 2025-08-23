import "./globals.css";

import { auth } from "@packages/auth/auth";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { Resource } from "sst";

import { BackgroundGraphic } from "@/components/layout/background/background-graphic";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/layout/sidebar/sidebar-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/util/cn";
import { TRPCProvider } from "@/server/trpc/query/client";

export const metadata: Metadata = {
  title: {
    template: "%s - UCI Machine Learning Repository",
    default: "UCI Machine Learning Repository",
  },
  description:
    "The UCI Machine Learning Repository hosts hundreds of datasets for machine learning research.",
  metadataBase: new URL(Resource.BASE_URL.value),
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
  children: ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <TRPCProvider>
          <NuqsAdapter>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              themes={["light", "dark"]}
              disableTransitionOnChange
            >
              <BackgroundGraphic className="absolute top-0 right-0 -z-10 max-md:hidden" />

              <SidebarProvider>
                <Sidebar session={session} />
                <div
                  className={cn(
                    "w-full",
                    "md:pl-(--sidebar-width-collapsed) peer-data-[state=expanded]:xl:!pl-(--sidebar-width)",
                    "transition-margin duration-150 ease-out",
                  )}
                >
                  <div className="flex min-h-dvh flex-col">
                    <Header session={session} />
                    <main
                      className={cn(
                        "content mx-auto mb-14 flex grow flex-col",
                        "max-md:mt-(--header-height) max-md:pt-4",
                      )}
                    >
                      {children}
                    </main>
                  </div>
                  <Footer />
                  <Toaster />
                </div>
              </SidebarProvider>
            </ThemeProvider>
          </NuqsAdapter>
        </TRPCProvider>
      </body>
    </html>
  );
}
