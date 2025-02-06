"use client";

import EmailVerificationRequired from "@/components/auth/EmailVerificationRequired";
import Main from "@/components/layout/Main";
import { Button } from "@/components/ui/button";

export default function Test() {
  return (
    <Main>
      <EmailVerificationRequired
        signInTitle="Sign in to create discussions"
        signInBody="To create discussions and access other features, please sign in."
        emailVerificationTitle="Verify your email address"
        emailVerificationBody="To create discussions and access other features, please verify your email address."
        verifiedRedirect="discussions/create"
      >
        <Button>X</Button>
      </EmailVerificationRequired>

      <EmailVerificationRequired
        signInTitle="Sign in to create discussions"
        signInBody="To create discussions and access other features, please sign in."
        emailVerificationTitle="Verify your email address"
        emailVerificationBody="To create discussions and access other features, please verify your email address."
        verifiedAction={() => console.log("verified")}
      >
        <Button>X</Button>
      </EmailVerificationRequired>
    </Main>
  );
}
