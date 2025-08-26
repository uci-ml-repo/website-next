// app/debug/headers/page.tsx
import { headers } from "next/headers";

export default async function Page() {
  const all = Object.fromEntries((await headers()).entries());
  return <pre>{JSON.stringify(all, null, 2)}</pre>;
}
