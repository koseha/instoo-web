import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

// utc to "yyyy년 MM월 dd일"
export const formatUTCToKoreanDate = (utc: string | null): string => {
  if (!utc) return "";
  const timeZone = "Asia/Seoul";
  const date = new Date(utc);
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, "yyyy년 MM월 dd일");
};

export const formatDateToKoreanDate = (scheduleDate: string): string => {
  const split = scheduleDate.split("-");
  return `${split[0]}년 ${split[1]}월 ${split[2]}일`;
};

// utc to "yyyy.MM.dd HH:mm"
export const formatUTCToKoreanDateTime = (utc: string | null): string => {
  if (!utc) return "";
  const timeZone = "Asia/Seoul";
  const date = new Date(utc);
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, "yyyy.MM.dd HH:mm");
};

// 오늘 날짜를 "yyyy-MM-dd" 형식으로 반환 (한국 시간 기준)
export const getTodayDateString = (): string => {
  const timeZone = "Asia/Seoul";
  const now = new Date();
  const zonedDate = toZonedTime(now, timeZone);
  return format(zonedDate, "yyyy-MM-dd");
};

// 날짜가 오늘 이전인지 확인하는 함수 (한국 시간 기준)
export const isDateBeforeToday = (dateStr: string): boolean => {
  if (!dateStr) return false;
  const today = getTodayDateString();
  return dateStr < today;
};

// 날짜가 오늘인지 확인하는 함수 (한국 시간 기준)
export const isToday = (dateStr: string): boolean => {
  if (!dateStr) return false;
  const today = getTodayDateString();
  return dateStr === today;
};
