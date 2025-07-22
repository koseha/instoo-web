import apiClient from "@/lib/axios-api";
import { API_ENDPOINTS } from "@/types/enums/api-endpoints.enum";
import { ApiResponse } from "@/types/interfaces/api-response.interface";

export interface StreamerSummary {
  uuid: string;
  name: string;
  profileImageUrl?: string;
  isVerified: boolean;
  // platforms 필요 없음: 'My Streamers'에서 확인 가능 -> "수정하기" 동작에 필요해짐
  platforms: {
    platformName: string;
    channelUrl: string;
  }[];
}

export interface UserSummary {
  uuid: string;
  nickname: string;
}

export interface ScheduleResponse {
  uuid: string;
  title: string;
  scheduleDate: string;
  startTime?: string;
  status: "SCHEDULED" | "BREAK" | "TIME_TBD";
  description?: string;
  streamer: StreamerSummary;
  createdBy?: UserSummary;
  updatedBy?: UserSummary;
  version: number;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleRequest {
  title: string;
  scheduleDate: string;
  startTime?: string;
  status: "SCHEDULED" | "BREAK" | "TIME_TBD" | string;
  description?: string;
  streamerUuid: string;
}

export interface ModifyScheduleRequest {
  title: string;
  startTime?: string;
  status: "SCHEDULED" | "BREAK" | "TIME_TBD" | string;
  description?: string;
  lastUpdatedAt: string;
}

export interface ScheduleBaseInfoDto {
  uuid: string;
  startTime: string | null;
  title: string;
  streamerName: string;
  likeCount: number;
  isLiked: boolean;
}

export interface SchedulesResponseDto {
  scheduleDate: string;
  breaks: ScheduleBaseInfoDto[];
  tbd: ScheduleBaseInfoDto[];
  scheduled: ScheduleBaseInfoDto[];
}

export interface GetSchedulesDto {
  streamerUuids?: string[];
  startDate?: string;
  endDate?: string;
}

export class ScheduleService {
  /**
   * 스케줄(일정) 등록하기
   */
  static async createNewSchedule(
    body: CreateScheduleRequest,
  ): Promise<ScheduleResponse> {
    try {
      const response = await apiClient.post<ApiResponse<ScheduleResponse>>(
        API_ENDPOINTS.SCHEDULES.CREATE,
        body,
      );

      return response.data.content;
    } catch (error) {
      console.error("스케줄(일정) 등록 요청 실패:", error);
      throw new Error("스케줄(일정) 등록에 실패했습니다.");
    }
  }

  /**
   * 스케줄(일정) 수정하기
   */
  static async modifySchedule(
    scheduleUuid: string,
    body: ModifyScheduleRequest,
  ): Promise<ScheduleResponse> {
    try {
      const response = await apiClient.patch<ApiResponse<ScheduleResponse>>(
        API_ENDPOINTS.SCHEDULES.UPDATE(scheduleUuid),
        body,
      );

      return response.data.content;
    } catch (error) {
      console.error("스케줄(일정) 수정 요청 실패:", error);
      throw new Error("스케줄(일정) 수정에 실패했습니다.");
    }
  }

  /**
   * 스케줄(일정) 목록 조회
   */
  static async getStreamerSchedules(
    body: GetSchedulesDto,
  ): Promise<SchedulesResponseDto[]> {
    try {
      const response = await apiClient.post<
        ApiResponse<SchedulesResponseDto[]>
      >(API_ENDPOINTS.SCHEDULES.LIST_BY_STREAMER, body);

      return response.data.content;
    } catch (error) {
      console.error("스케줄(일정) 목록 요청 실패:", error);
      throw new Error("스케줄(일정) 목록에 실패했습니다.");
    }
  }

  /**
   * 스케줄(일정) 상세 조회
   */
  static async getStreamerScheduleDetail(
    scheduleUuid: string,
  ): Promise<ScheduleResponse> {
    try {
      const response = await apiClient.get<ApiResponse<ScheduleResponse>>(
        API_ENDPOINTS.SCHEDULES.DETAIL(scheduleUuid),
      );

      return response.data.content;
    } catch (error) {
      console.error("스케줄(일정) 상세 조회 요청 실패:", error);
      throw new Error("스케줄(일정) 상세 조회 요청에 실패했습니다.");
    }
  }

  /**
   * 스케줄 좋아요 추가
   */
  static async addLike(scheduleUuid: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.SCHEDULES.LIKE(scheduleUuid));
    } catch (error) {
      console.error("좋아요 추가 실패:", error);
      throw new Error("좋아요 추가에 실패했습니다.");
    }
  }

  /**
   * 스케줄 좋아요 취소
   */
  static async removeLike(scheduleUuid: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.SCHEDULES.UNLIKE(scheduleUuid));
    } catch (error) {
      console.error("좋아요 취소 실패:", error);
      throw new Error("좋아요 취소에 실패했습니다.");
    }
  }
}
