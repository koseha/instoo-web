// app/layout.tsx

import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";
import Header from "@/components/layouts/Header";
import "@/theme/globals.css";

export const metadata = {
  title: "Instoo",
  description: "Next.js with Chakra UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
