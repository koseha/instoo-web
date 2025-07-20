// app/layout.tsx

import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";
import Header from "@/components/layouts/Header";
import "@/theme/globals.css";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "@/components/sidebar/Sidebar";
import ModalProvider from "@/components/providers/modal.provider";

export const metadata = {
  title: "인스투",
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
          {/* <Flex className="main-content" minH="100vh"> */}
          <Flex className="main-content" minH={1000}>
            <Sidebar />
            <Box as="main" flex="1" p={10}>
              {children}
            </Box>
          </Flex>
          {/* Footer - 전체 너비 */}
          <footer></footer>
          {/* 전역 모달들 */}
          <ModalProvider />
        </Providers>
      </body>
    </html>
  );
}
