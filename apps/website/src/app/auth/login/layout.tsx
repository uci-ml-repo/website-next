import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login or Register",
  description: "Login or register for a UCI Machine Learning Repository account.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
