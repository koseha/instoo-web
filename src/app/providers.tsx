// app/providers.tsx
"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";
import system from "@/theme";
import { QueryProvider } from "@/components/providers/query.provider";
import { AuthProvider } from "@/components/providers/auth.provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ChakraProvider value={system}>
        <AuthProvider>{children}</AuthProvider>
      </ChakraProvider>
    </QueryProvider>
  );
}
