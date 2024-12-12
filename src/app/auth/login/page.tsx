"use client";

import { useState } from "react";

import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import { Banner } from "@/components/icons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type Tab = "signin" | "register";

export default function Page() {
  const [tab, setTab] = useState<Tab>("signin");

  const onTabChange = (tab: string) => {
    setTab(tab as Tab);
  };

  return (
    <main className="content">
      <Tabs value={tab} onValueChange={onTabChange} asChild>
        <Card className="flex w-[450px] flex-col items-center justify-self-center rounded-4xl p-4">
          <CardHeader className="py-6">
            <Banner variant="logo" />
          </CardHeader>
          <CardContent className="w-full py-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
          </CardContent>
          <TabsContent value="signin" className="w-full">
            <CardContent>
              <Login setTab={setTab} />
            </CardContent>
          </TabsContent>
          <TabsContent value="register" className="w-full">
            <CardContent>
              <Register setTab={setTab} />
            </CardContent>
          </TabsContent>
        </Card>
      </Tabs>
    </main>
  );
}
