import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";

import { BackgroundGraphic } from "@/components/layout/background/background-graphic";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/layout/sidebar/sidebar-provider";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth/auth";
import { cn } from "@/lib/util/cn";
import { TRPCProvider } from "@/server/trpc/query/client";

if (!process.env.NEXT_PUBLIC_BASE_URL) throw new Error();

export const metadata: Metadata = {
  title: {
    template: "%s - UCI Machine Learning Repository",
    default: "UCI Machine Learning Repository",
  },
  description:
    "The UCI Machine Learning Repository hosts hundreds of datasets for machine learning research.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL),
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
