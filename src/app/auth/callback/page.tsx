import { Suspense } from "react";
import { Box, Text, Spinner, VStack } from "@chakra-ui/react";
import AuthCallbackContent from "./AuthCallbackContent";

// 로딩 컴포넌트
function AuthCallbackLoading() {
  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="primary.white"
    >
      <VStack spaceX={4}>
        <Spinner size="lg" color="primary.black" />
        <Text fontSize="md" color="neutral.700" fontFamily="body">
          인증 정보를 확인하고 있습니다...
        </Text>
      </VStack>
    </Box>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackLoading />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
