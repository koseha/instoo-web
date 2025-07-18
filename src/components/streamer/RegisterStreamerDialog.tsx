"use client";

import { useState, useMemo } from "react";
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
} from "@chakra-ui/react";
import { FaRegEdit } from "react-icons/fa";
import { Tooltip } from "../ui/tooltip";
import { LuTrash2 } from "react-icons/lu";
import apiClient from "@/lib/axios-api";
import { useNotification } from "@/hooks/useNotifications";

const PLATFORM_OPTIONS = [
  { label: "치지직", value: "chzzk" },
  { label: "youtube", value: "youtube" },
  { label: "숲", value: "soop" },
];

const RegisterStreamerDialog = () => {
  const { isAuthenticated } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);
  const [streamerName, setStreamerName] = useState("");
  const [description, setDescription] = useState("");
  const [platforms, setPlatforms] = useState([
    { platformName: "", channelUrl: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  // 다이얼로그 상태 초기화 함수
  const resetForm = () => {
    setStreamerName("");
    setDescription("");
    setPlatforms([{ platformName: "", channelUrl: "" }]);
  };

  // 다이얼로그 열림/닫힘 상태 변경 처리
  const handleOpenChange = (details: { open: boolean }) => {
    setIsOpen(details.open);
    if (!details.open) {
      resetForm();
    }
  };

  // 스트리머 등록 API 호출
  const handleSubmit = async () => {
    // 유효성 검사
    if (!streamerName.trim()) {
      alert("스트리머명을 입력해주세요.");
      return;
    }

    const validPlatforms = platforms.filter(
      (p) => p.platformName && p.channelUrl.trim(),
    );

    if (validPlatforms.length === 0) {
      alert("최소 하나의 플랫폼 정보를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post("/v1/streamers", {
        name: streamerName.trim(),
        description: description.trim(),
        platforms: validPlatforms,
      });

      const result = response.content;
      console.log("스트리머 등록 성공:", result);

      // 성공 시 다이얼로그 닫기
      setIsOpen(false);
      showSuccess({ title: "스트리머가 성공적으로 등록되었습니다!" });
    } catch (error) {
      console.error("스트리머 등록 실패:", error);
      showError({ title: "스트리머 등록에 실패하였습니다." });
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
    setPlatforms(updated);
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
        content="스트리머 등록은 로그인 후 이용할 수 있어요"
        positioning={{ placement: "left-end" }}
      >
        <Dialog.Trigger asChild>
          <Button size="xs" disabled={!isAuthenticated}>
            <Icon as={FaRegEdit} boxSize={3} color="gray.100" />
            스트리머 등록
          </Button>
        </Dialog.Trigger>
      </Tooltip>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>신규 스트리머 등록하기</Dialog.Title>
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
                    maxLength={20}
                  />
                </Field.Root>

                {/* 설명 */}
                <Field.Root>
                  <Field.Label>설명 (최대 100자)</Field.Label>
                  <Input
                    placeholder="예: 게임 방송을 주로 하는 스트리머입니다."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={100}
                  />
                </Field.Root>

                {/* 플랫폼 입력 필드 */}
                <Field.Root>
                  <Field.Label>플랫폼</Field.Label>

                  <Stack gap="2" width="100%">
                    {platforms.map((platform, index) => {
                      const availableFrameworks = getAvailableOptions(index);

                      return (
                        <Stack
                          key={index}
                          direction="row"
                          gap="2"
                          alignItems="center"
                        >
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
                            placeholder="채널 URL"
                            value={platform.channelUrl}
                            onChange={(e) =>
                              handleChangePlatform(
                                index,
                                "channelUrl",
                                e.target.value,
                              )
                            }
                            flex={1}
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
                loadingText="등록 중..."
              >
                등록
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

export default RegisterStreamerDialog;
