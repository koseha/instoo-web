import { useNotification } from "@/hooks/useNotifications";
import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 자동으로 토큰 추가
apiClient.interceptors.request.use(
  async (config) => {
    // 클라이언트 사이드에서만 확인
    if (typeof window !== "undefined") {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    // 성공 응답 처리
    return response;
  },
  async (error) => {
    const { response } = error;

    if (response?.status === 401) {
      // 토큰 만료 또는 인증 오류
      if (typeof window !== "undefined") {
        useAuthStore.getState().logout();
        useNotification().showError({
          message: "로그인이 만료되었습니다. 다시 로그인해주세요.",
        });
        window.location.href = "/auth/signin";
      }
    } else if (response?.status === 403) {
      useNotification().showError({ message: "접근 권한이 없습니다." });
    } else if (response?.status === 404) {
      useNotification().showError({
        message: "요청하신 정보를 찾을 수 없습니다.",
      });
    } else if (response?.status >= 500) {
      useNotification().showError({
        message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    } else if (response?.data?.message) {
      useNotification().showError({ message: response.data.message });
    }

    return Promise.reject(error);
  },
);

export default apiClient;
