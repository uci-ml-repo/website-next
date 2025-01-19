import { db } from "@/db";
import type { DatasetQuery } from "@/server/schema/datasets";

function buildQuery() {}

export default class DatasetsFindService {
  async byId(id: number) {
    return db.query.datasets.findFirst({
      where: (datasets, { eq }) => eq(datasets.id, id),
      with: {
        datasetKeywords: {
          with: {
            keyword: true,
          },
        },
        authors: true,
        introductoryPaper: true,
        variables: true,
        user: true,
      },
    });
  }

  // TODO: Implement Fuzzy
  async byTitle(title: string) {
    return undefined;
  }

  async byQuery(input: DatasetQuery) {
    return [];
  }

  async byUserId(userId: string) {
    return db.query.datasets.findMany({
      where: (datasets, { eq }) => eq(datasets.userId, userId),
    });
  }
}
