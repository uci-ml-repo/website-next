import { CircleUserRoundIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps extends React.ComponentPropsWithoutRef<"div"> {
  src?: string | null;
}

export function ProfileAvatar({
  src,
  className,
  ...props
}: ProfileAvatarProps) {
  return (
    <Avatar className={cn("size-10", className)} {...props}>
      {src && <AvatarImage src={src} alt="Avatar" fetchPriority="high" />}
      <AvatarFallback>
        <CircleUserRoundIcon className="size-4/5 text-muted-foreground" />
      </AvatarFallback>
    </Avatar>
  );
}
