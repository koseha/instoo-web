// src/store/schedule-editor.store.ts
import { StreamerSummary } from "@/services/schedule.service";
import { create } from "zustand";

interface ScheduleData {
  uuid: string; // edit
  title: string; // create | edit
  scheduleDate: string; // create | edit
  startTime?: string; // create | edit
  status: "BREAK" | "TIME_TBD" | "SCHEDULED"; // create | edit
  description?: string; // create | edit
  streamer?: StreamerSummary; // create
  lastUpdatedAt: string; // edit, 충돌 감지용
}

interface ModalStore {
  // 모달 상태
  isScheduleModalOpen: boolean;
  modalMode: "create" | "edit";

  // 편집할 일정 데이터
  editingSchedule: ScheduleData | null;

  // 액션들
  openScheduleCreate: () => void;
  openScheduleEdit: (schedule: ScheduleData) => void;
  closeScheduleModal: () => void;
  setEditingSchedule: (schedule: ScheduleData | null) => void;
}

export const useScheduleDialogStore = create<ModalStore>((set) => ({
  isScheduleModalOpen: false,
  modalMode: "create",
  editingSchedule: null,

  openScheduleCreate: () =>
    set({
      isScheduleModalOpen: true,
      modalMode: "create",
      editingSchedule: null,
    }),

  openScheduleEdit: (schedule: ScheduleData) =>
    set({
      isScheduleModalOpen: true,
      modalMode: "edit",
      editingSchedule: schedule,
    }),

  closeScheduleModal: () =>
    set({
      isScheduleModalOpen: false,
      editingSchedule: null,
    }),

  setEditingSchedule: (schedule: ScheduleData | null) =>
    set({
      editingSchedule: schedule,
    }),
}));
