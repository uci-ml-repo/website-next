"use client";

import { ChevronUpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function BackToTop() {
  function toTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Button variant="secondary" onClick={toTop}>
      <ChevronUpIcon /> Back to top
    </Button>
  );
}
