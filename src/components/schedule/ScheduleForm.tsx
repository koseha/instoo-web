// src/components/schedule/ScheduleForm.tsx
"use client";

import {
  VStack,
  Text,
  Input,
  Textarea,
  Grid,
  GridItem,
  Field,
  Alert,
  HStack,
  Separator,
  Stack,
} from "@chakra-ui/react";
import { PiWarningCircleBold } from "react-icons/pi";
import { ScheduleFormData } from "./types";
import SearchStreamer from "../sidebar/SearchStreamer";
import SelectedStreamerCard from "./SelectedStreamerCard";
import StatusSelector from "./StatusSelector";
import { StreamerSimpleResponse } from "@/types/interfaces/streamer.interface";
import { format } from "date-fns";

interface ScheduleFormProps {
  formData: ScheduleFormData;
  selectedStreamer: StreamerSimpleResponse | null;
  modalMode: "create" | "edit";
  conflictError: string | null;
  onInputChange: (field: keyof ScheduleFormData, value: string) => void;
  onStatusChange: (status: "BREAK" | "TIME_TBD" | "SCHEDULED") => void;
  onStreamerSelect: (streamer: StreamerSimpleResponse) => void;
  onChangeStreamer: () => void;
}

const ScheduleForm = ({
  formData,
  selectedStreamer,
  modalMode,
  conflictError,
  onInputChange,
  onStatusChange,
  onStreamerSelect,
  onChangeStreamer,
}: ScheduleFormProps) => {
  const today = format(new Date(), "yyyy-MM-dd");

  return (
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
          <Alert.Description color="neutral.600" fontSize="sm" lineHeight="1.5">
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
              modalMode === "edit" ? undefined : onChangeStreamer
            }
          />
        ) : (
          <SearchStreamer
            placeholder="일정을 등록할 스트리머를 선택해주세요"
            onSelect={onStreamerSelect}
          />
        )}
      </Field.Root>

      {/* 일정 제목 */}
      <Field.Root>
        <Field.Label>
          일정 제목 (30자)<Text color="red">*</Text>
        </Field.Label>
        <Input
          value={formData.title}
          onChange={(e) => onInputChange("title", e.target.value)}
          placeholder="방송 제목을 입력해주세요"
          h={12}
          max={30}
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
              min={today}
              onChange={(e) => onInputChange("scheduleDate", e.target.value)}
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
            {/* 시간 선택 */}
            <Input
              type="time"
              value={formData.startTime}
              onChange={(e) => onInputChange("startTime", e.target.value)}
              disabled={
                formData.status === "BREAK" || formData.status === "TIME_TBD"
              }
              bg={
                formData.status === "BREAK" || formData.status === "TIME_TBD"
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
        <StatusSelector
          selectedStatus={formData.status}
          onStatusChange={onStatusChange}
        />
      </Field.Root>

      {/* 외부 공지 URL */}
      <Field.Root>
        <Field.Label>외부 공지 URL (선택)</Field.Label>
        <Input
          value={formData.externalNoticeUrl}
          onChange={(e) => onInputChange("externalNoticeUrl", e.target.value)}
          placeholder="외부 공지 URL을 입력해주세요 (예: https://example.com)"
          type="url"
          h={12}
        />
      </Field.Root>

      {/* 설명 */}
      <Field.Root>
        <Field.Label>설명 (선택, 10줄)</Field.Label>
        <Textarea
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder="방송 내용이나 특별한 공지사항을 적어주세요"
          bg="primary.white"
          minH={20}
          maxH="10h"
        />
      </Field.Root>

      <Separator />
      <Stack gap={0}>
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
      </Stack>
    </VStack>
  );
};

export default ScheduleForm;
