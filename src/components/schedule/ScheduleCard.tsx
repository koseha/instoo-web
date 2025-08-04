import React from "react";
import { Box, VStack, HStack, Badge, Text, Icon } from "@chakra-ui/react";
import { GoPerson } from "react-icons/go";
import { MdOutlineTitle } from "react-icons/md";
import LikeBadge from "../common/LikeBadge";
import ScheduleDetailDialog from "./ScheduleDetailDialog";

export interface ScheduleItem {
  id: string;
  uuid: string;
  title: string;
  streamerName: string;
  status: "scheduled" | "break" | "tbd";
  startTime?: string | null;
  likeCount?: number;
  isLiked?: boolean;
}

interface ScheduleCardProps {
  schedule: ScheduleItem;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule }) => {
  // 상태별 스타일 정의
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "scheduled":
        return {
          label: "예정",
          colorScheme: "blackAlpha",
          bg: "black",
          color: "white",
          showIcon: true,
        };
      case "break":
        return {
          label: "휴방",
          colorScheme: "gray",
          bg: "red.100",
          color: "red.600",
          showIcon: false,
          borderColor: "red.200",
        };
      case "tbd":
        return {
          label: "시간미정",
          colorScheme: "gray",
          bg: "gray.200",
          color: "gray.600",
          showIcon: false,
          borderColor: "gray.300",
        };
      default:
        return {
          label: "기타",
          colorScheme: "gray",
          bg: "gray.200",
          color: "gray.600",
          showIcon: false,
        };
    }
  };

  // 시간 포맷팅 함수
  const formatTime = (timeString: string | null) => {
    if (!timeString) return null;

    try {
      const timeParts = timeString.split(":");
      return `${timeParts[0]}:${timeParts[1]}`;
    } catch {
      return timeString;
    }
  };

  const statusConfig = getStatusConfig(schedule.status);

  return (
    <VStack
      gap={1}
      align="start"
      p={1.5}
      borderRadius={6}
      borderWidth={1}
      _hover={{
        bg: "neutral.100",
      }}
    >
      {/* 상태/시간 배지 */}
      <HStack gap={0.5}>
        <Badge
          bg={statusConfig.bg}
          color={statusConfig.color}
          fontSize="10px"
          borderWidth="1px"
          borderColor={statusConfig.borderColor || ""}
        >
          {schedule.status === "scheduled" && schedule.startTime
            ? formatTime(schedule.startTime)
            : statusConfig.label}
        </Badge>
        <LikeBadge
          scheduleUuid={schedule.uuid}
          initialLikeCount={schedule.likeCount ?? 0}
          initialIsLiked={schedule.isLiked ?? false}
        />
      </HStack>

      <ScheduleDetailDialog scheduleUuid={schedule.uuid}>
        <Box
          w="full"
          cursor="pointer"
          _hover={{
            "& .schedule_streamer": {
              textDecoration: "underline",
            },
          }}
        >
          {/* 일정 제목 */}
          <HStack gap={1}>
            <Icon size="xs">
              <MdOutlineTitle />
            </Icon>
            <Text
              fontSize="xs"
              color="neutral.500"
              lineClamp="2"
              lineHeight={1.2}
            >
              {schedule.title}
            </Text>
          </HStack>

          {/* 스트리머 */}
          <Box
            flex="1"
            borderRadius={2}
            className="schedule_streamer"
            display="flex"
            gap={1}
            alignItems="center"
            w="full"
          >
            <Icon size="xs">
              <GoPerson />
            </Icon>
            <Text
              fontSize="xs"
              color="neutral.900"
              fontWeight="inherit"
              lineClamp="1"
            >
              {schedule.streamerName}
            </Text>
          </Box>
        </Box>
      </ScheduleDetailDialog>
    </VStack>
  );
};

export default ScheduleCard;
