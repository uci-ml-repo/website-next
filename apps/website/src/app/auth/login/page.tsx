"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { useState } from "react";

export default function Page() {
  const [tab, setTab] = useState<string>("signIn");

  return (
    <div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="signIn">Sign In</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="signIn">SIGNIN</TabsContent>
        <TabsContent value="register">REGISTER</TabsContent>
      </Tabs>
    </div>
  );
}
