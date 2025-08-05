"use client";

import { useScrolled } from "@/hooks/useScrolled";
import { useCallback, useState, useEffect } from "react";
import StreamerFilters from "../streamer/StreamerFilter";
import {
  GetSchedulesDto,
  ScheduleService,
  SchedulesResponseDto,
} from "@/services/schedule.service";
import { useLikeStore } from "@/stores/schedule-like.store";
import { ScheduleItem } from "../schedule/ScheduleCard";
import Calendar, { CalendarItem } from "../schedule/Calendar";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { FaRedo } from "react-icons/fa";
import SimpleScheduleCard from "./SImpleScheduleCard";

type Platform = "chzzk" | "soop" | "youtube";

// ScheduleItem을 CalendarItem으로 확장
interface CalendarScheduleItem extends ScheduleItem, CalendarItem {}

const HomeSchedule = () => {
  const [searchName, setSearchName] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    "chzzk",
    "soop",
    "youtube",
  ]);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const isScrolled = useScrolled(60); // 60px 스크롤 후 버튼 표시

  // Calendar 관련 상태
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedulesData, setSchedulesData] = useState<SchedulesResponseDto[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const { likedMap, likeCountMap } = useLikeStore();

  const handleSearchChange = useCallback((value: string) => {
    setSearchName(value);
  }, []);

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

  // API 호출 함수
  const fetchSchedules = async (params: GetSchedulesDto) => {
    setLoading(true);
    try {
      const data = await ScheduleService.getStreamerSchedules(params);
      setSchedulesData(data);
    } catch (err) {
      console.error("API 호출 에러:", err);
    } finally {
      setLoading(false);
    }
  };

  // 월 변경 시 데이터 로드
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const formatDateKey = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const params: GetSchedulesDto = {
      startDate: formatDateKey(startDate),
      endDate: formatDateKey(endDate),
      platforms: selectedPlatforms,
    };

    fetchSchedules(params);
  }, [currentDate, searchTrigger, selectedPlatforms]);

  // API 데이터에서 특정 날짜의 일정 가져오기
  const getSchedulesForDate = (dateKey: string): CalendarScheduleItem[] => {
    const dayData = schedulesData.find((d) => d.scheduleDate === dateKey);
    if (!dayData) return [];

    const allSchedules = [
      ...dayData.breaks.map((s) => ({ ...s, status: "break" as const })),
      ...dayData.tbd.map((s) => ({ ...s, status: "tbd" as const })),
      ...dayData.scheduled.map((s) => ({ ...s, status: "scheduled" as const })),
    ];

    // store의 값으로 좋아요 상태 업데이트하고 CalendarItem 인터페이스에 맞게 id 추가
    return allSchedules.map((schedule) => ({
      ...schedule,
      id: schedule.uuid, // CalendarItem의 id 요구사항 충족
      isLiked: likedMap[schedule.uuid] ?? schedule.isLiked,
      likeCount: likeCountMap[schedule.uuid] ?? schedule.likeCount,
    }));
  };

  const handleRefresh = useCallback(() => {
    setSearchTrigger((prev) => prev + 1);
  }, []);

  // 스케줄 카드 렌더링 함수
  const renderScheduleItem = (item: CalendarScheduleItem) => {
    return <SimpleScheduleCard schedule={item} searchName={searchName} />;
  };

  return (
    <>
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
          팬들이 함께 관리하는 스트리머 일정 정보
        </Text>
      </Box>
      <StreamerFilters
        searchName={searchName}
        selectedPlatforms={selectedPlatforms}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearch}
        onPlatformChange={handlePlatformChange}
        activeTab="verified"
      />

      <Calendar
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        loading={loading}
        getItemsForDate={getSchedulesForDate}
        renderItem={renderScheduleItem}
      />
    </>
  );
};

export default HomeSchedule;
