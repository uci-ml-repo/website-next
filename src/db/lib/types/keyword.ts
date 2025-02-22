import type { datasetKeyword, keyword } from "@/db/schema";

export type DatasetKeywordSelect = typeof datasetKeyword.$inferSelect;
export type KeywordSelect = typeof keyword.$inferSelect;
