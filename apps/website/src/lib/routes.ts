import path from "path";

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  PRIVACY_POLICY: "/privacy",

  DATASET: {
    ROOT: "/dataset",
    SEARCH: "/datasets",
    DATASET: ({ id, slug }: { id: number; slug: string }) =>
      path.join(ROUTES.DATASET.ROOT, String(id), slug),
  },

  AUTH: {
    ROOT: "/auth",
    SIGN_IN: "/auth/login",
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
};
