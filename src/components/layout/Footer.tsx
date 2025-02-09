import Link from "next/link";

import { Anteater, Banner } from "@/components/icons";
import {
  ABOUT_ROUTE,
  CONTACT_ROUTE,
  HOME_ROUTE,
  PRIVACY_POLICY_ROUTE,
} from "@/lib/routes";

interface FooterLinkGroupProps {
  title: string;
  links: { name: string; href: string }[];
}

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div className="space-y-4 text-uci-blue-foreground">
      <div className="font-bold">{title}</div>
      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.href}>
            <Link
              href={link.href}
              className="hover:underline"
              target={link.href.startsWith("http") ? "_blank" : undefined}
            >
              {link.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  const linkGroups: FooterLinkGroupProps[] = [
    {
      title: "Our Project",
      links: [
        { name: "About Us", href: ABOUT_ROUTE },
        {
          name: "Center for Machine Learning",
          href: "https://cml.ics.uci.edu/",
        },
        {
          name: "National Science Foundation",
          href: "https://www.nsf.gov/",
        },
      ],
    },
    {
      title: "Resources",
      links: [
        {
          name: "Contact",
          href: CONTACT_ROUTE,
        },
        {
          name: "Privacy Policy",
          href: PRIVACY_POLICY_ROUTE,
        },
        {
          name: "Feature Request / Bug Report",
          href: "#", // TODO
        },
      ],
    },
  ];

  return (
    <footer className="mt-12 flex justify-center bg-uci-blue py-8 text-primary-foreground dark:bg-uci-blue/40">
      <div className="content-x w-full">
        <div className="grid grid-flow-row gap-10 max-sm:justify-center sm:grid-flow-col">
          <div>
            <Link href={HOME_ROUTE} className="flex h-full w-fit items-center">
              <div className="flex h-24 w-fit items-center">
                <Anteater className="mr-4 h-1/2 fill-uci-blue-foreground max-lg:hidden" />
                <Banner
                  variant="logo"
                  textColor="monoUciBlueForeground"
                  className="w-56"
                />
              </div>
            </Link>
          </div>

          {linkGroups.map((group) => (
            <FooterLinkGroup key={group.title} {...group} />
          ))}
        </div>
      </div>
    </footer>
  );
}
