import path from "path";

import { serializeDatasetFilters } from "@/components/hooks/use-dataet-search-filters";
import type { DatasetQueryInput } from "@/server/types/dataset/request";

if (!process.env.NEXT_PUBLIC_CDN_URL) throw new Error();

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  PRIVACY_POLICY: "/privacy",

  SEARCH: (query?: DatasetQueryInput) => `/datasets${query ? serializeDatasetFilters(query) : ""}`,

  AUTH: {
    ROOT: "/auth",
    SIGN_IN: (options?: { callback?: string }) =>
      `/auth/login${options?.callback ? `?callback=${options.callback}` : ""}`,
    FORGOT_PASSWORD: "/auth/forgot",
    RESET_PASSWORD: "/auth/reset",
    VERIFY: "/auth/verify",
    VERIFY_EMAIL: (email: string) => `/auth/verify?email=${email}`,
  },

  ADMIN: {
    ROOT: "/admin",
    DATASETS: "/admin/datasets",
    EDITS: "/admin/edits",
    USERS: "/admin/users",
  },

  PROFILE: {
    ROOT: "/profile",
    SETTINGS: "/profile/settings",
    BOOKMARKS: "/profile/bookmarks",
    DATASETS: "/profile/datasets",
  },

  CONTRIBUTE: {
    ROOT: "/contribute",
    EXTERNAL: "/contribute/external",
    DONATION: "/contribute/donation",
    EXTERNAL_FORM: "/contribute/external/form",
    DONATION_FORM: "/contribute/donation/form",
  },

  CDN: process.env.NEXT_PUBLIC_CDN_URL,

  DATASET: Object.assign(
    ({ id, slug }: { id: number; slug: string }) =>
      path.join(ROUTES.DATASET.ROOT, String(id), slug),
    {
      ROOT: "/dataset",

      THUMBNAIL: ({ id, hasGraphics }: { id: number; hasGraphics: boolean }) =>
        path.join(ROUTES.CDN, hasGraphics ? String(id) : "default", "thumbnail.png"),

      ZIP: ({ id, slug }: { id: number; slug: string }) =>
        path.join(ROUTES.CDN, String(id), slug + ".zip"),

      FILES: (dataset: { id: number; slug: string }) => path.join(ROUTES.DATASET(dataset), "files"),

      SETTINGS: (dataset: { id: number; slug: string }) => {
        return path.join(ROUTES.DATASET(dataset), "settings");
      },
    },
  ),
};
