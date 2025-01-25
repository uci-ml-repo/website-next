import { auth } from "@/auth";
import Discussions from "@/components/discussion/Discussions";

export default async function Page() {
  const session = await auth();
  return <Discussions userId={session?.user.id} />;
}
