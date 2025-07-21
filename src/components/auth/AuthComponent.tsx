"use client";

import React from "react";
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Button,
  Text,
  Box,
  Flex,
  Portal,
  PopoverPositioner,
} from "@chakra-ui/react";
import { useAuthStore } from "@/stores/auth.store";
import { useNotification } from "@/hooks/useNotifications";
import { AuthService } from "@/services/auth.service";
import { openOAuthPopup, waitForOAuthMessage } from "@/utils/oauth.utils";
import { OAuthProvider } from "@/types/enums/oauth-provider.enum";
import MyProfilePopover from "../user/MyProfilePopover";
import { useScrolled } from "@/hooks/useScrolled";

const AuthComponent: React.FC = () => {
  const { login, logout, isAuthenticated } = useAuthStore();
  const { showSuccess, showError } = useNotification();
  const scrolled = useScrolled();

  const handleGoogleLogin = async () => {
    try {
      // 1. OAuth URL 요청
      const oauthUrl = await AuthService.getOAuthUrl(OAuthProvider.GOOGLE);

      // 2. OAuth 팝업 열기
      const popup = openOAuthPopup(oauthUrl, "google-oauth");

      if (!popup) {
        throw new Error("팝업을 열 수 없습니다. 팝업 차단을 확인해주세요.");
      }

      // 3. 팝업에서 메시지 대기
      const result = await waitForOAuthMessage(popup);

      if (result.type === "GOOGLE_AUTH_SUCCESS") {
        // 4. 로그인 성공 처리
        const { user: userData, token, refreshToken } = result;

        if (!userData || !token) {
          throw new Error("로그인 정보가 올바르지 않습니다.");
        }

        // Store에 사용자 정보 저장
        login(token, userData);

        // refreshToken이 있으면 localStorage에 저장
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }

        showSuccess({ title: `${userData.nickname}님 환영합니다!` });
      } else if (result.type === "GOOGLE_AUTH_ERROR") {
        // 5. 로그인 실패 처리
        const errorMessage = result.error || "로그인에 실패했습니다.";
        showError({ title: errorMessage });
      }
    } catch (error) {
      console.error("Google 로그인 오류:", error);
      showError({
        title:
          error instanceof Error
            ? error.message
            : "로그인 중 오류가 발생했습니다.",
      });
    }
  };

  const handleLogout = () => {
    logout();
    showSuccess({ title: `로그아웃을 완료했습니다!` });
  };

  // 로그인된 상태: 사용자 정보와 로그아웃 버튼 표시
  if (isAuthenticated) {
    return (
      <Flex align="center" gap={1}>
        <MyProfilePopover />
        <Button
          variant={scrolled ? undefined : "ghost"}
          fontWeight="500"
          size="sm"
          onClick={handleLogout}
          fontFamily="body"
        >
          로그아웃
        </Button>
      </Flex>
    );
  }

  // 로그인되지 않은 상태: 로그인 Popover 표시
  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <Button
          variant={scrolled ? undefined : "ghost"}
          fontWeight="500"
          size="sm"
          fontFamily="body"
        >
          로그인
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverPositioner>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                borderColor="neutral.300"
                _hover={{
                  borderColor: "neutral.400",
                  bg: "neutral.100",
                }}
                h="44px"
                w="100%"
                fontFamily="body"
              >
                <Box
                  w="20px"
                  h="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {/* Google 아이콘 */}
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </Box>
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color="neutral.700"
                  fontFamily="body"
                >
                  Google로 시작하기
                </Text>
              </Button>
            </PopoverBody>
          </PopoverContent>
        </PopoverPositioner>
      </Portal>
    </PopoverRoot>
  );
};

export default AuthComponent;
