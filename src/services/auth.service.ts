// services/auth.service.ts
import apiClient from "@/lib/axios-api";
import { User } from "@/stores/auth.store";
import { API_ENDPOINTS } from "@/types/enums/api-endpoints.enum";
import { OAuthProvider } from "@/types/enums/oauth-provider.enum";
import { ApiResponse } from "@/types/interfaces/api-response.interface";

// API 응답 타입 정의
interface OAuthUrlResponse {
  oauthUrl: string;
}

export class AuthService {
  /**
   * OAuth 로그인 URL 가져오기
   */
  static async getOAuthUrl(provider: OAuthProvider): Promise<string> {
    try {
      const response = await apiClient.get<ApiResponse<OAuthUrlResponse>>(
        API_ENDPOINTS.AUTH.OAUTH_URL(provider),
      );
      return response.data.content.oauthUrl;
    } catch (error) {
      console.error("OAuth URL 요청 실패:", error);
      throw new Error("OAuth URL을 가져오는데 실패했습니다.");
    }
  }

  /**
   * 현재 사용자 정보 조회
   */
  static async getCurrentUser(token: string): Promise<User> {
    try {
      // 임시로 토큰을 헤더에 설정 (콜백 페이지에서 사용)
      const response = await apiClient.get<ApiResponse<User>>(
        API_ENDPOINTS.USERS.ME,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data.content;
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      throw new Error("사용자 정보를 가져오는데 실패했습니다.");
    }
  }

  /**
   * 토큰 갱신
   */
  static async refreshToken(
    refreshToken: string,
  ): Promise<{ token: string; refreshToken?: string }> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken,
      });
      return response.data.content;
    } catch (error) {
      console.error("토큰 갱신 실패:", error);
      throw new Error("토큰 갱신에 실패했습니다.");
    }
  }

  /**
   * 로그아웃
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error("로그아웃 API 실패:", error);
      // 로그아웃은 실패해도 로컬 상태는 정리
    }
  }
}
