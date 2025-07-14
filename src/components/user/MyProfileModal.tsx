"use client";

import React, { useEffect, useState } from "react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogBackdrop,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Box,
  Portal,
} from "@chakra-ui/react";
import { User } from "@/stores/auth.store";
import { useAuthStore } from "@/stores/auth.store";
import { useNotification } from "@/hooks/useNotifications";
import { FiX } from "react-icons/fi";
import { UserService } from "@/services/user.service";

interface MyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyProfileModal: React.FC<MyProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuthStore();
  const { showSuccess, showError } = useNotification();

  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname);
    }
  }, [user]);

  if (!user) {
    onClose();
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      showError({ title: "닉네임을 입력해주세요." });
      return;
    }

    if (nickname.trim() === user.nickname) {
      showError({ title: "변경사항이 없습니다." });
      return;
    }

    setIsLoading(true);

    try {
      const updatedUser: User = await UserService.updateProfile({
        nickname: nickname.trim(),
      });

      // 임시로 store 업데이트
      updateUser({ ...updatedUser });

      showSuccess({ title: "프로필이 성공적으로 수정되었습니다." });
      onClose();
    } catch (error) {
      console.error("프로필 수정 오류:", error);
      showError({
        title:
          error instanceof Error
            ? error.message
            : "프로필 수정에 실패했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNickname(user.nickname); // 원래 값으로 초기화
    onClose();
  };

  return (
    <Portal>
      <DialogRoot
        open={isOpen}
        role="alertdialog"
        onOpenChange={({ open }) => !open && onClose()}
      >
        <DialogBackdrop />
        <DialogContent maxW="md">
          <DialogHeader>
            <DialogTitle fontFamily="heading" fontSize="xl" fontWeight="600">
              프로필 수정
            </DialogTitle>
            <DialogCloseTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                position="absolute"
                top="12px"
                right="12px"
                _hover={{ bg: "neutral.100" }}
              >
                <FiX size={16} />
              </Button>
            </DialogCloseTrigger>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <DialogBody>
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
                  <Input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임을 입력하세요"
                    fontFamily="body"
                    disabled={isLoading}
                    _focus={{
                      borderColor: "primary.black",
                      boxShadow: "0 0 0 1px var(--chakra-colors-primary-black)",
                    }}
                  />
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
            </DialogBody>

            <DialogFooter>
              <HStack gap={2}>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  borderColor="neutral.300"
                  _hover={{ borderColor: "neutral.400", bg: "neutral.100" }}
                  fontFamily="body"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  loading={isLoading}
                  bg="primary.black"
                  color="primary.white"
                  _hover={{ bg: "neutral.800" }}
                  fontFamily="body"
                >
                  저장
                </Button>
              </HStack>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogRoot>
    </Portal>
  );
};

export default MyProfileModal;
