import type { Metadata } from "next";

import { ForgotPassword } from "@/components/auth/ForgotPassword";
import { Main } from "@/components/layout/Main";

export const metadata: Metadata = { title: "Forgot Password" };

export default function Page() {
  return (
    <Main>
      <ForgotPassword />
    </Main>
  );
}
