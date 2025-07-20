// API 엔드포인트 상수
export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    OAUTH_URL: (provider: string) => `/v1/auth/${provider}/login`,
    REFRESH: "/v1/auth/refresh",
    LOGOUT: "/v1/auth/logout",
  },

  // 사용자
  USERS: {
    ME: "/v1/users/me",
    DETAIL: (uuid: string) => `/v1/users/${uuid}`,
  },

  // 방송인
  STREAMERS: {
    CREATE: "/v1/streamers",
    LIST: "/v1/streamers/list",
    SEARCH: `/v1/streamers/search`,
    DETAIL: (uuid: string) => `/v1/streamers/${uuid}`,
    UPDATE: (uuid: string) => `/v1/streamers/${uuid}`,
    VERIFY: (uuid: string) => `/v1/streamers/${uuid}/verify`,
  },

  // 일정
  SCHEDULES: {
    CREATE: "/v1/schedules",
    LIST_BY_STREAMER: "/v1/schedules/list/streamers",
    DETAIL: (uuid: string) => `/v1/schedules/${uuid}`,
    UPDATE: (uuid: string) => `/v1/schedules/${uuid}`,
    DELETE: (uuid: string) => `/v1/schedules/${uuid}`,
  },
};
