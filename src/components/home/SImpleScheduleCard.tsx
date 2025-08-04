import React from "react";
import { HStack, Badge, Text, Icon, Box } from "@chakra-ui/react";
import { GoPerson } from "react-icons/go";
import ScheduleDetailDialog from "../schedule/ScheduleDetailDialog";

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
  searchName: string;
}

const SimpleScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  searchName,
}) => {
  // 검색어 매칭 여부 확인
  const isSearchMatch =
    searchName &&
    schedule.streamerName.toLowerCase().includes(searchName.toLowerCase());

  // 텍스트 하이라이트 함수
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <Box
          as="span"
          key={index}
          bg="yellow.200"
          color="yellow.800"
          px={0.5}
          borderRadius="sm"
          fontWeight="bold"
          animation="highlight 0.3s ease-in-out"
          css={{
            "@keyframes highlight": {
              "0%": { backgroundColor: "yellow.300", transform: "scale(1.05)" },
              "100%": { backgroundColor: "yellow.200", transform: "scale(1)" },
            },
          }}
        >
          {part}
        </Box>
      ) : (
        part
      ),
    );
  };

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
    <ScheduleDetailDialog scheduleUuid={schedule.uuid}>
      <HStack
        gap={1}
        px={0.5}
        bg={isSearchMatch ? "blue.50" : "transparent"}
        borderLeft={isSearchMatch ? "3px solid" : "3px solid transparent"}
        borderLeftColor={isSearchMatch ? "blue.400" : "transparent"}
        transition="all 0.3s ease-in-out"
        transform={isSearchMatch ? "translateX(2px)" : "translateX(0)"}
        boxShadow={
          isSearchMatch ? "0 2px 8px rgba(59, 130, 246, 0.15)" : "none"
        }
        _hover={{
          bg: isSearchMatch ? "blue.100" : "neutral.100",
          transform: isSearchMatch ? "translateX(3px)" : "translateX(0)",
          "& .schedule_streamer": {
            textDecoration: "underline",
          },
        }}
        cursor="pointer"
        w="full"
        borderRadius="md"
        animation={isSearchMatch ? "searchPulse 0.6s ease-in-out" : "none"}
        css={{
          "@keyframes searchPulse": {
            "0%": {
              backgroundColor: "blue.100",
              transform: "scale(1.02) translateX(2px)",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)",
            },
            "50%": {
              backgroundColor: "blue.75",
              transform: "scale(1.01) translateX(2px)",
              boxShadow: "0 2px 8px rgba(59, 130, 246, 0.15)",
            },
            "100%": {
              backgroundColor: "blue.50",
              transform: "scale(1) translateX(2px)",
              boxShadow: "0 2px 8px rgba(59, 130, 246, 0.15)",
            },
          },
        }}
      >
        {/* 상태/시간 배지 */}
        <Badge
          bg={statusConfig.bg}
          color={statusConfig.color}
          fontSize="10px"
          borderWidth="1px"
          borderColor={statusConfig.borderColor || ""}
          opacity={isSearchMatch ? 1 : 0.9}
          transform={isSearchMatch ? "scale(1.05)" : "scale(1)"}
          transition="all 0.2s ease-in-out"
        >
          {schedule.status === "scheduled" && schedule.startTime
            ? formatTime(schedule.startTime)
            : statusConfig.label}
        </Badge>

        {/* 스트리머 */}
        <HStack gap={1} className="schedule_streamer" w="full">
          <Icon
            size="xs"
            color={isSearchMatch ? "blue.600" : "inherit"}
            transition="color 0.2s ease-in-out"
          >
            <GoPerson />
          </Icon>
          <Text
            fontSize="xs"
            color={isSearchMatch ? "blue.800" : "neutral.900"}
            fontWeight={isSearchMatch ? "semibold" : "inherit"}
            lineClamp="1"
            transition="all 0.2s ease-in-out"
          >
            {highlightText(schedule.streamerName, searchName)}
          </Text>
        </HStack>

        {/* 검색 매칭 표시 아이콘 */}
        {isSearchMatch && (
          <Box
            w="6px"
            h="6px"
            bg="blue.400"
            borderRadius="full"
            animation="searchIndicator 1s ease-in-out infinite"
            css={{
              "@keyframes searchIndicator": {
                "0%, 100%": { opacity: 0.6, transform: "scale(1)" },
                "50%": { opacity: 1, transform: "scale(1.2)" },
              },
            }}
          />
        )}
      </HStack>
    </ScheduleDetailDialog>
  );
};

export default SimpleScheduleCard;
