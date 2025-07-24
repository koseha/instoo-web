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
  Separator,
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
import ScheduleDetailDialog from "./ScheduleDetailDialog";
import { useLikeStore } from "@/stores/schedule-like.store";
import { MdOutlineTitle } from "react-icons/md";

const StreamerSchedule = ({ otherTrigger }: { otherTrigger: number }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedulesData, setSchedulesData] = useState<SchedulesResponseDto[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const { getScheduleFetchUuids } = useMyStreamersStore();
  const { likedMap, likeCountMap } = useLikeStore();

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
    const scheduleFetchUuids = getScheduleFetchUuids();
    if (scheduleFetchUuids.length === 0) {
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
      startDate: formatDateKey(startDate), // 🔧 로컬 기준 포맷팅 사용
      endDate: formatDateKey(endDate), // 🔧 로컬 기준 포맷팅 사용
      streamerUuids: scheduleFetchUuids,
    };

    fetchSchedules(params);
  }, [currentDate, JSON.stringify(getScheduleFetchUuids()), otherTrigger]);

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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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

  // API 데이터에서 특정 날짜의 일정 가져오기 (store 값으로 업데이트)
  const getSchedulesForDate = (dateKey: string) => {
    const dayData = schedulesData.find((d) => d.scheduleDate === dateKey);
    if (!dayData) return [];

    const allSchedules = [
      ...dayData.breaks.map((s) => ({ ...s, status: "break" })),
      ...dayData.tbd.map((s) => ({ ...s, status: "tbd" })),
      ...dayData.scheduled.map((s) => ({ ...s, status: "scheduled" })),
    ];

    // store의 값으로 좋아요 상태 업데이트
    return allSchedules.map((schedule) => ({
      ...schedule,
      isLiked: likedMap[schedule.uuid] ?? schedule.isLiked,
      likeCount: likeCountMap[schedule.uuid] ?? schedule.likeCount,
    }));
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
                p={1}
              >
                {/* 날짜 */}
                <HStack
                  justify="space-between"
                  align="flex-start"
                  mb={1}
                  px={2}
                  mt={2}
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
                <Separator mb={1.5} mx={2} />

                {/* 간소화된 일정 목록 */}
                <VStack gap={1} align="stretch">
                  {daySchedules.map((schedule) => {
                    const statusConfig = getStatusConfig(schedule.status);

                    return (
                      <VStack
                        key={schedule.uuid}
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
