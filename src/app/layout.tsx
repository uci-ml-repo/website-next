import "@/app/globals.css";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { AppSidebar } from "@/components/layout/AppSidebar";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { TRPCProvider } from "@/server/trpc/client";

const inter = Inter({ subsets: ["latin"], fallback: ["sans-serif"] });

export const metadata: Metadata = {
  title: {
    template: "%s - UCI Machine Learning Repository",
    default: "UCI Machine Learning Repository",
  },
  description: "UCI Repository for Machine Learning Datasets",
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
    <html lang="en">
      <SessionProvider>
        <TRPCProvider>
          <body className={cn(inter.className)}>
            <SidebarProvider defaultOpen={false}>
              <AppSidebar />
              <div className={"w-full"}>
                <Header />

                {children}

                <Footer />
              </div>
              <Toaster />
            </SidebarProvider>
          </body>
        </TRPCProvider>
      </SessionProvider>
    </html>
  );
}
