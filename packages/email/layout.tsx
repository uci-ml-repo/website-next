import { Head, Html, Img, Tailwind, Text } from "@react-email/components";
import * as path from "path";
import type { ReactNode } from "react";

import { env } from "./env";

export function EmailLayout({ name, children }: { name?: string; children: ReactNode }) {
  return (
    <Html lang="en">
      <Tailwind>
        <Head />
        <body className="mx-auto">
          <header className="bg-gray-300 p-4">
            <Img height={50} src={path.join(env.NEXT_PUBLIC_BASE_URL, "img", "logo.png")} />
          </header>
          <main>
            <div className="bg-gray-100 p-4 pb-8">
              {name && <Text className="mb-6">{name},</Text>}
              {children}
            </div>
          </main>
          <div className="bg-blue-950 p-4 text-center">
            <div className="text-white">UCI Machine Learning Repository</div>
            <div className="text-sm text-gray-300">Donald Bren Hall, Irvine, CA 92617</div>
          </div>

          {/* Prevent emails from trimming */}
          <span className="text-[0]">{Date.now()}</span>
        </body>
      </Tailwind>
    </Html>
  );
}
