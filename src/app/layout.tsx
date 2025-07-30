// app/layout.tsx

import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";
import Header from "@/components/layouts/Header";
import "@/theme/globals.css";
import { Box, Flex, VStack } from "@chakra-ui/react";
import ModalProvider from "@/components/providers/modal.provider";
import Footer from "@/components/layouts/Footer";
import GoogleAnalytics from "./GoogleAnalytics";
import Tour from "@/components/common/Tour";
import MiniSidebar from "@/components/sidebar/MiniSidebar";
import InteractiveSidebar from "@/components/layouts/InteractiveSidebar";

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
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        )}
        <Providers>
          <Tour />

          {/* 전체를 하나의 flex container로 */}
          <Box minH="100vh" display="flex" flexDirection="column">
            {/* Header */}
            <Header />

            {/* Main content - flex로 늘어남 */}
            <Flex className="main-content" flex={1} w="full">
              <InteractiveSidebar />

              <VStack
                py={{ base: 3, lg: 10 }}
                pr={0}
                pl={{ base: 6, lg: 10 }}
                flex={1}
                gap={0}
                minH={0} // 중요: flex item의 최소 높이 제한 해제
              >
                <Box as="main" w="full" flex={1}>
                  {children}
                </Box>
                <Footer />
              </VStack>
            </Flex>
          </Box>

          {/* 전역 모달들 */}
          <ModalProvider />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
