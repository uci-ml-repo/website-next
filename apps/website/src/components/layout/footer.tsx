import { AnteaterLogo } from "@components/logo/anteater";
import { MLRepoLogo } from "@components/logo/ml-repo";
import { ROUTES } from "@lib/routes";
import Link from "next/link";

interface FooterLinkGroupProps {
  title: string;
  links: { name: string; href: string }[];
}

const linkGroups: FooterLinkGroupProps[] = [
  {
    title: "Our Project",
    links: [
      { name: "About Us", href: ROUTES.ABOUT },
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
        href: ROUTES.CONTACT,
      },
      {
        name: "Privacy Policy",
        href: ROUTES.PRIVACY_POLICY,
      },
      {
        name: "Feature Request / Bug Report",
        href: "https://github.com/uci-ml-repo/ucimlrepo-feedback/issues",
      },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-blue text-blue-foreground py-8">
      <div className="content flex justify-around gap-10 max-md:flex-col">
        <div className="flex h-24 w-fit items-center self-center">
          <AnteaterLogo className="fill-blue-foreground mr-4 h-1/2 max-lg:hidden" />
          <MLRepoLogo
            textColor="blue-foreground"
            variant="logo"
            className="max-md: w-56 text-wrap"
          />
        </div>
        {linkGroups.map((group) => (
          <FooterLinkGroup key={group.title} {...group} />
        ))}
      </div>
    </footer>
  );
}

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div className="space-y-4">
      <div className="font-bold">{title}</div>
      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.href}>
            <Link
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              className="hover:underline"
            >
              {link.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
