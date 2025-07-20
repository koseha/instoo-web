import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  VStack,
  HStack,
  Badge,
  Container,
  Heading,
  IconButton,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useMyStreamersStore } from "@/stores/my-streamers.store";
import {
  GetSchedulesDto,
  ScheduleService,
  SchedulesResponseDto,
} from "@/services/schedule.service";
import { GoPerson } from "react-icons/go";
import LikeBadge from "../common/LikeBadge";

// API 타입 정의

const StreamerSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedulesData, setSchedulesData] = useState<SchedulesResponseDto[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const { fetchTargetUuids } = useMyStreamersStore();

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
    if (fetchTargetUuids.length === 0) {
      setSchedulesData([]);
      return;
    }

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const params: GetSchedulesDto = {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      streamerUuids: fetchTargetUuids,
    };

    fetchSchedules(params);
  }, [currentDate, JSON.stringify(fetchTargetUuids)]);

  // 유틸리티 함수들
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // API 데이터에서 특정 날짜의 일정 가져오기
  const getSchedulesForDate = (dateKey: string) => {
    const dayData = schedulesData.find((d) => d.scheduleDate === dateKey);
    if (!dayData) return [];

    const allSchedules = [
      ...dayData.breaks.map((s) => ({ ...s, status: "break" })),
      ...dayData.tbd.map((s) => ({ ...s, status: "tbd" })),
      ...dayData.scheduled.map((s) => ({ ...s, status: "scheduled" })),
    ];

    return allSchedules;
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
        };
      case "tbd":
        return {
          label: "시간미정",
          colorScheme: "gray",
          bg: "gray.100",
          color: "gray.600",
          showIcon: false,
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
      // "HH:mm:ss" 또는 "HH:mm" 형태를 "HH:mm"으로 변환
      const timeParts = timeString.split(":");
      return `${timeParts[0]}:${timeParts[1]}`;
    } catch {
      return timeString;
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <Container maxW="6xl" p={0}>
      {/* 헤더 */}
      <Flex justify="space-between" align="center" mb={4}>
        <HStack gap={4}>
          <Heading size="lg" color="black">
            {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
          </Heading>
          <HStack gap={1}>
            <IconButton
              size="sm"
              variant="ghost"
              onClick={() => navigateMonth(-1)}
              aria-label="이전 달"
              disabled={loading}
            >
              <LuChevronLeft />
            </IconButton>
            <IconButton
              size="sm"
              variant="ghost"
              onClick={() => navigateMonth(1)}
              aria-label="다음 달"
              disabled={loading}
            >
              <LuChevronRight />
            </IconButton>
          </HStack>
          {loading && <Spinner size="sm" />}
        </HStack>
      </Flex>

      {/* 캘린더 그리드 */}
      <Box
        border="1px"
        borderColor="gray.200"
        borderRadius="xl"
        overflow="hidden"
        bg="white"
        shadow="sm"
      >
        {/* 요일 헤더 */}
        <Grid
          templateColumns="repeat(7, 1fr)"
          bg="gray.50"
          borderBottom="1px"
          borderColor="gray.200"
        >
          {dayNames.map((day, index) => (
            <GridItem key={day} p={4} textAlign="center">
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={
                  index === 0
                    ? "red.500"
                    : index === 6
                      ? "blue.500"
                      : "gray.700"
                }
              >
                {day}
              </Text>
            </GridItem>
          ))}
        </Grid>

        {/* 날짜 그리드 */}
        <Grid templateColumns="repeat(7, 1fr)">
          {days.map((date, index) => {
            const dateKey = formatDateKey(date);
            const daySchedules = getSchedulesForDate(dateKey);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);

            return (
              <GridItem
                key={index}
                minH="160px"
                borderWidth="1px"
                borderColor="gray.100"
                p={3}
              >
                {/* 날짜 */}
                <HStack
                  justify="space-between"
                  align="flex-start"
                  mb={3}
                  bg={isTodayDate ? "blue.200" : "transparent"}
                  borderRadius={isTodayDate ? "5px" : "none"}
                >
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color={
                      !isCurrentMonthDay
                        ? "gray.300"
                        : isTodayDate
                          ? "gray.700"
                          : index % 7 === 0
                            ? "red.500"
                            : index % 7 === 6
                              ? "blue.500"
                              : "gray.700"
                    }
                    borderRadius="full"
                    w={isTodayDate ? 6 : "auto"}
                    h={isTodayDate ? 6 : "auto"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {date.getDate()}
                  </Text>
                </HStack>

                {/* 간소화된 일정 목록 */}
                <VStack gap={1.5} align="stretch">
                  {daySchedules.map((schedule) => {
                    const statusConfig = getStatusConfig(schedule.status);

                    return (
                      <VStack key={schedule.uuid} gap={0.5} align="start">
                        {/* 상태/시간 배지 */}
                        <HStack gap={1}>
                          <Badge
                            bg={statusConfig.bg}
                            color={statusConfig.color}
                            fontSize="10px"
                            border={schedule.status === "tbd" ? "1px" : "none"}
                            borderColor={
                              schedule.status === "tbd"
                                ? "gray.300"
                                : "transparent"
                            }
                          >
                            {schedule.status === "scheduled" &&
                            schedule.startTime
                              ? formatTime(schedule.startTime)
                              : statusConfig.label}
                          </Badge>
                          <LikeBadge
                            scheduleUuid={schedule.uuid}
                            initialLikeCount={schedule.likeCount ?? 0}
                            initialIsLiked={schedule.isLiked ?? false}
                          />
                        </HStack>

                        {/* 스트리머 */}
                        <Box
                          flex="1"
                          cursor="pointer"
                          borderRadius={2}
                          _hover={{
                            bg: "blue.100",
                            textDecoration: "underline",
                          }}
                          display="flex"
                          gap={1}
                          alignItems="center"
                        >
                          <Icon size="xs">
                            <GoPerson />
                          </Icon>
                          <Text
                            fontSize="xs"
                            color="neutral.800"
                            fontWeight="inherit"
                          >
                            {schedule.streamerName}
                          </Text>
                        </Box>
                      </VStack>
                    );
                  })}
                </VStack>
              </GridItem>
            );
          })}
        </Grid>
      </Box>
    </Container>
  );
};

export default StreamerSchedule;
