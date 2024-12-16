"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import { Banner } from "@/components/icons";
import Main from "@/components/layout/Main";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HOME_PATH } from "@/lib/routes";
import { getPath } from "@/lib/utils/url";

export type Tab = "signin" | "register";

export default function Page() {
  const [tab, setTab] = useState<Tab>("signin");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl")?.replace(/ /, "+");

  const redirectTo = callbackUrl ? getPath(callbackUrl) : HOME_PATH;

  const onTabChange = (tab: string) => {
    setTab(tab as Tab);
  };

  return (
    <Main>
      <Tabs value={tab} onValueChange={onTabChange} asChild>
        <Card className="flex w-[450px] flex-col items-center justify-self-center rounded-4xl p-4">
          <CardHeader className="py-6">
            <Banner variant="logo" link />
          </CardHeader>
          <CardContent className="w-full py-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
          </CardContent>
          <TabsContent value="signin" className="w-full">
            <CardContent>
              <Login setTab={setTab} redirectTo={redirectTo} />
            </CardContent>
          </TabsContent>
          <TabsContent value="register" className="w-full overflow-visible">
            <CardContent className={"overflow-visible"}>
              <Register setTab={setTab} redirectTo={redirectTo} />
            </CardContent>
          </TabsContent>
        </Card>
      </Tabs>
    </Main>
  );
}
