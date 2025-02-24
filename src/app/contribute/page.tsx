import { ArrowRightIcon, LinkIcon, UploadIcon } from "lucide-react";

import { SignInRequired } from "@/components/auth/SignInRequired";
import { Card, CardContent } from "@/components/ui/card";
import {
  CONTRIBUTE_DONATION_ROUTE,
  CONTRIBUTE_EXTERNAL_ROUTE,
} from "@/lib/routes";

import Contribution from "./contribution.mdx";

export default function Page() {
  const options = [
    {
      href: CONTRIBUTE_DONATION_ROUTE,
      Icon: UploadIcon,
      title: "Upload Dataset",
      description: "Upload a dataset to the repository.",
    },
    {
      href: CONTRIBUTE_EXTERNAL_ROUTE,
      Icon: LinkIcon,
      title: "Link External Dataset",
      description: "Link a dataset from an external website.",
    },
  ];

  return (
    <div className="space-y-6">
      <Contribution />
      <div className="space-y-2 pt-6">
        <div className="text-muted-foreground">
          Select a contribution option below:
        </div>
        <div className="grid grid-cols-2 gap-4">
          {options.map(({ href, Icon, title, description }) => (
            <DonationOption key={href} href={href}>
              <div className="flex items-center space-x-2">
                <div className="mx-auto">
                  <div className="flex items-center justify-center space-x-2 text-lg font-semibold">
                    <Icon className="size-5" />
                    <span>{title}</span>
                  </div>
                  <div className="text-pretty text-sm text-muted-foreground">
                    {description}
                  </div>
                </div>
                <div className="flex justify-end">
                  <ArrowRightIcon className="text-muted-foreground" />
                </div>
              </div>
            </DonationOption>
          ))}
        </div>
      </div>
    </div>
  );
}

function DonationOption({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <SignInRequired
      title="Sign in to contribute datasets"
      body="To beigin the dataset contribution process, plase sign in."
      authedRedirect={href}
    >
      <Card className="lift-lg flex h-full justify-center text-center transition-all hover:bg-uci-gold">
        <CardContent className="w-full space-y-1 p-6">{children}</CardContent>
      </Card>
    </SignInRequired>
  );
}
