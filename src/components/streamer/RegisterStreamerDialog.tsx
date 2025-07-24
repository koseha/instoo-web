"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Icon,
  Input,
  Portal,
  Stack,
  Text,
  Select,
  createListCollection,
  IconButton,
  Separator,
  HStack,
} from "@chakra-ui/react";
import { FaRegEdit } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import { Tooltip } from "../ui/tooltip";
import { LuTrash2 } from "react-icons/lu";
import { useNotification } from "@/hooks/useNotifications";
import { StreamerService } from "@/services/streamer.service";
import { PiWarningCircleBold } from "react-icons/pi";
import { AxiosError } from "axios";

const PLATFORM_OPTIONS = [
  { label: "치지직", value: "chzzk" },
  { label: "youtube", value: "youtube" },
  { label: "숲", value: "soop" },
];

// 플랫폼별 URL 유효성 검증 함수
const validatePlatformUrl = (platform: string, url: string): boolean => {
  if (!url.trim()) return false;

  switch (platform) {
    case "chzzk":
      return url.startsWith("https://chzzk.naver.com/");
    case "youtube":
      return url.startsWith("https://www.youtube.com/");
    case "soop":
      return (
        url.startsWith("https://play.sooplive.co.kr/") ||
        url.startsWith("https://ch.sooplive.co.kr/")
      );
    default:
      return false;
  }
};

// 플랫폼별 URL 예시 반환 함수
const getPlatformUrlExample = (platform: string): string => {
  switch (platform) {
    case "chzzk":
      return "https://chzzk.naver.com/";
    case "youtube":
      return "https://www.youtube.com/";
    case "soop":
      return "https://play.sooplive.co.kr/";
    default:
      return "";
  }
};

export interface StreamerRegisterData {
  uuid?: string;
  name: string;
  description: string;
  platforms: Array<{
    platformName: string;
    channelUrl: string;
  }>;
  lastUpdatedAt?: string;
}

interface StreamerDialogProps {
  mode: "create" | "edit";
  streamerData?: StreamerRegisterData;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const StreamerDialog = ({
  mode,
  streamerData,
  trigger,
  onSuccess,
}: StreamerDialogProps) => {
  const { isAuthenticated } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);
  const [streamerName, setStreamerName] = useState("");
  const [description, setDescription] = useState("");
  const [platforms, setPlatforms] = useState([
    { platformName: "", channelUrl: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError, showWarning } = useNotification();

  // 수정 모드일 때 기존 데이터로 초기화
  useEffect(() => {
    if (mode === "edit" && streamerData) {
      setStreamerName(streamerData.name);
      setDescription(streamerData.description);
      setPlatforms(
        streamerData.platforms.length > 0
          ? streamerData.platforms
          : [{ platformName: "", channelUrl: "" }],
      );
    }
  }, [mode, streamerData]);

  // 다이얼로그 상태 초기화 함수
  const resetForm = () => {
    if (mode === "create") {
      setStreamerName("");
      setDescription("");
      setPlatforms([{ platformName: "", channelUrl: "" }]);
    } else if (mode === "edit" && streamerData) {
      // 수정 모드에서는 원본 데이터로 되돌리기
      setStreamerName(streamerData.name);
      setDescription(streamerData.description);
      setPlatforms(
        streamerData.platforms.length > 0
          ? streamerData.platforms
          : [{ platformName: "", channelUrl: "" }],
      );
    }
  };

  // 다이얼로그 열림/닫힘 상태 변경 처리
  const handleOpenChange = (details: { open: boolean }) => {
    setIsOpen(details.open);
    if (!details.open) {
      resetForm();
    }
  };

  // 스트리머 등록/수정 API 호출
  const handleSubmit = async () => {
    // 유효성 검사
    if (!streamerName.trim()) {
      showWarning({ title: "스트리머명을 입력해주세요" });
      return;
    }

    if (!description.trim()) {
      showWarning({ title: "간단한 소개를 입력해주세요" });
      return;
    }

    const validPlatforms = platforms.filter(
      (p) => p.platformName && p.channelUrl.trim(),
    );

    if (validPlatforms.length === 0) {
      showWarning({ title: "최소 하나의 플랫폼 정보를 입력해주세요" });
      return;
    }

    // URL 유효성 검증
    const invalidPlatforms = validPlatforms.filter(
      (p) => !validatePlatformUrl(p.platformName, p.channelUrl),
    );

    if (invalidPlatforms.length > 0) {
      showWarning({
        title: `올바르지 않은 플랫폼 URL이 있습니다. 다시 확인해주세요`,
      });
      return;
    }

    // 수정 모드에서 변경사항 확인
    if (mode === "edit" && streamerData) {
      const isNameChanged = streamerName !== streamerData.name;
      const isDescriptionChanged = description !== streamerData.description;

      // 플랫폼 배열 비교 (순서와 내용 모두 확인)
      const isPlatformsChanged =
        validPlatforms.length !== streamerData.platforms.length ||
        validPlatforms.some((platform, index) => {
          const originalPlatform = streamerData.platforms[index];
          return (
            !originalPlatform ||
            platform.platformName !== originalPlatform.platformName ||
            platform.channelUrl !== originalPlatform.channelUrl
          );
        });

      // 변경사항이 없으면 경고 메시지 표시
      if (!isNameChanged && !isDescriptionChanged && !isPlatformsChanged) {
        showWarning({ title: "변경 내용이 없습니다." });
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === "create") {
        await StreamerService.registerNewStreamer({
          name: streamerName,
          description,
          platforms: validPlatforms,
        });
        showSuccess({ title: "스트리머가 성공적으로 등록되었습니다!" });
      } else {
        await StreamerService.modifyStreamer({
          uuid: streamerData?.uuid,
          name: streamerName,
          description,
          platforms: validPlatforms,
          lastUpdatedAt: streamerData?.lastUpdatedAt,
        });
        showSuccess({ title: "스트리머 정보가 성공적으로 수정되었습니다!" });
      }

      // 성공 시 다이얼로그 닫기
      setIsOpen(false);
      onSuccess?.();
    } catch (error: unknown) {
      console.error(
        `스트리머 ${mode === "create" ? "등록" : "수정"} 실패:`,
        error,
      );
      if (
        error instanceof Error &&
        error.message === "방송인 수정 중 충돌이 발생했습니다."
      ) {
        showError({
          title: "앗! 누군가 먼저 수정했네요",
          message: "최신 내용을 확인하고 다시 수정해주세요",
        });
      } else {
        showError({
          title: `스트리머 ${mode === "create" ? "등록" : "수정"}에 실패하였습니다.`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 각 플랫폼 인덱스별로 사용 가능한 옵션 계산
  const getAvailableOptions = useMemo(() => {
    return (currentIndex: number) => {
      const selectedPlatforms = platforms
        .map((p, idx) => (idx !== currentIndex ? p.platformName : null))
        .filter(Boolean);

      const availableOptions = PLATFORM_OPTIONS.filter(
        (option) => !selectedPlatforms.includes(option.value),
      );

      return createListCollection({
        items: availableOptions,
      });
    };
  }, [platforms]);

  const handleAddPlatform = () => {
    if (platforms.length >= PLATFORM_OPTIONS.length) return;
    setPlatforms([...platforms, { platformName: "", channelUrl: "" }]);
  };

  const handleRemovePlatform = (index: number) => {
    setPlatforms(platforms.filter((_, i) => i !== index));
  };

  const handleChangePlatform = (
    index: number,
    field: "platformName" | "channelUrl",
    value: string,
  ) => {
    const updated = [...platforms];
    updated[index][field] = value;

    // 플랫폼이 변경되면 URL을 초기화
    if (field === "platformName") {
      updated[index].channelUrl = "";
    }

    setPlatforms(updated);
  };

  // URL 유효성 검사 결과 확인
  const isUrlValid = (platform: string, url: string): boolean => {
    if (!platform || !url.trim()) return true; // 빈 값은 유효한 것으로 처리
    return validatePlatformUrl(platform, url);
  };
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      role="alertdialog"
      placement="center"
    >
      <Tooltip
        disabled={isAuthenticated}
        content={`스트리머 ${mode === "create" ? "등록" : "수정"}은 로그인 후 이용할 수 있어요`}
        positioning={{ placement: "left-end" }}
        openDelay={100}
        closeDelay={100}
      >
        <Dialog.Trigger asChild>
          {mode === "create" ? (
            <Button size="xs" disabled={!isAuthenticated}>
              <Icon as={FaRegEdit} boxSize={3} color="gray.100" />
              스트리머 등록
            </Button>
          ) : (
            <IconButton
              variant="ghost"
              size="xs"
              p={0}
              aria-label="스트리머 정보 수정"
              disabled={!isAuthenticated}
            >
              <BiEdit />
            </IconButton>
          )}
        </Dialog.Trigger>
      </Tooltip>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {mode === "create"
                  ? "신규 스트리머 등록하기"
                  : "스트리머 정보 수정하기"}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Stack gap="4">
                {/* 스트리머명 */}
                <Field.Root>
                  <Field.Label>
                    스트리머명 <Text color="red">*</Text>
                  </Field.Label>
                  <Input
                    placeholder="스트리머 이름을 입력하세요"
                    value={streamerName}
                    onChange={(e) => setStreamerName(e.target.value)}
                    required
                    maxLength={30}
                  />
                </Field.Root>

                {/* 설명 */}
                <Field.Root>
                  <Field.Label>
                    간단 소개 (최대 100자) <Text color="red">*</Text>
                  </Field.Label>
                  <Input
                    placeholder="예: 게임 방송을 주로 하는 스트리머입니다."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={100}
                  />
                </Field.Root>

                {/* 플랫폼 입력 필드 */}
                <Field.Root>
                  <Field.Label>
                    플랫폼<Text color="red">*</Text>
                  </Field.Label>

                  <Stack gap="2" width="100%">
                    {platforms.map((platform, index) => {
                      const availableFrameworks = getAvailableOptions(index);
                      const urlValid = isUrlValid(
                        platform.platformName,
                        platform.channelUrl,
                      );

                      return (
                        <Stack key={index} gap="2">
                          <Stack direction="row" gap="2" alignItems="center">
                            <Select.Root
                              collection={availableFrameworks}
                              size="sm"
                              width="120px"
                              value={[platform.platformName]}
                              onValueChange={(details) =>
                                handleChangePlatform(
                                  index,
                                  "platformName",
                                  details.value[0] || "",
                                )
                              }
                            >
                              <Select.HiddenSelect />
                              <Select.Control>
                                <Select.Trigger>
                                  <Select.ValueText placeholder="플랫폼" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                  <Select.Indicator />
                                </Select.IndicatorGroup>
                              </Select.Control>
                              <Portal>
                                <Select.Positioner>
                                  <Select.Content style={{ zIndex: 1500 }}>
                                    {availableFrameworks.items.map(
                                      (framework) => (
                                        <Select.Item
                                          item={framework}
                                          key={framework.value}
                                        >
                                          {framework.label}
                                          <Select.ItemIndicator />
                                        </Select.Item>
                                      ),
                                    )}
                                  </Select.Content>
                                </Select.Positioner>
                              </Portal>
                            </Select.Root>

                            <Input
                              placeholder={
                                platform.platformName
                                  ? getPlatformUrlExample(platform.platformName)
                                  : "채널 URL"
                              }
                              value={platform.channelUrl}
                              onChange={(e) =>
                                handleChangePlatform(
                                  index,
                                  "channelUrl",
                                  e.target.value,
                                )
                              }
                              flex={1}
                              borderColor={
                                platform.channelUrl.trim() && !urlValid
                                  ? "red.500"
                                  : undefined
                              }
                              _focus={{
                                borderColor:
                                  platform.channelUrl.trim() && !urlValid
                                    ? "red.500"
                                    : "blue.500",
                              }}
                            />
                            {platforms.length > 1 && (
                              <Button
                                size="2xs"
                                variant="ghost"
                                colorPalette="red"
                                onClick={() => handleRemovePlatform(index)}
                              >
                                <LuTrash2 />
                              </Button>
                            )}
                          </Stack>

                          {/* URL 유효성 검증 오류 메시지 */}
                          {platform.channelUrl.trim() && !urlValid && (
                            <Text color="red.500" fontSize="sm">
                              올바른{" "}
                              {PLATFORM_OPTIONS.find(
                                (p) => p.value === platform.platformName,
                              )?.label || "플랫폼"}{" "}
                              URL을 입력해주세요. 예:{" "}
                              {getPlatformUrlExample(platform.platformName)}
                            </Text>
                          )}
                        </Stack>
                      );
                    })}

                    {/* 플랫폼 추가 버튼 */}
                    {platforms.length < PLATFORM_OPTIONS.length && (
                      <Button
                        onClick={handleAddPlatform}
                        size="xs"
                        variant="outline"
                      >
                        플랫폼 추가
                      </Button>
                    )}
                  </Stack>
                </Field.Root>
              </Stack>
              {mode === "edit" && (
                <>
                  <Separator mt={3} mb={1} />
                  <Stack gap={0}>
                    <HStack fontSize="xs" color="neutral.500" gap={1}>
                      <PiWarningCircleBold color="red" />
                      수정 시 관리자에게 인증 요청이 다시 보내집니다.
                    </HStack>
                  </Stack>
                </>
              )}
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" size="sm" disabled={isLoading}>
                  취소
                </Button>
              </Dialog.ActionTrigger>
              <Button
                size="sm"
                onClick={handleSubmit}
                loading={isLoading}
                loadingText={`${mode === "create" ? "등록" : "수정"} 중...`}
              >
                {mode === "create" ? "등록" : "수정"}
              </Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default StreamerDialog;
