"use client";

import Cookies from "js-cookie";
import { InfoIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PRIVACY_POLICY_ROUTE } from "@/lib/routes";

export default function CookiesAlert() {
  const [accepted, setAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    setAccepted(!!Cookies.get("accept-cookies"));
  }, []);

  function acceptCookies() {
    Cookies.set("accept-cookies", "true", { expires: 365 });
    setAccepted(true);
  }

  if (accepted === null || accepted) {
    return null;
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-0 right-0 z-50 m-2 max-w-md"
    >
      <Card className="rounded-3xl shadow-2xl">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center space-x-4">
            <InfoIcon className="size-5 shrink-0" />

            <div>
              By using the UCI Machine Learning Repository, you acknowledge and
              accept our{" "}
              <a
                className="text-link hover:underline"
                href={PRIVACY_POLICY_ROUTE}
              >
                Privacy Policy
              </a>
              .
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={acceptCookies}
              className="lift w-full"
              variant="blue"
            >
              Accept
            </Button>
            <Button className="lift w-full" variant="secondary">
              <Link href={PRIVACY_POLICY_ROUTE}>Read Policy</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
