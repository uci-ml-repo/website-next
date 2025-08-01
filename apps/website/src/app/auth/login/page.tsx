"use client";

import { LoginContent } from "@components/auth/login/login-content";
import { RegisterContent } from "@components/auth/register/register-content";
import { MLRepoLogo } from "@components/logo/ml-repo";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { useState } from "react";

export type AuthTab = "signIn" | "register";

export default function Page() {
  const [tab, setTab] = useState<AuthTab>("signIn");

  return (
    <div className="flex grow items-center justify-center">
      <Card className="w-full max-w-[30rem] max-md:invisible">
        <Tabs
          value={tab}
          onValueChange={(tab) => setTab(tab as AuthTab)}
          className="visible max-md:[&>*]:!px-0"
        >
          <CardHeader className="space-y-4 pb-4">
            <MLRepoLogo variant="logo" className="text-wrap" />
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="signIn">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="signIn">
              <LoginContent setTab={setTab} />
            </TabsContent>
            <TabsContent value="register">
              <RegisterContent setTab={setTab} />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
