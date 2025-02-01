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

export type Tab = "signin" | "register";

function getFullURLPath(url: string) {
  if (url.startsWith("http")) {
    const urlObject = new URL(url);
    return urlObject.pathname + urlObject.search + urlObject.hash;
  }

  return url;
}

export default function Page() {
  const [tab, setTab] = useState<Tab>("signin");

  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl")?.replace(/ /, "+");
  const redirectTo = callbackUrl ? getFullURLPath(callbackUrl) : HOME_PATH;

  const onTabChange = (tab: string) => {
    setTab(tab as Tab);
  };

  return (
    <Main>
      <Tabs value={tab} onValueChange={onTabChange}>
        {/* Mobile View */}
        <div className="flex flex-col items-center space-y-4 sm:hidden">
          <Banner variant="logo" link className="px-4" />
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Login setTab={setTab} redirectTo={redirectTo} />
          </TabsContent>
          <TabsContent value="register">
            <Register setTab={setTab} redirectTo={redirectTo} />
          </TabsContent>
        </div>

        {/* Desktop View */}
        <Card className="hidden max-w-[450px] flex-col items-center justify-self-center rounded-4xl p-4 sm:flex">
          <CardHeader className="py-6">
            <Banner variant="logo" link />
          </CardHeader>
          <CardContent className="w-full py-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
          </CardContent>
          <TabsContent value="signin">
            <CardContent>
              <Login setTab={setTab} redirectTo={redirectTo} />
            </CardContent>
          </TabsContent>
          <TabsContent value="register">
            <CardContent>
              <Register setTab={setTab} redirectTo={redirectTo} />
            </CardContent>
          </TabsContent>
        </Card>
      </Tabs>
    </Main>
  );
}
