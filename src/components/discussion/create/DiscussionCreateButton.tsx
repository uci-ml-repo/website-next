"use client";

import { PlusIcon } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import SignInRequired from "@/components/auth/SignInRequired";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DiscussionCreateButton({
  className,
}: {
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <SignInRequired
      title="Sign in to create discussions"
      body="To create discussions and access other features, please sign in."
      authedRedirect="discussions/create"
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Button
          variant="gold"
          size={isHovered ? "default" : "icon"}
          className={cn("lift", className)}
        >
          <PlusIcon />
          {isHovered && (
            <motion.span
              className="overflow-x-hidden"
              initial={{ width: 0 }}
              animate={{
                width: isHovered ? "auto" : 0,
              }}
            >
              Create
            </motion.span>
          )}
        </Button>
      </div>
    </SignInRequired>
  );
}
