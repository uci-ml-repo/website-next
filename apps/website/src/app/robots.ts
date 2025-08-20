import type { MetadataRoute } from "next";

import { ROUTES } from "@/lib/routes";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: [ROUTES.PROFILE.ROOT, ROUTES.ADMIN.ROOT, ROUTES.AUTH.VERIFY],
    },
  };
}
