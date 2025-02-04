import { db } from "@/db";

export default class DatasetPrivilegedFindService {
  async byId(id: number) {
    return db.query.dataset.findFirst({
      where: (dataset, { eq }) => eq(dataset.id, id),

      with: {
        datasetKeywords: { with: { keyword: true } },
        authors: true,
        introductoryPaper: true,
        variables: true,
        user: true,
      },
    });
  }
}
