import apiClient from "@/lib/axios-api";
import { API_ENDPOINTS } from "@/types/enums/api-endpoints.enum";
import { ApiResponse } from "@/types/interfaces/api-response.interface";

export interface StreamerSummary {
  uuid: string;
  name: string;
  profileImageUrl?: string;
  isVerified: boolean;
  // platforms 필요 없음: 'My Streamers'에서 확인 가능
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
  status: "SCHEDULED" | "BREAK" | "TIME_TBD" | string;
  isTimeUndecided: boolean;
  isBreak: boolean;
  description?: string;
  streamer: StreamerSummary;
  createdBy?: UserSummary;
  updatedBy?: UserSummary;
  version: number;
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
        API_ENDPOINTS.SCHEDULES.CREATE,
        body,
        {
          params: {
            uuid: scheduleUuid,
          },
        },
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
}
