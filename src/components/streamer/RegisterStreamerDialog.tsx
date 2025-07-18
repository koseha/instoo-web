"use client";

import { useState } from "react";
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

const PLATFORM_OPTIONS = [
  { label: "치지직", value: "chzzk" },
  { label: "youtube", value: "youtube" },
  { label: "숲", value: "soop" },
];

const RegisterStreamerDialog = () => {
  const { isAuthenticated } = useAuthStore();

  const frameworks = createListCollection({
    items: PLATFORM_OPTIONS,
  });

  const [platforms, setPlatforms] = useState([
    { platformName: "", channelUrl: "" },
  ]);

  const handleAddPlatform = () => {
    if (platforms.length >= 10) return;
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
    <Dialog.Root role="alertdialog" placement="center">
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
                    required
                    maxLength={20}
                  />
                </Field.Root>

                {/* 설명 */}
                <Field.Root>
                  <Field.Label>설명 (최대 100자)</Field.Label>
                  <Input
                    placeholder="예: 게임 방송을 주로 하는 스트리머입니다."
                    maxLength={100}
                  />
                </Field.Root>

                {/* 플랫폼 입력 필드 */}
                <Field.Root>
                  <Field.Label>플랫폼</Field.Label>

                  <Stack gap="2" width="100%">
                    {platforms.map((platform, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        gap="2"
                        alignItems="center"
                      >
                        <Select.Root
                          collection={frameworks}
                          size="sm"
                          width="200px"
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
                                {frameworks.items.map((framework) => (
                                  <Select.Item
                                    item={framework}
                                    key={framework.value}
                                  >
                                    {framework.label}
                                    <Select.ItemIndicator />
                                  </Select.Item>
                                ))}
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
                          // flex={1}
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
                    ))}

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
                <Button variant="outline" size="sm">
                  취소
                </Button>
              </Dialog.ActionTrigger>
              <Button size="sm">등록</Button>
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
