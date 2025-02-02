"use client";

import { useRef } from "react";

import { Sidebar, SidebarTrigger } from "@/components/ui/sidebar.new";

export default function AppSidebar() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Sidebar ref={ref}>
      <div className="m-2">
        <SidebarTrigger />
      </div>
    </Sidebar>
  );
}
