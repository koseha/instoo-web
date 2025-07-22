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
  isFollowed: boolean;
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

export interface PlatformSimpleInfo {
  platformName: string;
  channelUrl: string;
}

export interface StreamerSimpleResponse {
  uuid: string;
  name: string;
  profileImageUrl: string;
  platforms: PlatformSimpleInfo[];
  followCount: number;
  isFollowed: boolean;
}

// 로컬 저장용 - followCount 제외
export interface StreamerBasicInfo {
  uuid: string;
  name: string;
  profileImageUrl: string;
  platforms: PlatformSimpleInfo[];
}
