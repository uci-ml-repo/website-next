"use client";

import { MLRepoLogo } from "@components/logo/ml-repo";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { useState } from "react";

export default function Page() {
  const [tab, setTab] = useState("signIn");

  return (
    <div className="flex grow items-center justify-center">
      <Card className="w-full max-w-[30rem] max-md:invisible">
        <Tabs value={tab} onValueChange={setTab} className="visible">
          <CardHeader className="space-y-4">
            <MLRepoLogo variant="logo" abbreviate />
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="signIn">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="signIn">SIGNIN</TabsContent>
            <TabsContent value="register">REGISTER</TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
