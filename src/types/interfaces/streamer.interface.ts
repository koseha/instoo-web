/**
 * 플랫폼 정보
 */
export interface StreamerPlatform {
  platformName: string;
  channelUrl: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 사용자 요약 정보
 */
export interface UserSummary {
  uuid: string;
  nickname: string;
}

/**
 * 스트리머 정보
 */
export interface Streamer {
  uuid: string;
  name: string;
  profileImageUrl?: string | null;
  description?: string | null;
  followCount: number;
  isVerified: boolean;
  isActive: boolean;
  platforms: StreamerPlatform[] | null;
  createdBy?: UserSummary | null;
  updatedBy?: UserSummary | null;
  createdAt: string;
  updatedAt: string;
  verifiedAt: string;
}

export interface StreamerData {
  data: Streamer[];
  totalCount: number;
  page: number;
  size: number;
}

export interface newStreamerDto {
  name: string;
  platforms: Pick<StreamerPlatform, "channelUrl" | "platformName">[];
  profileImageUrl?: string;
  description: string;
}
