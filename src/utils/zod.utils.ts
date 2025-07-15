// src/utils/zod.utils.ts
import { z } from "zod";

/**
 * Zod 검증 결과를 안전하게 처리하는 유틸리티 함수들
 */

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}

/**
 * Zod 스키마를 사용하여 데이터를 검증하고 결과를 반환
 */
export function validateWithZod<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  const firstError = result.error.issues[0];
  const fieldErrors: Record<string, string> = {};

  // 모든 에러를 필드별로 정리
  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    fieldErrors[path] = issue.message;
  });

  return {
    success: false,
    error: firstError?.message || "검증에 실패했습니다",
    errors: fieldErrors,
  };
}

/**
 * Zod 스키마를 사용하여 단일 필드를 검증
 */
export function validateField<T>(
  schema: z.ZodSchema<T>,
  fieldName: string,
  value: unknown,
): { isValid: boolean; error?: string } {
  // 객체 형태로 만들어서 검증
  const testData = { [fieldName]: value } as T;
  const result = schema.safeParse(testData);

  if (result.success) {
    return { isValid: true };
  }

  const fieldError = result.error.issues.find((issue) =>
    issue.path.includes(fieldName),
  );

  return {
    isValid: false,
    error: fieldError?.message || "검증에 실패했습니다",
  };
}

/**
 * ZodError를 React Hook Form에서 사용할 수 있는 형태로 변환
 */
export function zodErrorToFormErrors(
  error: z.ZodError,
): Record<string, { message: string }> {
  const formErrors: Record<string, { message: string }> = {};

  error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    formErrors[path] = { message: issue.message };
  });

  return formErrors;
}

/**
 * 안전한 Zod 파싱 (에러를 던지지 않음)
 */
export function safeParse<T>(schema: z.ZodSchema<T>, data: unknown) {
  return schema.safeParse(data);
}

/**
 * 조건부 검증 (특정 조건일 때만 검증)
 */
export function conditionalValidation<T>(
  condition: boolean,
  schema: z.ZodSchema<T>,
  data: unknown,
): ValidationResult<T | null> {
  if (!condition) {
    return { success: true, data: null };
  }
  return validateWithZod(schema, data);
}
