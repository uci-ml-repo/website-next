import { CircleUserRoundIcon } from "lucide-react";
import Link from "next/link";
import { VscGithubInverted } from "react-icons/vsc";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Developer({
  name,
  subTitle,
  avatar,
  github,
}: {
  name: string;
  subTitle: string;
  avatar: string;
  github?: string;
}) {
  return (
    <div className="flex items-center justify-between space-x-4 py-4">
      <div className="flex items-center">
        <Avatar className="mr-4 size-14 sm:size-16">
          <AvatarImage src={avatar} alt={`Avatar for ${name}`} />
          <AvatarFallback>
            <CircleUserRoundIcon className="text-muted-foreground size-full" />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-primary text-xl sm:text-2xl">{name}</div>
          <div className="text-muted-foreground">{subTitle}</div>
        </div>
      </div>
      <div className="flex items-center space-x-6 [&_svg]:size-8">
        {github && (
          <Link
            href={"https://github.com/" + github}
            target="_blank"
            aria-label={`GitHub profile of ${name}`}
          >
            <VscGithubInverted />
          </Link>
        )}
      </div>
    </div>
  );
}
