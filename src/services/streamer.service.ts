import apiClient from "@/lib/axios-api";
import { API_ENDPOINTS } from "@/types/enums/api-endpoints.enum";
import { ApiResponse } from "@/types/interfaces/api-response.interface";
import {
  newStreamerDto,
  Streamer,
  StreamerData,
  StreamerSimpleResponse,
} from "@/types/interfaces/streamer.interface";

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

  /**
   * 방송인 목록 조회
   */
  static async getStreamerList(body: {
    isVerified: boolean;
    page: number;
    size: number;
    platforms?: string[];
    qName?: string;
  }): Promise<StreamerData> {
    try {
      const response = await apiClient.post<ApiResponse<StreamerData>>(
        API_ENDPOINTS.STREAMERS.LIST,
        body,
      );

      return response.data.content;
    } catch (error) {
      console.error("방송인 목록 조회 요청 실패:", error);
      throw new Error("방송인 목록을 가져오는데 실패했습니다.");
    }
  }

  /**
   * 신규 방송인 등록하기
   */
  static async registerNewStreamer(body: newStreamerDto): Promise<void> {
    try {
      await apiClient.post("/v1/streamers", body);
    } catch (error) {
      console.error("신규 방송인 등록 요청 실패:", error);
      throw new Error("신규 방송인 등록에 실패했습니다.");
    }
  }

  /**
   * 방송인 상세 조회
   */
  static async getStreamerDetail(uuid: string): Promise<Streamer> {
    try {
      const response = await apiClient.get<ApiResponse<Streamer>>(
        API_ENDPOINTS.STREAMERS.DETAIL(uuid),
      );

      return response.data.content;
    } catch (error) {
      console.error("신규 방송인 등록 요청 실패:", error);
      throw new Error("신규 방송인 등록에 실패했습니다.");
    }
  }

  /**
   * 방송인 팔로우하기
   */
  static async followStreamer(uuid: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.STREAMERS.FOLLOW(uuid));
    } catch (error) {
      console.error("방송인 팔로우 요청 실패:", error);
      throw new Error("방송인 팔로우에 실패했습니다.");
    }
  }

  /**
   * 방송인 언팔로우하기
   */
  static async unfollowStreamer(uuid: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.STREAMERS.UNFOLLOW(uuid));
    } catch (error) {
      console.error("방송인 언팔로우 요청 실패:", error);
      throw new Error("방송인 언팔로우에 실패했습니다.");
    }
  }

  /**
   * uuids로 방송인 간단 정보 조회
   */
  static async getSimpleStreamerByUuids(
    uuids: string[],
  ): Promise<StreamerSimpleResponse[]> {
    try {
      const response = await apiClient.post<
        ApiResponse<StreamerSimpleResponse[]>
      >(API_ENDPOINTS.STREAMERS.BATCH_SIMPLE, { uuids: uuids });

      return response.data.content;
    } catch (error) {
      console.error("방송인 언팔로우 요청 실패:", error);
      throw new Error("방송인 언팔로우에 실패했습니다.");
    }
  }

  /**
   * 팔로우 중인 스트리머의 간단 정보 조회
   */
  static async getMyStreamerByFollowing(): Promise<StreamerSimpleResponse[]> {
    try {
      const response = await apiClient.get<
        ApiResponse<StreamerSimpleResponse[]>
      >(API_ENDPOINTS.STREAMERS.GET_SIMPLE_BY_FOLLOW);

      return response.data.content;
    } catch (error) {
      console.error("팔로우 중인 스트리머의 간단 정보 조회 요청 실패:", error);
      throw new Error("팔로우 중인 스트리머의 간단 정보 조회에 실패했습니다.");
    }
  }

  /**
   * 팔로잉 스트리머의 isActive 저장
   */
  static async saveBatchActiveFollowing(body: {
    updates: { streamerUuid: string; isActive: boolean }[];
  }) {
    try {
      const response = await apiClient.patch<ApiResponse<string>>(
        API_ENDPOINTS.STREAMERS.IS_ACTIVE,
        body,
      );

      return response.data.content;
    } catch (error) {
      console.error("팔로잉 스트리머의 isActive 저장 요청 실패:", error);
      throw new Error("팔로잉 스트리머의 isActive 저장에 실패했습니다.");
    }
  }

  /**
   * [관리자] 스트리머 인증 허용
   */
  static async verifyStreamer(uuid: string) {
    try {
      const response = await apiClient.patch<ApiResponse<Streamer>>(
        API_ENDPOINTS.STREAMERS.VERIFY(uuid),
        { isVerified: true },
      );

      return response.data.content;
    } catch (error) {
      console.error("팔로잉 스트리머의 isActive 저장 요청 실패:", error);
      throw new Error("팔로잉 스트리머의 isActive 저장에 실패했습니다.");
    }
  }

  /**
   * [관리자] 스트리머 인증 해제
   */
  static async unverifyStreamer(uuid: string) {
    try {
      const response = await apiClient.patch<ApiResponse<Streamer>>(
        API_ENDPOINTS.STREAMERS.VERIFY(uuid),
        { isVerified: false },
      );

      return response.data.content;
    } catch (error) {
      console.error("팔로잉 스트리머의 isActive 저장 요청 실패:", error);
      throw new Error("팔로잉 스트리머의 isActive 저장에 실패했습니다.");
    }
  }
}
