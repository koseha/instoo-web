// utils/oauth.utils.ts

import { User } from "@/stores/auth.store";

/**
 * OAuth 팝업 창을 중앙에 배치하여 열기
 */
export const openOAuthPopup = (
  url: string,
  name: string = "oauth-popup",
): Window | null => {
  const width = 500;
  const height = 600;

  const screenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const screenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY;

  const windowWidth = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : window.screen.width;

  const windowHeight = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : window.screen.height;

  const left = screenLeft + windowWidth / 2 - width / 2;
  const top = screenTop + windowHeight / 2 - height / 2;

  const popup = window.open(
    url,
    name,
    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,location=yes,status=yes`,
  );

  if (popup) {
    popup.focus();
  }

  return popup;
};

/**
 * OAuth 메시지 이벤트 타입
 */
export interface OAuthMessage {
  type: "GOOGLE_AUTH_SUCCESS" | "GOOGLE_AUTH_ERROR";
  user?: User;
  token?: string;
  refreshToken?: string;
  error?: string;
}

/**
 * OAuth 팝업에서 메시지를 기다리는 Promise 래퍼
 */
export const waitForOAuthMessage = (popup: Window): Promise<OAuthMessage> => {
  return new Promise((resolve, reject) => {
    const handleMessage = (event: MessageEvent<OAuthMessage>) => {
      // 보안: origin 검증
      if (event.origin !== window.location.origin) {
        return;
      }

      if (
        event.data.type === "GOOGLE_AUTH_SUCCESS" ||
        event.data.type === "GOOGLE_AUTH_ERROR"
      ) {
        cleanup();
        resolve(event.data);
      }
    };

    const cleanup = () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(checkClosed);
    };

    // 팝업이 닫혔는지 주기적으로 확인
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        cleanup();
        reject(new Error("팝업이 닫혔습니다."));
      }
    }, 1000);

    // 메시지 이벤트 리스너 등록
    window.addEventListener("message", handleMessage);

    // 타임아웃 설정 (5분)
    setTimeout(() => {
      if (!popup.closed) {
        popup.close();
      }
      cleanup();
      reject(new Error("로그인 시간이 초과되었습니다."));
    }, 300000);
  });
};
