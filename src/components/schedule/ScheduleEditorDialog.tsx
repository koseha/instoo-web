// src/components/schedule/ScheduleEditorDialog.tsx
"use client";

import {
  Dialog,
  Portal,
  Button,
  HStack,
  Text,
  Badge,
  CloseButton,
  Flex,
  Separator,
} from "@chakra-ui/react";
import { useScheduleDialogStore } from "@/stores/schedule-editor.store";
import { useState, useEffect } from "react";
import { useNotification } from "@/hooks/useNotifications";
import { ScheduleService } from "@/services/schedule.service";
import { ScheduleFormData } from "./types";
import ScheduleForm from "./ScheduleForm";
import { StreamerSimpleResponse } from "@/types/interfaces/streamer.interface";

function prepareSchedulePayload(dateStr: string, timeStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);

  const localDate = new Date(year, month - 1, day, hour, minute);
  const startAtUtc = localDate.toISOString();

  return {
    startAtUtc,
    scheduleDate: dateStr,
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
    externalNoticeUrl: "",
  });

  const [selectedStreamer, setSelectedStreamer] =
    useState<StreamerSimpleResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [isCheckingConflict, setIsCheckingConflict] = useState(false);

  // 모달이 열릴 때 데이터 초기화 또는 로드
  useEffect(() => {
    if (isScheduleModalOpen) {
      if (modalMode === "edit" && editingSchedule && editingSchedule.streamer) {
        setFormData({
          title: editingSchedule.title,
          scheduleDate: editingSchedule.scheduleDate || "",
          startTime: editingSchedule.startTime || "",
          status: editingSchedule.status,
          description: editingSchedule.description || "",
          streamerUuid: editingSchedule.streamer?.uuid || "",
          externalNoticeUrl: editingSchedule.externalNoticeUrl || "",
        });

        setSelectedStreamer({
          uuid: editingSchedule.streamer?.uuid,
          name: editingSchedule.streamer?.name,
          profileImageUrl:
            editingSchedule.streamer?.profileImageUrl || "/default-image.png",
          platforms: editingSchedule.streamer?.platforms,
          followCount: 0, // 이후 필요하면 값 넣기
          isFollowed: false, // 이후 필요하면 값 넣기
          isActive: true,
        });
      } else {
        resetForm();
      }

      setConflictError(null);
    }
  }, [isScheduleModalOpen, modalMode, editingSchedule]);

  const handleInputChange = (field: keyof ScheduleFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (modalMode === "edit" && conflictError) {
      setConflictError(null);
    }
  };

  const handleStatusChange = (value: "BREAK" | "TIME_TBD" | "SCHEDULED") => {
    setFormData((prev) => ({
      ...prev,
      status: value,
      startTime:
        value === "BREAK" || value === "TIME_TBD" ? "" : prev.startTime,
    }));
  };

  const handleStreamerSelect = (streamer: StreamerSimpleResponse) => {
    setSelectedStreamer(streamer);
    setFormData((prev) => ({ ...prev, streamerUuid: streamer.uuid }));
  };

  const handleChangeStreamer = () => {
    setSelectedStreamer(null);
    setFormData((prev) => ({ ...prev, streamerUuid: "" }));
  };

  const checkForConflicts = async () => {
    if (modalMode !== "edit" || !editingSchedule?.lastUpdatedAt) return true;

    setIsCheckingConflict(true);
    try {
      // TODO: 서버에서 최신 버전 확인
      return true;
    } catch (error) {
      console.error("충돌 확인 실패:", error);
      return false;
    } finally {
      setIsCheckingConflict(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      showWarning({ title: "일정 제목을 입력해주세요" });
      return;
    }

    if (!formData.streamerUuid) {
      showWarning({ title: "방송인을 선택해주세요" });
      return;
    }

    if (modalMode === "edit") {
      const noConflict = await checkForConflicts();
      if (!noConflict) return;
    }

    const skipTime =
      formData.status === "BREAK" || formData.status === "TIME_TBD";

    let startAtUtc: string | undefined = undefined;
    if (!skipTime) {
      const { scheduleDate, startTime } = formData;
      startAtUtc = prepareSchedulePayload(scheduleDate, startTime).startAtUtc;
    }

    const payload = {
      ...formData,
      ...(startAtUtc ? { startAtUtc } : {}),
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
          streamerUuid: _ui,
          scheduleDate: _sd,
          startAtUtc: _st,
          startTime: _none,
          ...restPayload
        } = {
          ...payload,
          lastUpdatedAt: editingSchedule!.lastUpdatedAt!,
        };

        const response = await ScheduleService.modifySchedule(
          editingSchedule!.uuid,
          { startTime: _st, ...restPayload },
        );

        console.log(response);
        showSuccess({ title: "일정이 성공적으로 수정되었습니다" });
      }

      closeScheduleModal();
    } catch (error) {
      console.log(error);
      if (
        error instanceof Error &&
        error.message === "해당 날짜에 이미 일정이 존재합니다."
      ) {
        showError({
          title: "앗! 누군가 먼저 등록했네요",
          message: "해당 날짜에 이미 일정이 존재합니다.",
        });
      } else if (
        error instanceof Error &&
        error.message === "다른 사용자가 이미 수정한 일정입니다."
      ) {
        showError({
          title: "앗! 누군가 먼저 수정했네요",
          message: "최신 내용을 확인하고 다시 수정해주세요",
        });
      } else {
        showError({ title: `일정 등록/수정에 실패했습니다` });
      }
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
      externalNoticeUrl: "",
    });
    setSelectedStreamer(null);
  };

  const handleClose = () => {
    if (isSubmitting) return;
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
                <Flex justify="space-between" align="center" gap={1}>
                  <Text>{getModalTitle()}</Text>
                  {modalMode === "edit" && (
                    <Badge variant="solid">편집 모드</Badge>
                  )}
                </Flex>
              </Dialog.Title>
              <Separator mt={4} borderColor="neutral.200" />
            </Dialog.Header>

            {/* Body */}
            <Dialog.Body p={6} pt={6}>
              <ScheduleForm
                formData={formData}
                selectedStreamer={selectedStreamer}
                modalMode={modalMode}
                conflictError={conflictError}
                onInputChange={handleInputChange}
                onStatusChange={handleStatusChange}
                onStreamerSelect={handleStreamerSelect}
                onChangeStreamer={handleChangeStreamer}
              />
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
