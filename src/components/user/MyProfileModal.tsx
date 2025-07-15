"use client";

import React, { useEffect } from "react";
import {
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Box,
  Portal,
} from "@chakra-ui/react";
import { useAuthStore } from "@/stores/auth.store";
import { useModalStore, MODAL_IDS } from "@/stores/modal.store";
import { useNotification } from "@/hooks/useNotifications";
import { FiX } from "react-icons/fi";
import { UserService } from "@/services/user.service";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  nicknameValidationSchema,
  NicknameFormData,
  nicknameUtils,
} from "@/utils/validations/nickname.validation";
import { useNicknameValidation } from "@/hooks/useNicknameValidation";

const MyProfileModal: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { isModalOpen, closeModal } = useModalStore();
  const { showSuccess, showError } = useNotification();

  const isOpen = isModalOpen(MODAL_IDS.MY_PROFILE);

  const form = useForm<NicknameFormData>({
    resolver: zodResolver(nicknameValidationSchema),
    mode: "onChange",
    defaultValues: {
      nickname: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = form;

  const { validationStatus } = useNicknameValidation(form);
  const nickname = watch("nickname");

  // 사용자 정보가 변경되거나 모달이 열릴 때 폼 초기화
  useEffect(() => {
    if (user && isOpen) {
      reset({
        nickname: user.nickname,
      });
    }
  }, [user, isOpen, reset]);

  // 사용자가 없으면 모달 닫기
  useEffect(() => {
    if (!user && isOpen) {
      handleClose();
    }
  }, [user, isOpen]);

  const handleClose = () => {
    closeModal(MODAL_IDS.MY_PROFILE);
  };

  const onSubmit = async (data: NicknameFormData) => {
    if (!user) return;

    // 변경사항 확인
    if (data.nickname === user.nickname) {
      showError({ title: "변경사항이 없습니다." });
      return;
    }

    try {
      const updatedUser = await UserService.updateProfile({
        nickname: data.nickname,
      });

      // store 업데이트
      updateUser({ ...updatedUser });

      showSuccess({ title: "프로필이 성공적으로 수정되었습니다." });
      handleClose();
    } catch (error) {
      console.error("프로필 수정 오류:", error);
      showError({
        title:
          error instanceof Error
            ? error.message
            : "프로필 수정에 실패했습니다.",
      });
    }
  };

  const handleCancel = () => {
    if (user) {
      reset({
        nickname: user.nickname,
      });
    }
    handleClose();
  };

  // 제출 버튼 비활성화 조건
  const isSubmitDisabled =
    !user ||
    isSubmitting ||
    !isValid ||
    !isDirty ||
    nickname === user?.nickname;

  if (!isOpen || !user) {
    return null;
  }

  return (
    <Portal>
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100vw"
        height="100vh"
        bg="rgba(0, 0, 0, 0.5)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex="1400"
      >
        <Box
          bg="primary.white"
          borderRadius="8px"
          boxShadow="0 10px 25px rgba(0, 0, 0, 0.15)"
          maxW="md"
          w="90%"
          maxH="90vh"
          overflowY="auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <Box p={6} pb={4} position="relative">
            <Text fontFamily="heading" fontSize="xl" fontWeight="600">
              프로필 수정
            </Text>
            <Button
              variant="ghost"
              size="sm"
              position="absolute"
              top="12px"
              right="12px"
              _hover={{ bg: "neutral.100" }}
              onClick={handleClose}
            >
              <FiX size={16} />
            </Button>
          </Box>

          {/* Body */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box px={6} py={4}>
              <VStack gap={4} align="stretch">
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="500"
                    color="neutral.700"
                    mb={2}
                  >
                    닉네임
                  </Text>
                  <Controller
                    name="nickname"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, 10);
                          field.onChange(value);
                        }}
                        onBlur={(e) => {
                          const formattedValue = nicknameUtils.formatNickname(
                            e.target.value,
                          );
                          field.onChange(formattedValue);
                          field.onBlur();
                        }}
                        placeholder="닉네임을 입력하세요"
                        fontFamily="body"
                        disabled={isSubmitting}
                        maxLength={10}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        borderColor={
                          errors.nickname
                            ? "red.500"
                            : validationStatus === "valid"
                              ? "green.500"
                              : "neutral.300"
                        }
                        _focus={{
                          borderColor: errors.nickname
                            ? "red.500"
                            : validationStatus === "valid"
                              ? "green.500"
                              : "primary.black",
                          boxShadow: errors.nickname
                            ? "0 0 0 1px var(--chakra-colors-red-500)"
                            : validationStatus === "valid"
                              ? "0 0 0 1px var(--chakra-colors-green-500)"
                              : "0 0 0 1px var(--chakra-colors-primary-black)",
                        }}
                      />
                    )}
                  />

                  {/* 에러 메시지 */}
                  {errors.nickname && (
                    <Text fontSize="xs" color="red.500" mt={1}>
                      {errors.nickname.message}
                    </Text>
                  )}

                  {/* 성공 메시지 */}
                  {validationStatus === "valid" &&
                    !errors.nickname &&
                    nickname !== user.nickname && (
                      <Text fontSize="xs" color="green.500" mt={1}>
                        ✓ 올바른 닉네임 형식입니다
                      </Text>
                    )}

                  {/* 도움말 텍스트 */}
                  {!errors.nickname && validationStatus !== "valid" && (
                    <Text fontSize="xs" color="neutral.500" mt={1}>
                      한글, 영문, 숫자, _, - 사용 가능 (2-10자)
                    </Text>
                  )}
                </Box>

                <Box>
                  <Text fontSize="xs" color="neutral.500" mb={2}>
                    기타 정보
                  </Text>
                  <VStack gap={2} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="neutral.600">
                        사용자 유형
                      </Text>
                      <Text fontSize="sm" color="neutral.800">
                        {user.role === "USER" ? "일반유저" : "관리자"}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="neutral.600">
                        가입일
                      </Text>
                      <Text fontSize="sm" color="neutral.800">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              </VStack>
            </Box>

            {/* Footer */}
            <Box p={6} pt={4}>
              <HStack gap={2} justify="flex-end">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  borderColor="neutral.300"
                  _hover={{ borderColor: "neutral.400", bg: "neutral.100" }}
                  fontFamily="body"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitDisabled}
                  bg="primary.black"
                  color="primary.white"
                  _hover={{ bg: "neutral.800" }}
                  _disabled={{
                    bg: "neutral.300",
                    color: "neutral.500",
                    cursor: "not-allowed",
                  }}
                  fontFamily="body"
                >
                  저장
                </Button>
              </HStack>
            </Box>
          </form>
        </Box>
      </Box>
    </Portal>
  );
};

export default MyProfileModal;
