// services/user.service.ts
import apiClient from "@/lib/axios-api";
import { User } from "@/stores/auth.store";
import { API_ENDPOINTS } from "@/types/enums/api-endpoints.enum";

// API 응답 타입 정의

interface UserResponse {
  content: User;
}

export class UserService {
  /**
   * 현재 사용자 정보 조회
   */
  static async getCurrentUser(token: string): Promise<User> {
    try {
      // 임시로 토큰을 헤더에 설정 (콜백 페이지에서 사용)
      const response = await apiClient.get<UserResponse>(
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
   * 프로필 수정
   */
  static async updateProfile({
    nickname,
  }: {
    nickname: string;
  }): Promise<User> {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.USERS.ME, {
        nickname,
      });

      return response.data.content;
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      throw new Error("프로필 수정에 실패했습니다.");
    }
  }
}
