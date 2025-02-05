import { db } from "@/db";

export default class UserFindService {
  async byId(id: string) {
    return db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    });
  }
  async accounts(userId: string) {
    return db.query.account.findMany({
      where: (account, { eq }) => eq(account.userId, userId),
    });
  }
}
