"use client";

import StreamerSchedule from "@/components/schedule/StreamerSchedule";
import { Box, Flex, IconButton, Tabs, Text } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { FaRedo } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaCalendarDay } from "react-icons/fa";
import { useScrolled } from "@/hooks/useScrolled";

export default function Schedules() {
  const [activeTab, setActiveTab] = useState<"verified" | "loading">(
    "verified",
  );
  const [searchTrigger, setSearchTrigger] = useState(0);
  const isScrolled = useScrolled(60); // 100px 스크롤 후 버튼 표시

  const handleTabChange = useCallback((details: { value: string }) => {
    setActiveTab(details.value as "verified" | "loading");
  }, []);

  const handleRefresh = useCallback(() => {
    setSearchTrigger((prev) => prev + 1);
  }, []);

  return (
    <Box position="relative">
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
          {/* 기본 헤더의 새로고침 버튼 - 스크롤 시 숨김 */}
          <IconButton
            size="xs"
            variant="ghost"
            onClick={handleRefresh}
            opacity={isScrolled ? 0 : 1}
            visibility={isScrolled ? "hidden" : "visible"}
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

      {/* 플로팅 새로고침 버튼 - 스크롤 시 우하단에 고정 */}
      <IconButton
        size="lg"
        position="fixed"
        bottom="6"
        right="6"
        zIndex={1000}
        bg="primary.white"
        color="neutral.600"
        border="1px solid"
        borderColor="neutral.200"
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
        borderRadius="full"
        onClick={handleRefresh}
        opacity={isScrolled ? 1 : 0}
        visibility={isScrolled ? "visible" : "hidden"}
        transform={isScrolled ? "scale(1)" : "scale(0.8)"}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        _hover={{
          bg: "neutral.50",
          transform: isScrolled ? "scale(1.05) rotate(180deg)" : "scale(0.8)",
          borderColor: "neutral.300",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
        }}
        _active={{
          transform: isScrolled ? "scale(0.95) rotate(180deg)" : "scale(0.8)",
        }}
        style={{
          willChange: "transform, opacity, visibility",
        }}
      >
        <FaRedo />
      </IconButton>
    </Box>
  );
}
