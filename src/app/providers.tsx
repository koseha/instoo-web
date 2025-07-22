// app/providers.tsx
"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";
import system from "@/theme";
import { QueryProvider } from "@/components/providers/query.provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </QueryProvider>
  );
}
