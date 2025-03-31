import { Img, Tailwind } from "@react-email/components";
import path from "path";

import { env } from "@/env";
import { ABOUT_ROUTE, CONTACT_ROUTE, PRIVACY_POLICY_ROUTE } from "@/lib/routes";

export function EmailLayout({ children }: { children: React.ReactNode }) {
  return (
    <Tailwind
      config={{
        darkMode: "class",
      }}
    >
      <body className="mx-auto max-w-4xl">
        <header className="bg-gray-300 p-4">
          <Img
            src={path.join(env.ORIGIN, "img", "logo.png")}
            alt="UCI Machine Learning Repository"
            className="h-20 w-auto dark:hidden"
          />
          <Img
            src={path.join(env.ORIGIN, "img", "logo-dark.png")}
            alt="UCI Machine Learning Repository"
            className="hidden h-20 w-auto dark:block"
          />
        </header>
        <main>
          <div className="bg-gray-100 px-4 py-8">{children}</div>
        </main>
        <div className="bg-blue-950 p-4 text-center dark:bg-blue-950">
          <div className="mx-auto space-y-2">
            <div>
              <div className="text-white">UCI Machine Learning Repository</div>
              <div className="text-sm text-gray-300">Donald Bren Hall, Irvine, CA 92617</div>
            </div>
            <div>
              <a href={path.join(env.ORIGIN, ABOUT_ROUTE)} className="text-white">
                About
              </a>
              <span className="text-white"> | </span>
              <a href={path.join(env.ORIGIN, CONTACT_ROUTE)} className="text-white">
                Contact
              </a>
              <span className="text-white"> | </span>
              <a href={path.join(env.ORIGIN, PRIVACY_POLICY_ROUTE)} className="text-white">
                Privacy
              </a>
            </div>
          </div>
        </div>

        {/* Prevent emails from trimming */}
        <span className="text-[0]">{Date.now()}</span>
      </body>
    </Tailwind>
  );
}
