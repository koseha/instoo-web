// app/streamers/page.tsx (간소화된 버전)
"use client";

import { Box, Flex, IconButton, Tabs, Text } from "@chakra-ui/react";
import { MdVerified, MdOutlineHourglassBottom } from "react-icons/md";
import { FaRedo } from "react-icons/fa";
import { useState } from "react";
import StreamerTable from "@/components/streamer/StreamerTable";
import StreamerDetailDialog from "@/components/streamer/StreamerDetailDialog";
import RegisterStreamerDialog from "@/components/streamer/RegisterStreamerDialog";
import { useStreamerList } from "@/hooks/useStreamerList";
import StreamerFilters from "@/components/streamer/StreamerFilter";

type Platform = "chzzk" | "soop" | "youtube";

export default function Streamers() {
  const [activeTab, setActiveTab] = useState<"verified" | "loading">(
    "verified",
  );
  const [searchName, setSearchName] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [searchTrigger, setSearchTrigger] = useState(0);

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

  // 검색 실행
  const handleSearch = () => {
    setSearchTrigger((prev) => prev + 1);
  };

  // 플랫폼 변경 (즉시 검색)
  const handlePlatformChange = (platform: Platform) => {
    setSelectedPlatforms((prev) => {
      const newPlatforms = prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform];
      return newPlatforms;
    });
    setSearchTrigger((prev) => prev + 1);
  };

  // 새로고침
  const handleRefresh = () => {
    setSearchName("");
    setSelectedPlatforms([]);
    setSearchTrigger((prev) => prev + 1);
  };

  return (
    <>
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
          팬들이 함께 관리하는 방송인 정보
        </Text>
      </Box>

      {/* 탭과 등록 버튼 */}
      <Tabs.Root
        defaultValue="verified"
        variant="plain"
        onValueChange={(details) =>
          setActiveTab(details.value as "verified" | "loading")
        }
      >
        <Flex justify="space-between" align="end">
          <Tabs.List bg="bg.muted" rounded="l3" p="1">
            <Tabs.Trigger
              value="verified"
              _selected={{
                "& .selected_streamer-verified": {
                  color: "blue.500",
                  transform: "scale(1.1)",
                  transition: "all 0.2s ease-in-out",
                },
              }}
            >
              <Box
                as={MdVerified}
                className="selected_streamer-verified"
                transition="all 0.2s ease-in-out"
                _hover={{ transform: "scale(1.05)" }}
              />
              인증됨
            </Tabs.Trigger>
            <Tabs.Trigger
              value="loading"
              _selected={{
                "& .selected_streamer-loading": {
                  color: "orange.500",
                  transform: "rotate(180deg)",
                  transition: "transform 1s ease",
                },
              }}
            >
              <Box
                as={MdOutlineHourglassBottom}
                className="selected_streamer-loading"
                transform="rotate(0deg)"
                transition="transform 1s ease"
              />
              요청 중
            </Tabs.Trigger>
            <Tabs.Indicator rounded="l2" />
          </Tabs.List>
          <RegisterStreamerDialog />
        </Flex>

        {/* 필터 */}
        <StreamerFilters
          searchName={searchName}
          selectedPlatforms={selectedPlatforms}
          onSearchChange={setSearchName}
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
    </>
  );
}
