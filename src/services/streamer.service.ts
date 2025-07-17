import apiClient from "@/lib/axios-api";
import { API_ENDPOINTS } from "@/types/enums/api-endpoints.enum";
import { ApiResponse } from "@/types/interfaces/api-response.interface";

export interface PlatformSimpleInfo {
  platformName: string;
  channelUrl: string;
}

export interface StreamerSimpleResponse {
  uuid: string;
  name: string;
  profileImageUrl: string;
  platforms: PlatformSimpleInfo[];
}

export class StreamerService {
  /**
   * 방송인 간편 검색 데이터 가져오기 - 5개
   */
  static async searchSimpleStreamerByName(
    qName: string,
  ): Promise<StreamerSimpleResponse[]> {
    try {
      const response = await apiClient.get<
        ApiResponse<StreamerSimpleResponse[]>
      >(API_ENDPOINTS.STREAMERS.SEARCH, {
        params: {
          qName,
        },
      });

      return response.data.content;
    } catch (error) {
      console.error("방송인 간편 검색 요청 실패:", error);
      throw new Error("방송인 간편 검색 목록을 가져오는데 실패했습니다.");
    }
  }
}
