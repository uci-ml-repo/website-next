import "@/app/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Toaster } from "@/components/ui/toaster";
import { TRPCProvider } from "@/server/trpc/client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UCI Machine Learning Repository",
  description: "UCI Repository for Machine Learning Datasets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <TRPCProvider>
          <body className={inter.className}>
            <Header />
            <main className={"min-h-screen"}>{children}</main>

            <Toaster />
            <Footer />
          </body>
        </TRPCProvider>
      </SessionProvider>
    </html>
  );
}
