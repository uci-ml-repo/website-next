import { auth } from "@/auth";
import Discussions from "@/components/dataset/tabs/discussions/Discussions";

export default async function ProfileDiscussions() {
  const session = await auth();

  return (
    <div className="space-y-4">
      <Discussions userId={session?.user.id} />
    </div>
  );
}
