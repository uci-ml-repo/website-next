import { CircleUserRoundIcon } from "lucide-react";

import { auth, signIn } from "@/auth";
import Main from "@/components/layout/Main";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PROFILE_PATH } from "@/lib/routes";

export default async function Page() {
  const session = await auth();

  if (!session || !session.user) {
    return signIn(undefined, { redirectTo: PROFILE_PATH });
  }

  return (
    <Main>
      <div className={"flex items-center space-x-4"}>
        <Avatar>
          {session.user.image && <AvatarImage src={session.user.image} />}
          <AvatarFallback>
            <CircleUserRoundIcon className={"size-4/5 text-muted-foreground"} />
          </AvatarFallback>
        </Avatar>
        <div>{session.user.name}</div>
      </div>
      <div>{session.user.role}</div>
    </Main>
  );
}
