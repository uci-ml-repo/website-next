import { ArrowRightIcon, LinkIcon, UploadIcon } from "lucide-react";
import Link from "next/link";

import { VerificationRequired } from "@/components/auth/VerificationRequired";
import { Card, CardContent } from "@/components/ui/card";
import {
  CONTRIBUTE_DONATION_ROUTE,
  CONTRIBUTE_EXTERNAL_ROUTE,
  PROFILE_DATASETS_ROUTE,
} from "@/lib/routes";

import Contribution from "./contribution.mdx";

export default function Page() {
  const options = [
    {
      href: CONTRIBUTE_DONATION_ROUTE,
      Icon: UploadIcon,
      title: "Upload Dataset",
    },
    {
      href: CONTRIBUTE_EXTERNAL_ROUTE,
      Icon: LinkIcon,
      title: "Link External Dataset",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Contribution />
      </div>
      <div className="space-y-2">
        <div className="text-muted-foreground">
          Select a way to contribute below:
        </div>
        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
          {options.map(({ href, Icon, title }) => (
            <DonationOption key={href} href={href}>
              <div className="flex items-center space-x-2">
                <div className="mx-auto">
                  <div className="flex items-center justify-center space-x-2 text-lg font-semibold">
                    <Icon className="size-5 shrink-0" />
                    <span>{title}</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <ArrowRightIcon />
                </div>
              </div>
            </DonationOption>
          ))}
        </div>
      </div>
      <div className="space-y-2 text-muted-foreground">
        <div>Need help deciding?</div>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            Choose <span className="font-bold">Upload Dataset</span> if you
            would like to upload a dataset to the UCI Machine Learning
            repository, making it publicly available for others to download
            directly from our website.
          </li>
          <li>
            Choose <span className="font-bold">Link External Dataset</span> if
            you would like to link a dataset from an external website. The UCI
            Machine Learning repository will direct users to the external page.
          </li>
        </ul>
      </div>
      <div className="text-muted-foreground">
        View donated datasets on{" "}
        <Link href={PROFILE_DATASETS_ROUTE} className="underline">
          your profile
        </Link>
        .
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
    <VerificationRequired
      signInTitle="An account is required to contribute datasets"
      signInBody="To beigin the dataset contribution process, plase sign in."
      verificationTitle="Verify your email to contribute datasets"
      verificationBody="To contribute datasets, you must verify your email."
      verifiedRedirect={href}
    >
      <Card className="lift-lg flex h-full justify-center text-center transition-all hover:bg-uci-gold hover:text-uci-gold-foreground">
        <CardContent className="w-full space-y-1 p-6">{children}</CardContent>
      </Card>
    </VerificationRequired>
  );
}
