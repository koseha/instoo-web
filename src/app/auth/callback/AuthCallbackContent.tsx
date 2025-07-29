"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Text, Spinner, VStack } from "@chakra-ui/react";
import { AuthService } from "@/services/auth.service";

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const processAuthCallback = async () => {
      try {
        // URL에서 파라미터 추출
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refresh_token");
        const userUuid = searchParams.get("user_uuid");
        const error = searchParams.get("error");

        if (error) {
          // 로그인 실패
          if (window.opener) {
            window.opener.postMessage(
              {
                type: "GOOGLE_AUTH_ERROR",
                error: decodeURIComponent(error),
              },
              window.location.origin,
            );
          }
          window.close();
          return;
        }

        if (!token || !userUuid) {
          throw new Error("필수 파라미터가 누락되었습니다.");
        }

        // 디코딩된 토큰으로 사용자 정보 조회
        const decodedToken = decodeURIComponent(token);
        const userData = await AuthService.getCurrentUser(decodedToken);

        // 부모 창에 성공 메시지 전송
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "GOOGLE_AUTH_SUCCESS",
              user: userData,
              token: decodedToken,
              refreshToken: refreshToken
                ? decodeURIComponent(refreshToken)
                : null,
            },
            window.location.origin,
          );
        }

        // 팝업 창 닫기
        window.close();
      } catch (error) {
        console.error("OAuth 콜백 처리 오류:", error);

        // 부모 창에 에러 메시지 전송
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "GOOGLE_AUTH_ERROR",
              error:
                error instanceof Error
                  ? error.message
                  : "인증 처리 중 오류가 발생했습니다.",
            },
            window.location.origin,
          );
        }

        // 팝업 창 닫기
        window.close();
      }
    };

    processAuthCallback();
  }, [searchParams, router]);

  // 로딩 화면
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
          로그인 처리 중...
        </Text>
      </VStack>
    </Box>
  );
}
