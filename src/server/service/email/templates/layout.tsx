import * as process from "node:process";

import { Img, Tailwind } from "@react-email/components";
import path from "path";

import { ABOUT_ROUTE, CONTACT_ROUTE, PRIVACY_POLICY_ROUTE } from "@/lib/routes";

export default function EmailTemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!process.env.ORIGIN) {
    throw new Error("ORIGIN is not set");
  }

  return (
    <Tailwind>
      <body className="mx-auto max-w-4xl">
        <header className="bg-gray-300 p-4">
          <a href={process.env.ORIGIN}>
            <Img
              src="cid:logo"
              alt="UCI Machine Learning Repository"
              className="h-20 w-auto"
            />
          </a>
        </header>
        <main>
          <div className="bg-gray-100 px-4 py-8">{children}</div>
        </main>
        <footer className="bg-blue-950 p-4 text-center">
          <div className="mx-auto space-y-2">
            <div>
              <div className="text-white">UCI Machine Learning Repository</div>
              <div className="text-sm text-gray-300">
                Donald Bren Hall, Irvine, CA 92617
              </div>
            </div>
            <div>
              <a
                href={path.join(process.env.ORIGIN, ABOUT_ROUTE)}
                className="text-white"
              >
                About
              </a>
              <span className="text-white"> | </span>
              <a
                href={path.join(process.env.ORIGIN, CONTACT_ROUTE)}
                className="text-white"
              >
                Contact
              </a>
              <span className="text-white"> | </span>
              <a
                href={path.join(process.env.ORIGIN, PRIVACY_POLICY_ROUTE)}
                className="text-white"
              >
                Privacy
              </a>
            </div>
          </div>
        </footer>
      </body>
    </Tailwind>
  );
}
