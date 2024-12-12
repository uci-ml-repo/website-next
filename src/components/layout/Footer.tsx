import Link from "next/link";
import type { HTMLAttributeAnchorTarget } from "react";

import { Banner } from "@/components/icons";
import Anteater from "@/components/icons/Anteater";
import {
  ABOUT_PATH,
  CONTACT_PATH,
  HOME_PATH,
  PRIVACY_POLICY_PATH,
} from "@/globals";

interface FooterLinkGroupProps {
  title: string;
  links: { name: string; href: string; target?: HTMLAttributeAnchorTarget }[];
}

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div className={"space-y-4"}>
      <div className={"font-bold"}>{title}</div>
      <div className={"space-y-2"}>
        {links.map((link, index) => (
          <div key={index}>
            <Link
              href={link.href}
              className={"hover:underline"}
              target={link.target}
            >
              {link.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const linkGroups: FooterLinkGroupProps[] = [
    {
      title: "Our Project",
      links: [
        { name: "About Us", href: ABOUT_PATH },
        {
          name: "Center for Machine Learning",
          href: "https://cml.ics.uci.edu/",
          target: "_blank",
        },
        {
          name: "National Science Foundation",
          href: "https://www.nsf.gov/",
          target: "_blank",
        },
      ],
    },
    {
      title: "Resources",
      links: [
        {
          name: "Contact",
          href: CONTACT_PATH,
        },
        {
          name: "Privacy Policy",
          href: PRIVACY_POLICY_PATH,
        },
        {
          name: "Report an Issue",
          href: "#", // TODO
        },
      ],
    },
  ];

  return (
    <footer
      className={"flex justify-center bg-uci-blue py-8 text-primary-foreground"}
    >
      <div className={"content-x w-full"}>
        <div
          className={
            "grid grid-flow-row gap-10 max-sm:justify-center sm:grid-flow-col"
          }
        >
          <div>
            <Link href={HOME_PATH} className={"flex h-full w-fit items-center"}>
              <div className={"flex h-24 w-fit items-center"}>
                <Anteater
                  className={"mr-4 h-1/2 fill-primary-foreground max-lg:hidden"}
                />
                <Banner
                  variant={"logo"}
                  textColor={"monoForeground"}
                  className={"w-56"}
                />
              </div>
            </Link>
          </div>

          {linkGroups.map((group, index) => (
            <FooterLinkGroup key={index} {...group} />
          ))}
        </div>
      </div>
    </footer>
  );
}
