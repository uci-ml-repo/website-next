/* eslint-disable @typescript-eslint/no-namespace */

import path from "path";

export namespace ROUTES {
  export const HOME = "/";

  export const ABOUT = "/about";
  export const CONTACT = "/contact";
  export const PRIVACY_POLICY = "/privacy";

  export namespace DATASET {
    export const BASE = "/dataset";
    export const ROOT = "/datasets";

    export const DATASET = ({ id, slug }: { id: number; slug: string }) =>
      path.join(BASE, String(id), slug);
  }

  export namespace AUTH {
    export const ROOT = "/auth";
    export const SIGN_IN = `${ROOT}/login`;
    export const FORGOT_PASSWORD = `${ROOT}/forgot`;
    export const RESET_PASSWORD = `${ROOT}/reset`;
    export const VERIFY_EMAIL = `${ROOT}/verify`;
  }

  export namespace ADMIN {
    export const ROOT = "/admin";
    export const DATASETS = `${ROOT}/datasets`;
    export const EDITS = `${ROOT}/edits`;
    export const USERS = `${ROOT}/users`;
  }

  export namespace PROFILE {
    export const ROOT = "/profile";
    export const SETTINGS = `${ROOT}/settings`;
    export const BOOKMARKS = `${ROOT}/bookmarks`;
    export const DATASETS = `${ROOT}/datasets`;
  }

  export namespace CONTRIBUTE {
    export const ROOT = "/contribute";
    export const EXTERNAL = `${ROOT}/external`;
    export const DONATION = `${ROOT}/donation`;
    export const EXTERNAL_FORM = `${ROOT}/external/form`;
    export const DONATION_FORM = `${ROOT}}/donation/form`;
  }
}
