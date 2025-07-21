"use client";

import { Box, Flex, IconButton, Tabs, Text } from "@chakra-ui/react";
import { MdVerified, MdOutlineHourglassBottom } from "react-icons/md";
import { FaRedo } from "react-icons/fa";
import { useState, useCallback } from "react";
import StreamerTable from "@/components/streamer/StreamerTable";
import StreamerDetailDialog from "@/components/streamer/StreamerDetailDialog";
import RegisterStreamerDialog from "@/components/streamer/RegisterStreamerDialog";
import { useStreamerList } from "@/hooks/useStreamerList";
import StreamerFilters from "@/components/streamer/StreamerFilter";
import { useScrolled } from "@/hooks/useScrolled";

type Platform = "chzzk" | "soop" | "youtube";

export default function Streamers() {
  const [activeTab, setActiveTab] = useState<"verified" | "loading">(
    "verified",
  );
  const [searchName, setSearchName] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const isScrolled = useScrolled(60); // 60px 스크롤 후 버튼 표시

  // 스트리머 목록 데이터 관리
  const {
    data,
    isLoading,
    error,
    currentPage,
    handlePageChange,
    selectedStreamer,
    isDetailOpen,
    openDetail,
    closeDetail,
  } = useStreamerList({
    isVerified: activeTab === "verified",
    platforms: selectedPlatforms,
    searchName,
    searchTrigger,
  });

  // 모든 핸들러를 useCallback으로 메모이제이션
  const handleSearch = useCallback(() => {
    setSearchTrigger((prev) => prev + 1);
  }, []);

  const handlePlatformChange = useCallback((platform: Platform) => {
    setSelectedPlatforms((prev) => {
      const newPlatforms = prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform];
      return newPlatforms;
    });
    setSearchTrigger((prev) => prev + 1);
  }, []);

  const handleRefresh = useCallback(() => {
    setSearchName("");
    setSelectedPlatforms([]);
    setSearchTrigger((prev) => prev + 1);
  }, []);

  const handleTabChange = useCallback((details: { value: string }) => {
    setActiveTab(details.value as "verified" | "loading");
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchName(value);
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
          스트리머 목록 보기
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
          팬들이 함께 관리하는 방송인 정보
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
                bg: "blue.100",
                "& .selected_streamer-verified": {
                  color: "blue.600",
                  transform: "scale(1.1)",
                },
              }}
              style={{
                willChange: "background-color",
              }}
            >
              <Box
                as={MdVerified}
                className="selected_streamer-verified"
                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                style={{
                  willChange: "transform, color",
                  backfaceVisibility: "hidden",
                }}
              />
              인증됨
            </Tabs.Trigger>

            {/* 요청 중 탭 - 애니메이션 최적화 */}
            <Tabs.Trigger
              value="loading"
              transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
              _selected={{
                bg: "orange.100",
                "& .selected_streamer-loading": {
                  color: "orange.600",
                  transform: "rotate(180deg)",
                },
              }}
              style={{
                willChange: "background-color",
              }}
            >
              <Box
                as={MdOutlineHourglassBottom}
                className="selected_streamer-loading"
                transform="rotate(0deg)"
                transition="transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                style={{
                  willChange: "transform, color",
                  backfaceVisibility: "hidden",
                }}
              />
              요청 중
            </Tabs.Trigger>

            <Tabs.Indicator
              rounded="l2"
              transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            />
          </Tabs.List>
          <RegisterStreamerDialog />
        </Flex>

        {/* 필터 */}
        <StreamerFilters
          searchName={searchName}
          selectedPlatforms={selectedPlatforms}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearch}
          onPlatformChange={handlePlatformChange}
          activeTab={activeTab}
        />

        {/* 탭 컨텐츠 */}
        <Tabs.Content value="verified">
          <Flex justify="space-between" align="center" mb={1}>
            <Text fontFamily="body" fontSize="sm" color="neutral.400">
              인증된 스트리머의 방송 일정을 자유롭게 등록하고 수정할 수 있어요
            </Text>
            <Text fontSize="sm" color="neutral.400">
              {isLoading ? "로딩 중..." : `총 ${data.totalCount}명`}
            </Text>
          </Flex>

          {error && (
            <Text color="red.500" fontSize="sm" mb={2}>
              오류: {error}
            </Text>
          )}

          <StreamerTable
            streamers={data.data}
            isVerified={true}
            isLoading={isLoading}
            currentPage={currentPage}
            pageSize={data.size}
            totalCount={data.totalCount}
            searchName={searchName}
            platforms={selectedPlatforms}
            onDetailClick={openDetail}
            onPageChange={handlePageChange}
          />
        </Tabs.Content>

        <Tabs.Content value="loading">
          <Flex justify="space-between" align="center" mb={1}>
            <Text fontFamily="body" fontSize="sm" color="neutral.400">
              관리자 검토 중인 스트리머들입니다. 곧 인증될 예정이에요
            </Text>
            <Text fontSize="sm" color="neutral.400">
              {isLoading ? "로딩 중..." : `총 ${data.totalCount}명`}
            </Text>
          </Flex>

          {error && (
            <Text color="red.500" fontSize="sm" mb={2}>
              오류: {error}
            </Text>
          )}

          <StreamerTable
            streamers={data.data}
            isVerified={false}
            isLoading={isLoading}
            currentPage={currentPage}
            pageSize={data.size}
            totalCount={data.totalCount}
            searchName={searchName}
            platforms={selectedPlatforms}
            onDetailClick={openDetail}
            onPageChange={handlePageChange}
          />
        </Tabs.Content>
      </Tabs.Root>

      {/* 상세 다이얼로그 */}
      <StreamerDetailDialog
        isOpen={isDetailOpen}
        onClose={closeDetail}
        streamer={selectedStreamer}
      />

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
