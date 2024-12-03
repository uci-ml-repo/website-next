import { HydrateClient, trpc } from "@/server/trpc/server";

import { ClientGreeting } from "./client-greeting";

export default async function Home() {
  void trpc.hello.prefetch({ text: "world" });
  return (
    <HydrateClient>
      <ClientGreeting />
    </HydrateClient>
  );
}
