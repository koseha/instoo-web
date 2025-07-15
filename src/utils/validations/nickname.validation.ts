// utils/validations/nickname.validations.ts
import { z } from "zod";

// 금지된 닉네임 목록
const FORBIDDEN_NICKNAMES = [
  "admin",
  "administrator",
  "root",
  "system",
  "guest",
  "운영자",
  "관리자",
  "시스템",
  "테스트",
  "test",
  "null",
  "undefined",
  "anonymous",
  "익명",
];

// 금지된 패턴들
const FORBIDDEN_PATTERNS = [
  /^admin/i,
  /운영자/,
  /관리자/,
  /^\d+$/, // 숫자만으로 구성
  /^[_-]+$/, // 특수문자만으로 구성
];

// 닉네임 검증 스키마
export const nicknameValidationSchema = z.object({
  nickname: z
    .string()
    .min(1, "닉네임을 입력해주세요")
    .min(2, "닉네임은 최소 2자 이상이어야 합니다")
    .max(10, "닉네임은 최대 10자까지 가능합니다")
    .regex(
      /^[가-힣a-zA-Z0-9_-]+$/,
      "닉네임은 한글, 영문, 숫자, _, - 만 사용 가능합니다",
    )
    .refine(
      (val) => val.trim().length > 0,
      "닉네임은 공백만으로 구성될 수 없습니다",
    )
    .refine(
      (val) => val.trim() === val,
      "닉네임 앞뒤로 공백이 있을 수 없습니다",
    )
    .refine(
      (val) => !FORBIDDEN_NICKNAMES.includes(val.toLowerCase()),
      "사용할 수 없는 닉네임입니다",
    )
    .refine(
      (val) => !FORBIDDEN_PATTERNS.some((pattern) => pattern.test(val)),
      "사용할 수 없는 닉네임 패턴입니다",
    ),
});

export type NicknameFormData = z.infer<typeof nicknameValidationSchema>;

// 닉네임 검증 유틸리티 함수들
export const nicknameUtils = {
  // 실시간 닉네임 검증 (safeParse 사용)
  validateNickname: (nickname: string) => {
    const result = nicknameValidationSchema.safeParse({ nickname });

    if (result.success) {
      return { isValid: true, error: null };
    }

    const firstError = result.error.issues[0];
    return {
      isValid: false,
      error: firstError?.message || "닉네임이 유효하지 않습니다",
    };
  },

  // 닉네임 길이 체크
  checkLength: (nickname: string) => {
    const length = nickname.length;
    return {
      current: length,
      max: 10, // 10자로 변경
      isNearLimit: length >= 8, // 8자부터 경고
      isOverLimit: length > 10, // 10자 초과시 오류
      remaining: 10 - length, // 10자 기준
    };
  },

  // 닉네임 안전성 체크
  checkSafety: (nickname: string) => {
    const issues = [];

    if (FORBIDDEN_NICKNAMES.includes(nickname.toLowerCase())) {
      issues.push("금지된 닉네임입니다");
    }

    FORBIDDEN_PATTERNS.forEach((pattern) => {
      if (pattern.test(nickname)) {
        issues.push("금지된 패턴이 포함되어 있습니다");
      }
    });

    if (/^\d+$/.test(nickname)) {
      issues.push("숫자만으로는 닉네임을 만들 수 없습니다");
    }

    if (/^[_-]+$/.test(nickname)) {
      issues.push("특수문자만으로는 닉네임을 만들 수 없습니다");
    }

    return {
      isSafe: issues.length === 0,
      issues,
    };
  },

  // 닉네임 포맷팅 (자동 수정)
  formatNickname: (nickname: string) => {
    return nickname
      .trim() // 앞뒤 공백 제거
      .replace(/\s+/g, "") // 모든 공백 제거
      .replace(/[^가-힣a-zA-Z0-9_-]/g, "") // 허용되지 않는 문자 제거
      .slice(0, 10); // 최대 10자로 제한
  },
};
