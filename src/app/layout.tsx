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
          {/* Header - 전체 너비 */}
          <header>
            <Header />
            <Toaster />
          </header>
          {/* Sub-header - 전체 너비 */}
          <div></div>
          {/* Main Content - 너비 제한 */}
          <main>{children}</main>
          {/* Footer - 전체 너비 */}
          <footer></footer>
        </Providers>
      </body>
    </html>
  );
}
