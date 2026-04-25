import { SidebarProvider } from "@/components/ui/sidebar";
import { PlaygroundProvider } from "@/features/playground/context/playground-context";
import React from "react";

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlaygroundProvider>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </PlaygroundProvider>
  );
}
