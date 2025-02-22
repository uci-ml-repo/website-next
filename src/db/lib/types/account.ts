import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { selectColumns } from "@/db/lib/utils";
import { account } from "@/db/schema";

export const accountSelect = {
  type: account.type,
  provider: account.provider,
  providerAccountId: account.providerAccountId,
  token_type: account.token_type,
  scope: account.scope,
  expires_at: account.expires_at,
  userId: account.userId,
};

export const accountColumns = selectColumns(accountSelect);

export const accountSchema = createSelectSchema(account).pick(accountColumns);

export type AccountSelect = z.infer<typeof accountSchema>;
