import { Loader2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  isPending?: boolean;
}

export function AuthButton({ icon, label, isPending, ...props }: AuthButtonProps) {
  return (
    <Button variant="outline" size="lg" className="text-md w-full space-x-1" {...props}>
      {isPending ? <Loader2 className="animate-spin" /> : icon}
      <p>{label}</p>
    </Button>
  );
}
