// src/components/schedule/Calendar.tsx

import React from "react";
import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  HStack,
  Container,
  Heading,
  IconButton,
  Spinner,
  Separator,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export interface CalendarItem {
  id: string;
  // [key: string]: any; // 유연한 데이터 구조를 위해
}

export interface CalendarProps<T extends CalendarItem> {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  loading?: boolean;
  getItemsForDate: (dateKey: string) => T[];
  renderItem: (item: T, dateKey: string) => React.ReactNode;
  title?: string;
}

const Calendar = <T extends CalendarItem>({
  currentDate,
  onDateChange,
  loading = false,
  getItemsForDate,
  renderItem,
  title,
}: CalendarProps<T>) => {
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
    onDateChange(newDate);
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
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        py={2}
      >
        <HStack gap={4}>
          <Heading size="lg" color="black">
            {title ||
              `${currentDate.getFullYear()}년 ${monthNames[currentDate.getMonth()]}`}
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
        <Box flex={1}></Box>
      </Flex>

      {/* 캘린더 그리드 */}
      <Box
        border="1px"
        borderColor="gray.200"
        borderRadius="xl"
        overflow="hidden"
        bg="white"
        shadow="sm"
        top={31}
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
            const dayItems = getItemsForDate(dateKey);
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

                {/* 아이템 목록 */}
                <Box>
                  {dayItems.map((item) => (
                    <Box key={item.id} mb={1}>
                      {renderItem(item, dateKey)}
                    </Box>
                  ))}
                </Box>
              </GridItem>
            );
          })}
        </Grid>
      </Box>
    </Container>
  );
};

export default Calendar;
