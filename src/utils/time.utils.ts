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
