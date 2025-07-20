// src/components/schedule/types.ts
export interface ScheduleFormData {
  title: string;
  scheduleDate: string;
  startTime: string;
  status: "BREAK" | "TIME_TBD" | "SCHEDULED";
  description?: string;
  streamerUuid: string;
}
