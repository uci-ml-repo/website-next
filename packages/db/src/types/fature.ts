import { getTableColumns } from "drizzle-orm";

import { feature } from "../schema";

export const featureColumns = getTableColumns(feature);
