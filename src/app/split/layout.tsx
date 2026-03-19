"use client";

import { SplitProvider } from "@/lib/split-context";
import { AiProvider } from "@/lib/ai-context";

export default function SplitLayout({ children }: { children: React.ReactNode }) {
  return (
    <SplitProvider>
      <AiProvider>{children}</AiProvider>
    </SplitProvider>
  );
}
