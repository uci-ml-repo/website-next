import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { feature } from "../schema";

export const featureSelectSchema = createSelectSchema(feature);
export type FeatureSelect = z.infer<typeof featureSelectSchema>;
