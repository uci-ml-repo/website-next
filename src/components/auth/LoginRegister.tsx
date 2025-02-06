"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import { Banner } from "@/components/icons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HOME_ROUTE } from "@/lib/routes";

export type Tab = "signin" | "register";

function getFullURLPath(url: string) {
  if (url.startsWith("http")) {
    const urlObject = new URL(url);
    return urlObject.pathname + urlObject.search + urlObject.hash;
  }

  return url;
}

export const loginFormSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .max(255, { message: "Name cannot exceed 255 characters" }),
    email: z
      .string()
      .email()
      .max(255, { message: "Email cannot exceed 255 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;

export default function LoginRegister() {
  const [tab, setTab] = useState<Tab>("signin");
  const [registerEmailFormIsOpen, setRegisterEmailFormIsOpen] =
    useState<boolean>(false);

  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl")?.replace(/ /, "+");
  const redirectTo = callbackUrl ? getFullURLPath(callbackUrl) : HOME_ROUTE;

  const onTabChange = (tab: string) => {
    setTab(tab as Tab);
  };

  const loginForm = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Tabs value={tab} onValueChange={onTabChange}>
      {/* Mobile View */}
      <div className="mx-auto flex max-w-[450px] flex-col items-center space-y-4 sm:hidden">
        <Banner variant="logo" link className="px-4" />
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Login setTab={setTab} redirectTo={redirectTo} form={loginForm} />
        </TabsContent>
        <TabsContent value="register">
          <Register
            setTab={setTab}
            redirectTo={redirectTo}
            form={registerForm}
            emailFormIsOpen={registerEmailFormIsOpen}
            setEmailFormIsOpen={setRegisterEmailFormIsOpen}
          />
        </TabsContent>
      </div>

      {/* Desktop View */}
      <Card className="mx-auto hidden w-[450px] flex-col items-center rounded-4xl p-4 sm:flex">
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
            <Login setTab={setTab} redirectTo={redirectTo} form={loginForm} />
          </CardContent>
        </TabsContent>
        <TabsContent value="register">
          <CardContent>
            <Register
              setTab={setTab}
              redirectTo={redirectTo}
              form={registerForm}
              emailFormIsOpen={registerEmailFormIsOpen}
              setEmailFormIsOpen={setRegisterEmailFormIsOpen}
            />
          </CardContent>
        </TabsContent>
      </Card>
    </Tabs>
  );
}
