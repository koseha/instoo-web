// stores/modal.store.ts
import { create } from "zustand";

interface ModalState {
  // 현재 열려있는 모달들
  openModals: Set<string>;

  // 모달 열기
  openModal: (modalId: string) => void;

  // 모달 닫기
  closeModal: (modalId: string) => void;

  // 모든 모달 닫기
  closeAllModals: () => void;

  // 특정 모달이 열려있는지 확인
  isModalOpen: (modalId: string) => boolean;
}

export const useModalStore = create<ModalState>((set, get) => ({
  openModals: new Set(),

  openModal: (modalId: string) => {
    set((state) => ({
      openModals: new Set([...state.openModals, modalId]),
    }));
  },

  closeModal: (modalId: string) => {
    set((state) => {
      const newOpenModals = new Set(state.openModals);
      newOpenModals.delete(modalId);
      return { openModals: newOpenModals };
    });
  },

  closeAllModals: () => {
    set({ openModals: new Set() });
  },

  isModalOpen: (modalId: string) => {
    return get().openModals.has(modalId);
  },
}));

// 모달 ID 상수들
export const MODAL_IDS = {
  MY_PROFILE: "myProfile",
  // 다른 모달들도 여기에 추가
} as const;

// 타입 안전성을 위한 타입
export type ModalId = (typeof MODAL_IDS)[keyof typeof MODAL_IDS];
