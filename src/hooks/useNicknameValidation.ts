// src/hooks/useNicknameValidation.ts
import {
  NicknameFormData,
  nicknameUtils,
} from "@/utils/validations/nickname.validation";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

export function useNicknameValidation(form: UseFormReturn<NicknameFormData>) {
  const [validationStatus, setValidationStatus] = useState<
    "valid" | "invalid" | null
  >(null);

  const nickname = form.watch("nickname");

  // 클라이언트 사이드 검증만 수행 (디바운스 적용)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (nickname && nickname.length >= 2) {
        const validation = nicknameUtils.validateNickname(nickname);
        setValidationStatus(validation.isValid ? "valid" : "invalid");
      } else {
        setValidationStatus(null);
      }
    }, 300); // 300ms 디바운스

    return () => clearTimeout(timer);
  }, [nickname]);

  // 폼 에러가 있을 때는 검증 상태 초기화
  useEffect(() => {
    if (form.formState.errors.nickname) {
      setValidationStatus("invalid");
    }
  }, [form.formState.errors.nickname]);

  return {
    validationStatus,
    isValid: validationStatus === "valid",
    isInvalid: validationStatus === "invalid",
  };
}
