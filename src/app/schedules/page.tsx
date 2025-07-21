"use client";

import StreamerSchedule from "@/components/schedule/StreamerSchedule";
import { Box, Flex, IconButton, Tabs, Text } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { FaRedo } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
// import { FaCalendarWeek } from "react-icons/fa";
import { FaCalendarDay } from "react-icons/fa";

export default function Schedules() {
  const [activeTab, setActiveTab] = useState<"verified" | "loading">(
    "verified",
  );
  const [searchTrigger, setSearchTrigger] = useState(0);

  const handleTabChange = useCallback((details: { value: string }) => {
    setActiveTab(details.value as "verified" | "loading");
  }, []);

  const handleRefresh = useCallback(() => {
    setSearchTrigger((prev) => prev + 1);
  }, []);

  return (
    <Box>
      {/* 헤더 */}
      <Box mb={4}>
        <Text
          color="neutral.900"
          fontFamily="heading"
          fontSize="xl"
          fontWeight={700}
          mb={1}
          display="flex"
          alignItems="center"
          gap={2}
        >
          스트리머 일정 모아보기
          <IconButton
            size="xs"
            variant="ghost"
            onClick={handleRefresh}
            _hover={{
              bg: "neutral.100",
              transform: "rotate(180deg)",
              color: "neutral.700",
            }}
            transition="all 0.3s ease"
            borderRadius="full"
            color="neutral.400"
          >
            <FaRedo />
          </IconButton>
        </Text>
        <Text color="neutral.500" fontFamily="body" fontSize="md">
          팬들이 함께 관리하는 방송인 일정 정보
        </Text>
      </Box>

      {/* 탭과 등록 버튼 */}
      <Tabs.Root
        defaultValue="verified"
        variant="plain"
        onValueChange={handleTabChange}
      >
        <Flex justify="space-between" align="end">
          <Tabs.List bg="bg.muted" rounded="l3" p="1">
            {/* 인증됨 탭 - 애니메이션 최적화 */}
            <Tabs.Trigger
              value="verified"
              transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
              _selected={{
                bg: "teal.100",
                "& .selected_streamer-verified": {
                  color: "teal.600",
                  transform: "scale(1.1)",
                },
              }}
              style={{
                willChange: "background-color",
              }}
            >
              <Box
                as={FaRegCalendarAlt}
                className="selected_streamer-verified"
                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                style={{
                  willChange: "transform, color",
                  backfaceVisibility: "hidden",
                }}
              />
              Monthly
            </Tabs.Trigger>

            {/* 요청 중 탭 - 애니메이션 최적화 */}
            <Tabs.Trigger
              value="loading"
              transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
              _selected={{
                bg: "red.100",
                "& .selected_streamer-verified": {
                  color: "red.600",
                  transform: "scale(1.1)",
                },
              }}
              style={{
                willChange: "background-color",
              }}
              disabled={true}
            >
              <Box
                as={FaCalendarDay}
                className="selected_streamer-verified"
                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                style={{
                  willChange: "transform, color",
                  backfaceVisibility: "hidden",
                }}
              />
              Daily
            </Tabs.Trigger>

            <Tabs.Indicator
              rounded="l2"
              transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            />
          </Tabs.List>
        </Flex>

        {/* 탭 컨텐츠 */}
        <Tabs.Content value="verified">
          <StreamerSchedule otherTrigger={searchTrigger} />
        </Tabs.Content>

        <Tabs.Content value="loading">앙앙</Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
