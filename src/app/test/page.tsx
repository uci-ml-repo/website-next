"use client";

import { useRouter } from "next/navigation";

export default function Test() {
  const router = useRouter();

  return (
    <button onClick={() => router.push("/about")}>
      Click here to read more
    </button>
  );
}
