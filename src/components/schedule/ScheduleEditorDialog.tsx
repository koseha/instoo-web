// src/components/modals/ScheduleEditorDialog.tsx
"use client";

import {
  Dialog,
  Portal,
  Button,
  HStack,
  VStack,
  Text,
  Badge,
  CloseButton,
  Input,
  Textarea,
  Box,
  Grid,
  GridItem,
  Alert,
  Flex,
  Separator,
  AvatarRoot,
  AvatarImage,
  Field,
  Image,
} from "@chakra-ui/react";
import { useScheduleDialogStore } from "@/stores/schedule-editor.store";
import { useState, useEffect } from "react";
import { useNotification } from "@/hooks/useNotifications";
import SearchStreamer from "../sidebar/SearchStreamer";
import { StreamerSimpleResponse } from "@/services/streamer.service";
import { PiWarningCircleBold } from "react-icons/pi";
import { PLATFORM_ICON_MAP } from "@/constants/platform";
import { ScheduleService } from "@/services/schedule.service";

interface ScheduleFormData {
  title: string;
  scheduleDate: string;
  startTime: string;
  status: "BREAK" | "TIME_TBD" | "SCHEDULED";
  description?: string;
  streamerUuid: string;
}

// 선택된 방송인 카드 컴포넌트
const SelectedStreamerCard = ({
  streamer,
  onChangeStreamer,
}: {
  streamer: StreamerSimpleResponse;
  onChangeStreamer?: () => void;
}) => {
  return (
    <Box
      bg="neutral.100"
      // bg="primary.white"
      border="2px solid"
      borderColor="neutral.200"
      borderRadius="lg"
      w="full"
      p={3}
      h={16}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <HStack gap={3}>
        <AvatarRoot size="lg">
          {/* <AvatarImage src="/default-image.png" /> */}
          <AvatarImage src="https://bit.ly/naruto-sage" />
        </AvatarRoot>
        <HStack gap={2}>
          <Text fontSize="sm" fontWeight="500" color="primary.black">
            {streamer.name}
          </Text>
          <HStack gap={1}>
            {streamer.platforms.map((p) => (
              <Image
                key={p.channelUrl}
                w={4}
                h={4}
                src={PLATFORM_ICON_MAP[p.platformName]}
                alt={`${p.platformName} icon`}
              />
            ))}
          </HStack>
        </HStack>
      </HStack>
      {onChangeStreamer && (
        <Button
          size="xs"
          variant="surface"
          onClick={onChangeStreamer}
          colorPalette="gray"
        >
          change
        </Button>
      )}
    </Box>
  );
};

function prepareSchedulePayload(dateStr: string, timeStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);

  const localDate = new Date(year, month - 1, day, hour, minute); // 로컬 Date
  const startAtUtc = localDate.toISOString(); // UTC ISO

  return {
    startAtUtc, // 예: "2025-07-21T05:30:00.000Z"
    scheduleDate: dateStr, // 예: "2025-07-21"
  };
}

const ScheduleEditorDialog = () => {
  const {
    isScheduleModalOpen,
    modalMode,
    editingSchedule,
    closeScheduleModal,
  } = useScheduleDialogStore();

  const { showSuccess, showError, showWarning } = useNotification();

  const [formData, setFormData] = useState<ScheduleFormData>({
    title: "",
    scheduleDate: "",
    startTime: "",
    status: "SCHEDULED",
    description: "",
    streamerUuid: "",
  });

  const [selectedStreamer, setSelectedStreamer] =
    useState<StreamerSimpleResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [isCheckingConflict, setIsCheckingConflict] = useState(false);

  // 모달이 열릴 때 데이터 초기화 또는 로드
  useEffect(() => {
    if (isScheduleModalOpen) {
      if (modalMode === "edit" && editingSchedule) {
        // 편집 모드: 기존 데이터로 폼 채우기
        setFormData({
          title: editingSchedule.title,
          scheduleDate: editingSchedule.scheduleDate || "",
          startTime: editingSchedule.startTime || "",
          status: editingSchedule.status,
          description: editingSchedule.description || "",
          streamerUuid: editingSchedule.streamerUuid || "",
        });
      } else {
        // 생성 모드: 폼 초기화
        resetForm();
      }

      // 방송인 목록 로드
      setConflictError(null);
    }
  }, [isScheduleModalOpen, modalMode, editingSchedule]);

  const handleInputChange = (field: keyof ScheduleFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // 수정 모드에서 충돌 에러가 있었다면 입력 시 초기화
    if (modalMode === "edit" && conflictError) {
      setConflictError(null);
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as "BREAK" | "TIME_TBD" | "SCHEDULED",
      // 휴방이나 시간 미정일 때는 시간을 초기화
      startTime:
        value === "BREAK" || value === "TIME_TBD" ? "" : prev.startTime,
    }));
  };

  // 방송인 선택 핸들러
  const handleStreamerSelect = (streamer: StreamerSimpleResponse) => {
    setSelectedStreamer(streamer);
    setFormData((prev) => ({ ...prev, streamerUuid: streamer.uuid }));
  };

  // 방송인 변경 핸들러
  const handleChangeStreamer = () => {
    setSelectedStreamer(null);
    setFormData((prev) => ({ ...prev, streamerUuid: "" }));
  };

  // 충돌 감지 함수 (편집 모드 전용)
  const checkForConflicts = async () => {
    if (modalMode !== "edit" || !editingSchedule?.lastUpdatedAt) return true;

    setIsCheckingConflict(true);
    try {
      // TODO: 서버에서 최신 버전 확인
      // const response = await getScheduleById(editingSchedule.id);
      // const latestSchedule = response.data;

      // 타임스탬프 비교로 충돌 감지
      // if (latestSchedule.lastUpdatedAt !== editingSchedule.lastUpdatedAt) {
      //   setConflictError(
      //     `이 일정이 다른 사용자에 의해 수정되었습니다.
      //      최신 버전을 확인하고 다시 시도해주세요.`
      //   );
      //   return false;
      // }

      return true;
    } catch (error) {
      console.error("충돌 확인 실패:", error);
      return false;
    } finally {
      setIsCheckingConflict(false);
    }
  };

  const handleSubmit = async () => {
    // 기본 검증
    if (!formData.title.trim()) {
      showWarning({ title: "일정 제목을 입력해주세요" });
      return;
    }

    if (!formData.streamerUuid) {
      showWarning({ title: "방송인을 선택해주세요" });
      return;
    }

    // 편집 모드에서 충돌 확인
    if (modalMode === "edit") {
      const noConflict = await checkForConflicts();
      if (!noConflict) return;
    }

    // BREAK, TIME_TBD 상태면 startTime 무시
    const skipTime =
      formData.status === "BREAK" || formData.status === "TIME_TBD";

    // time이 필요할 때만 UTC 변환
    let startAtUtc: string | undefined = undefined;
    if (!skipTime) {
      const { scheduleDate, startTime } = formData;
      startAtUtc = prepareSchedulePayload(scheduleDate, startTime).startAtUtc;
    }

    // payload 준비
    const payload = {
      ...formData,
      ...(startAtUtc ? { startAtUtc } : {}), // startAtUtc가 있을 때만 포함
    };

    setIsSubmitting(true);
    try {
      if (modalMode === "create") {
        if (!skipTime) {
          formData.startTime = startAtUtc!;
        }
        const response = await ScheduleService.createNewSchedule(formData);

        console.log(response);
        showSuccess({ title: "일정이 성공적으로 등록되었습니다" });
      } else {
        const {
          streamerUuid,
          scheduleDate: _sd,
          startTime: _st,
          ...restPayload
        } = {
          ...payload,
          lastUpdatedAt: editingSchedule!.lastUpdatedAt!,
        };

        const response = await ScheduleService.modifySchedule(
          streamerUuid,
          restPayload,
        );

        console.log(response);
        showSuccess({ title: "일정이 성공적으로 수정되었습니다" });
      }

      closeScheduleModal();

      // TODO: 부모 컴포넌트에 변경 사항 알림 (리프레시 등)
      // onScheduleChange?.();
    } catch (error) {
      console.log(error);
      showError({ title: `일정 등록/수정에 실패했습니다` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      scheduleDate: "",
      startTime: "",
      status: "SCHEDULED",
      description: "",
      streamerUuid: "",
    });
    setSelectedStreamer(null);
  };

  const handleClose = () => {
    if (isSubmitting) return; // 제출 중일 때는 닫기 방지
    closeScheduleModal();
  };

  const getModalTitle = () => {
    return modalMode === "create" ? "새 일정 등록" : "일정 수정";
  };

  const getSubmitButtonText = () => {
    if (isSubmitting) {
      return modalMode === "create" ? "등록 중..." : "수정 중...";
    }
    return modalMode === "create" ? "등록하기" : "수정하기";
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "예정";
      case "BREAK":
        return "휴방";
      case "TIME_TBD":
        return "시간 미정";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "accent.live";
      case "BREAK":
        return "accent.break";
      case "TIME_TBD":
        return "accent.timeTbd";
      default:
        return "neutral.400";
    }
  };

  return (
    <Dialog.Root
      lazyMount
      open={isScheduleModalOpen}
      onOpenChange={(e) => !e.open && handleClose()}
      placement="center"
      role="alertdialog"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="lg"
            mx={4}
            bg="primary.white"
            borderRadius="xl"
            boxShadow="2xl"
            border="1px solid"
            borderColor="neutral.200"
          >
            {/* Header */}
            <Dialog.Header p={6} pb={0}>
              <Dialog.Title>
                <Flex justify="space-between" align="center">
                  <Text>{getModalTitle()}</Text>
                  {modalMode === "edit" && (
                    <Badge
                      bg="primary.black"
                      color="primary.white"
                      px={2}
                      py={1}
                      borderRadius="sm"
                      fontSize="xs"
                      fontWeight="500"
                      letterSpacing="0.5px"
                    >
                      편집 모드
                    </Badge>
                  )}
                </Flex>
              </Dialog.Title>
              <Separator mt={4} borderColor="neutral.200" />
            </Dialog.Header>

            {/* Body */}
            <Dialog.Body p={6} pt={6}>
              <VStack align="stretch" gap={5}>
                {/* 충돌 알림 (편집 모드에서만 표시) */}
                {conflictError && (
                  <Alert.Root
                    status="warning"
                    bg="neutral.100"
                    border="2px solid"
                    borderColor="neutral.300"
                    borderRadius="lg"
                  >
                    <Alert.Description
                      color="neutral.600"
                      fontSize="sm"
                      lineHeight="1.5"
                    >
                      {conflictError}
                    </Alert.Description>
                  </Alert.Root>
                )}

                {/* 방송인 선택 */}
                <Field.Root>
                  <Field.Label>
                    스트리머 <Text color="red">*</Text>
                    {modalMode === "edit" && (
                      <Text as="span" color="neutral.500" fontSize="xs" ml={2}>
                        (수정 불가)
                      </Text>
                    )}
                  </Field.Label>
                  {selectedStreamer ? (
                    <SelectedStreamerCard
                      streamer={selectedStreamer}
                      onChangeStreamer={
                        modalMode === "edit" ? undefined : handleChangeStreamer
                      }
                    />
                  ) : (
                    <SearchStreamer
                      placeholder="일정을 등록할 스트리머를 선택해주세요"
                      onSelect={handleStreamerSelect}
                    />
                  )}
                </Field.Root>

                {/* 일정 제목 */}
                <Field.Root>
                  <Field.Label>
                    일정 제목 <Text color="red">*</Text>
                  </Field.Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="방송 제목을 입력해주세요"
                    h={12}
                  />
                </Field.Root>

                {/* 날짜 및 시간 */}
                <Field.Root>
                  <Field.Label>
                    날짜 및 시간 <Text color="red">*</Text>
                    {modalMode === "edit" && (
                      <Text as="span" color="neutral.500" fontSize="xs" ml={2}>
                        (날짜 수정 불가)
                      </Text>
                    )}
                  </Field.Label>
                  <Grid templateColumns="1fr 1fr" gap={4} w="full">
                    <GridItem>
                      <Input
                        type="date"
                        value={formData.scheduleDate}
                        onChange={(e) =>
                          handleInputChange("scheduleDate", e.target.value)
                        }
                        disabled={modalMode === "edit"}
                        _focus={{
                          borderColor: "primary.black",
                          boxShadow: "0 0 0 3px rgba(0, 0, 0, 0.1)",
                        }}
                        _disabled={{
                          opacity: 0.6,
                          cursor: "not-allowed",
                          bg: "neutral.100",
                          color: "neutral.400",
                        }}
                        h={12}
                      />
                    </GridItem>
                    <GridItem>
                      <Input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) =>
                          handleInputChange("startTime", e.target.value)
                        }
                        disabled={
                          formData.status === "BREAK" ||
                          formData.status === "TIME_TBD"
                        }
                        bg={
                          formData.status === "BREAK" ||
                          formData.status === "TIME_TBD"
                            ? "neutral.100"
                            : "primary.white"
                        }
                        _disabled={{
                          opacity: 0.6,
                          cursor: "not-allowed",
                          bg: "neutral.100",
                          color: "neutral.400",
                        }}
                        h={12}
                      />
                    </GridItem>
                  </Grid>
                </Field.Root>

                {/* 방송 상태 */}
                <Field.Root>
                  <Field.Label>
                    방송 상태 <Text color="red">*</Text>
                  </Field.Label>
                  <Grid templateColumns="repeat(3, 1fr)" gap={2} w="full">
                    {["SCHEDULED", "BREAK", "TIME_TBD"].map((status) => (
                      <Button
                        key={status}
                        variant={
                          formData.status === status ? "solid" : "outline"
                        }
                        bg={
                          formData.status === status
                            ? getStatusColor(status)
                            : "primary.white"
                        }
                        color={
                          formData.status === status
                            ? "primary.white"
                            : "neutral.700"
                        }
                        _hover={{
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                        onClick={() => handleStatusChange(status)}
                        fontSize="sm"
                        fontWeight="500"
                        h={10}
                      >
                        {getStatusLabel(status)}
                      </Button>
                    ))}
                  </Grid>
                </Field.Root>

                {/* 설명 */}
                <Field.Root>
                  <Field.Label>설명 (선택)</Field.Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="방송 내용이나 특별한 공지사항을 적어주세요"
                    bg="primary.white"
                    minH={20}
                  />
                </Field.Root>
              </VStack>
              <Separator mt={4} mb={2} />
              <HStack fontSize="xs" color="neutral.500" gap={1}>
                <PiWarningCircleBold />
                대략적인 일정을 작성하여 공유해 주세요!
              </HStack>
              <HStack fontSize="xs" color="neutral.500" gap={1}>
                <PiWarningCircleBold color="red" />
                창을 닫으면 내용이 초기화됩니다
              </HStack>
              <HStack fontSize="xs" color="neutral.500" gap={1}>
                <PiWarningCircleBold color="red" />
                스트리머, 날짜는 등록 후 수정이 불가능합니다
              </HStack>
            </Dialog.Body>

            {/* Footer */}
            <Dialog.Footer p={6} pt={0}>
              <HStack gap={3} justify="flex-end" w="full">
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={isSubmitting}
                    size="sm"
                    fontSize="sm"
                    fontWeight="500"
                  >
                    취소
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  onClick={handleSubmit}
                  loading={isSubmitting || isCheckingConflict}
                  loadingText={getSubmitButtonText()}
                  disabled={!!conflictError}
                  fontWeight="500"
                  size="sm"
                >
                  {getSubmitButtonText()}
                </Button>
              </HStack>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                position="absolute"
                top={4}
                right={4}
                color="neutral.500"
                _hover={{ bg: "neutral.100", color: "primary.black" }}
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ScheduleEditorDialog;
